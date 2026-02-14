/**
 * BatikQR WhatsApp Bot — Entry Point
 * 
 * Menggunakan Baileys (@whiskeysockets/baileys) untuk koneksi WhatsApp
 * 
 * Cara penggunaan:
 * 1. npm install
 * 2. Edit RECIPIENT_NUMBER dengan nomor WA tujuan
 * 3. npm start
 * 4. Scan QR code yang muncul di terminal menggunakan WhatsApp
 * 5. Bot akan terhubung, scheduler harian + reminder periodik aktif
 * 6. Ketik "/ringkasan" untuk ringkasan penjualan singkat
 * 7. Ketik "/laporan" untuk laporan harian lengkap
 *
 * Environment variables:
 *   RECIPIENT_NUMBER  - Nomor WA penerima (default: 628123456789)
 *   REMINDER_INTERVAL - Jeda reminder dalam menit (default: 2)
 * 
 * Referensi PRD:
 * - Section 5.1C: WhatsApp Bot Reporting
 * - Section 7: System Rules (Rule 6, 7)
 * - Section 9.3: Bot & Notification (FR-11, FR-12, FR-13)
 */

const { default: makeWASocket, useMultiFileAuthState, fetchLatestWaWebVersion, makeCacheableSignalKeyStore, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const http = require('http');
const { generateDailyReport, generateSalesSummary, generateStatusNotification } = require('./formatter');
const { sendDailyReport, startScheduler, startReminder, getDeliveryLog, getReminderInterval, sendAndVerify } = require('./scheduler');
const { STORE } = require('./data');

// ============================================================
// Configuration
// ============================================================

// Nomor WhatsApp penerima laporan (format: 628xxxxx)
// Ganti dengan nomor WhatsApp owner toko (Bu Sari)
const RECIPIENT_NUMBER = process.env.RECIPIENT_NUMBER || '62812345678';
const RECIPIENT_JID = `${RECIPIENT_NUMBER}@s.whatsapp.net`;

// Auth session storage path
const AUTH_DIR = './auth_session';

// Port untuk REST API internal (diakses dari dashboard)
const API_PORT = parseInt(process.env.API_PORT || '3001', 10);

// ============================================================
// Main Bot Logic
// ============================================================

async function startBot() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║     🏪 BatikQR WhatsApp Bot v1.0        ║');
  console.log('║     Daily Report Automation              ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log(`\n🏪 Toko: ${STORE.name}`);
  console.log(`👤 Owner: ${STORE.owner}`);
  console.log(`📱 Penerima laporan: ${RECIPIENT_NUMBER}\n`);

  // Fetch latest WA Web version (required by Baileys v6)
  const { version } = await fetchLatestWaWebVersion({});
  console.log(`🌐 WA Web version: ${version.join('.')}`);

  // Load or create auth state
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

  // Create socket connection
  const sock = makeWASocket({
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
    },
    version,
    printQRInTerminal: false,
    logger: pino({ level: 'silent' }),
    browser: ['BatikQR Bot', 'Chrome', '1.0.0']
  });

  // ========== Connection Events ==========
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    // Display QR code in terminal
    if (qr) {
      console.log('\n📱 Scan QR code berikut dengan WhatsApp Anda:\n');
      qrcode.generate(qr, { small: true });
      console.log('\n💡 Buka WhatsApp → Menu (⋮) → Perangkat Tertaut → Tautkan Perangkat\n');
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      console.log(`\n⚠️ Connection closed. Status: ${statusCode}`);

      if (shouldReconnect) {
        console.log('🔄 Reconnecting in 5 seconds...\n');
        setTimeout(startBot, 5000);
      } else {
        console.log('🚪 Logged out. Please delete auth_session folder and restart.');
      }
    }

    if (connection === 'open') {
      console.log('\n✅ Bot berhasil terhubung ke WhatsApp!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      // Start the daily report scheduler (20:00 WIB)
      const scheduler = startScheduler(sock, RECIPIENT_JID);

      // Start periodic reminder (default: every 2 minutes, configurable)
      const reminder = startReminder(sock, RECIPIENT_JID);

      // Start HTTP API server untuk integrasi dashboard
      startAPIServer(sock);

      console.log('💡 Commands available (kirim pesan ke bot):');
      console.log('   • "/ringkasan"     → Ringkasan penjualan singkat');
      console.log('   • "/laporan"       → Kirim laporan harian lengkap');
      console.log('   • "/kirimlaporan"  → Kirim laporan ke penerima (dari dashboard)');
      console.log('   • "/status"        → Cek status bot dan delivery log');
      console.log('   • "/bantuan"       → Tampilkan bantuan\n');
    }
  });

  // Save credentials when updated
  sock.ev.on('creds.update', saveCreds);

  // ========== Message Handler ==========
  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const senderJid = msg.key.remoteJid;
    const text = (
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      ''
    ).toLowerCase().trim();

    console.log(`📩 Message from ${senderJid}: "${text}"`);

    // Command: /ringkasan — quick sales summary
    if (text === '/ringkasan' || text === 'ringkasan') {
      console.log('🧾 Sales summary requested');
      await sock.sendMessage(senderJid, {
        text: '⏳ Menyiapkan ringkasan penjualan...'
      });

      try {
        const summary = generateSalesSummary();
        await sock.sendMessage(senderJid, { text: summary });
        console.log('✅ Sales summary sent successfully');
      } catch (err) {
        console.error('❌ Failed to send sales summary:', err.message);
        await sock.sendMessage(senderJid, {
          text: '❌ Gagal mengirim ringkasan. Silakan coba lagi.'
        });
      }
    }

    // Command: /laporan — trigger manual report send
    else if (text === '/laporan') {
      console.log('📤 Manual report trigger received');
      await sock.sendMessage(senderJid, {
        text: '⏳ Sedang menyiapkan laporan harian...'
      });

      try {
        const report = generateDailyReport();
        await sock.sendMessage(senderJid, { text: report });
        console.log('✅ Manual report sent successfully');
      } catch (err) {
        console.error('❌ Failed to send manual report:', err.message);
        await sock.sendMessage(senderJid, {
          text: '❌ Gagal mengirim laporan. Silakan coba lagi.'
        });
      }
    }

    // Command: /kirimlaporan — dipicu dari dashboard seller, kirim laporan ke penerima
    else if (text === '/kirimlaporan') {
      console.log('📤 Dashboard trigger: /kirimlaporan from', senderJid);
      await sock.sendMessage(senderJid, {
        text: '⏳ Mengirim laporan harian ke penerima...'
      });

      try {
        const report = generateDailyReport();

        // Kirim laporan ke penerima yang dikonfigurasi (RECIPIENT_JID)
        await sock.sendMessage(RECIPIENT_JID, { text: report });
        console.log('✅ Report sent to recipient:', RECIPIENT_JID);

        // Konfirmasi ke pengirim (dashboard user)
        await sock.sendMessage(senderJid, {
          text: `✅ Laporan harian berhasil dikirim ke ${RECIPIENT_NUMBER}!`
        });
      } catch (err) {
        console.error('❌ Failed to send report via dashboard:', err.message);
        await sock.sendMessage(senderJid, {
          text: '❌ Gagal mengirim laporan. Pastikan bot terhubung dan coba lagi.'
        });
      }
    }

    // Command: /status — check bot status
    else if (text === '/status') {
      const log = getDeliveryLog();
      const successCount = log.filter(l => l.status === 'success').length;
      const failCount = log.filter(l => l.status.startsWith('fail')).length;
      const reliability = log.length > 0
        ? ((successCount / log.length) * 100).toFixed(1)
        : '100';

      const interval = getReminderInterval();
      const statusMsg = [
        '🤖 *Status BatikQR Bot*',
        '━━━━━━━━━━━━━━━━━━━━',
        `🏪 Toko: ${STORE.name}`,
        `📱 Penerima: ${RECIPIENT_NUMBER}`,
        `⏰ Laporan harian: setiap pukul 20:00 WIB`,
        `🔔 Reminder: setiap ${interval} menit`,
        ``,
        `📊 *Delivery Log*`,
        `✅ Berhasil: ${successCount}`,
        `❌ Gagal: ${failCount}`,
        `📈 Reliabilitas: ${reliability}%`,
        ``,
        `🟢 Bot aktif dan berjalan normal`
      ].join('\n');

      await sock.sendMessage(senderJid, { text: statusMsg });
    }

    // Command: /bantuan
    else if (text === '/bantuan') {
      const interval = getReminderInterval();
      const helpMsg = [
        '🤖 *BatikQR Bot — Bantuan*',
        '━━━━━━━━━━━━━━━━━━━━',
        '',
        '📋 *Perintah yang tersedia:*',
        '',
        '🧾 */ringkasan*',
        '   Ringkasan penjualan singkat (revenue, top 5 laku)',
        '',
        '📊 */laporan*',
        '   Kirim laporan harian lengkap ke chat ini',
        '',
        '📤 */kirimlaporan*',
        '   Kirim laporan ke penerima (dipicu dari dashboard)',
        '',
        '📈 */status*',
        '   Cek status bot dan riwayat pengiriman',
        '',
        '❓ */bantuan*',
        '   Tampilkan pesan ini',
        '',
        '━━━━━━━━━━━━━━━━━━━━',
        `🔔 Reminder otomatis: setiap ${interval} menit`,
        '⏰ Laporan harian: setiap pukul 20:00 WIB',
        '🤖 _BatikQR Bot v1.0_'
      ].join('\n');

      await sock.sendMessage(senderJid, { text: helpMsg });
    }
  });
}

