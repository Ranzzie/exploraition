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
 * 5. Bot akan terhubung dan scheduler laporan harian aktif
 * 6. Ketik "report" di chat untuk trigger manual
 * 
 * Referensi PRD:
 * - Section 5.1C: WhatsApp Bot Reporting
 * - Section 7: System Rules (Rule 6, 7)
 * - Section 9.3: Bot & Notification (FR-11, FR-12, FR-13)
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const { generateDailyReport, generateStatusNotification } = require('./formatter');
const { sendDailyReport, startScheduler, getDeliveryLog } = require('./scheduler');
const { STORE } = require('./data');

// ============================================================
// Configuration
// ============================================================

// Nomor WhatsApp penerima laporan (format: 628xxxxx)
// Ganti dengan nomor WhatsApp owner toko (Bu Sari)
const RECIPIENT_NUMBER = process.env.RECIPIENT_NUMBER || '628123456789';
const RECIPIENT_JID = `${RECIPIENT_NUMBER}@s.whatsapp.net`;

// Auth session storage path
const AUTH_DIR = './auth_session';

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

  // Load or create auth state
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

  // Create socket connection
  const sock = makeWASocket({
    auth: state,
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

      // Start the daily report scheduler
      const scheduler = startScheduler(sock, RECIPIENT_JID);

      console.log('💡 Commands available (kirim pesan ke bot):');
      console.log('   • "report"  → Kirim laporan harian sekarang');
      console.log('   • "status"  → Cek status bot dan delivery log');
      console.log('   • "help"    → Tampilkan bantuan\n');
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

    // Command: report — trigger manual report send
    if (text === 'report' || text === 'laporan') {
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

    // Command: status — check bot status
    else if (text === 'status') {
      const log = getDeliveryLog();
      const successCount = log.filter(l => l.status === 'success').length;
      const failCount = log.filter(l => l.status.startsWith('fail')).length;
      const reliability = log.length > 0
        ? ((successCount / log.length) * 100).toFixed(1)
        : '100';

      const statusMsg = [
        '🤖 *Status BatikQR Bot*',
        '━━━━━━━━━━━━━━━━━━━━',
        `🏪 Toko: ${STORE.name}`,
        `📱 Penerima: ${RECIPIENT_NUMBER}`,
        `⏰ Jadwal: Setiap hari pukul 20:00 WIB`,
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

    // Command: help
    else if (text === 'help' || text === 'bantuan') {
      const helpMsg = [
        '🤖 *BatikQR Bot — Bantuan*',
        '━━━━━━━━━━━━━━━━━━━━',
        '',
        '📋 *Perintah yang tersedia:*',
        '',
        '📊 *report* / *laporan*',
        '   Kirim laporan harian sekarang juga',
        '',
        '📈 *status*',
        '   Cek status bot dan riwayat pengiriman',
        '',
        '❓ *help* / *bantuan*',
        '   Tampilkan pesan ini',
        '',
        '━━━━━━━━━━━━━━━━━━━━',
        '⏰ Laporan otomatis dikirim setiap hari pukul 20:00 WIB',
        '🤖 _BatikQR Bot v1.0_'
      ].join('\n');

      await sock.sendMessage(senderJid, { text: helpMsg });
    }
  });
}

// ============================================================
// Start
// ============================================================

startBot().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