// ============================================================
// REST API Server — Internal endpoint untuk dashboard
// ============================================================

let apiServer = null;

function startAPIServer(sock) {
  // Tutup server lama jika ada (misalnya saat reconnect)
  if (apiServer) {
    apiServer.close();
    apiServer = null;
  }

  apiServer = http.createServer(async (req, res) => {
    // CORS headers agar bisa diakses dari dashboard (file:// atau localhost)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // Handle preflight OPTIONS
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    // POST /api/kirim-laporan — Kirim laporan harian ke penerima
    if (req.method === 'POST' && req.url === '/api/kirim-laporan') {
      console.log('\n🌐 [API] POST /api/kirim-laporan — dipicu dari dashboard');

      try {
        // Cek koneksi bot
        if (!sock.user) {
          res.writeHead(503);
          res.end(JSON.stringify({
            success: false,
            error: 'Bot belum terhubung ke WhatsApp'
          }));
          return;
        }

        // Generate dan kirim laporan
        const report = generateDailyReport();
        const { msgId } = await sendAndVerify(sock, RECIPIENT_JID, report);

        console.log('✅ [API] Laporan berhasil dikirim ke', RECIPIENT_NUMBER);

        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          message: `Laporan berhasil dikirim ke ${RECIPIENT_NUMBER}`,
          msgId,
          timestamp: new Date().toISOString()
        }));
      } catch (err) {
        console.error('❌ [API] Gagal kirim laporan:', err.message);

        res.writeHead(500);
        res.end(JSON.stringify({
          success: false,
          error: err.message
        }));
      }
      return;
    }

    // GET /api/status — Cek status bot
    if (req.method === 'GET' && req.url === '/api/status') {
      const log = getDeliveryLog();
      const connected = !!sock.user;

      res.writeHead(200);
      res.end(JSON.stringify({
        connected,
        store: STORE.name,
        recipient: RECIPIENT_NUMBER,
        reminder_interval: getReminderInterval(),
        delivery_log: {
          total: log.length,
          success: log.filter(l => l.status === 'success').length,
          failed: log.filter(l => l.status.startsWith('fail')).length
        },
        timestamp: new Date().toISOString()
      }));
      return;
    }

    // 404 — endpoint tidak ditemukan
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint tidak ditemukan' }));
  });

  apiServer.listen(API_PORT, () => {
    console.log(`\n🌐 REST API server aktif di http://localhost:${API_PORT}`);
    console.log(`   POST /api/kirim-laporan  → Kirim laporan ke penerima`);
    console.log(`   GET  /api/status         → Cek status bot\n`);
  });
}

// ============================================================
// Start
// ============================================================

startBot().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
