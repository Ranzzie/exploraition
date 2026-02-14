/**
 * BatikQR WhatsApp Bot — Scheduler
 * Cron-based scheduler for daily automated reports
 * 
 * Referensi PRD Section 5.1C & Section 7:
 * - Scheduler laporan harian otomatis
 * - IF scheduler harian berjalan THEN bot WA mengirim ringkasan ranking otomatis
 * - IF pengiriman WA gagal THEN sistem retry sesuai policy dan log error
 */

const cron = require('node-cron');
const { generateDailyReport, generateSalesSummary, generateStatusNotification } = require('./formatter');

// ============================================================
// Configuration — Reminder Interval
// Ubah nilai ini untuk mengatur jeda reminder (dalam menit)
// Default: 2 menit (untuk testing)
// Produksi: bisa diubah ke 60, 120, 480, dll.
// ============================================================
const REMINDER_INTERVAL_MINUTES = parseInt(process.env.REMINDER_INTERVAL || '2', 10);

// Timeout menunggu ACK dari server WhatsApp (ms)
const MESSAGE_ACK_TIMEOUT_MS = 15000;

// Delivery log (in-memory for prototype)
const deliveryLog = [];

/**
 * Log a delivery attempt
 */
function logDelivery(recipient, status, errorMessage = null) {
  const entry = {
    id: deliveryLog.length + 1,
    timestamp: new Date().toISOString(),
    channel: 'whatsapp',
    recipient,
    status,
    error_message: errorMessage
  };
  deliveryLog.push(entry);
  
  const statusIcon = status === 'success' ? '✅' : '❌';
  console.log(`${statusIcon} [DeliveryLog] ${status.toUpperCase()} → ${recipient} at ${entry.timestamp}`);
  if (errorMessage) {
    console.log(`   Error: ${errorMessage}`);
  }
  
  return entry;
}

/**
 * Menunggu konfirmasi (ACK) dari server WhatsApp bahwa pesan benar-benar terkirim.
 *
 * Baileys menggenerate key.id secara LOKAL sebelum mengirim ke server,
 * sehingga `result.key.id` selalu ada meskipun pesan gagal terkirim.
 * Fungsi ini mendengarkan event `messages.update` dan menunggu status
 * berubah menjadi >= SERVER_ACK (2), yang berarti server WA sudah
 * menerima dan meneruskan pesan.
 *
 * Status Baileys:
 *   0 = ERROR, 1 = PENDING, 2 = SERVER_ACK,
 *   3 = DELIVERY_ACK, 4 = READ, 5 = PLAYED
 *
 * @param {object} sock - Baileys socket connection
 * @param {string} msgId - Message key ID yang dikembalikan oleh sendMessage
 * @param {number} timeoutMs - Batas waktu menunggu ACK (default 15s)
 * @returns {Promise<number>} Status akhir pesan (>= 2 jika berhasil)
 */
function waitForMessageAck(sock, msgId, timeoutMs = MESSAGE_ACK_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      sock.ev.off('messages.update', handler);
      reject(new Error(
        `Timeout ${timeoutMs / 1000}s: server WA tidak mengkonfirmasi pesan (msgId: ${msgId}). ` +
        `Pesan kemungkinan tidak terkirim.`
      ));
    }, timeoutMs);

    const handler = (updates) => {
      for (const update of updates) {
        if (update.key?.id === msgId) {
          const status = update.update?.status;
          if (status >= 2) {
            // SERVER_ACK atau lebih — pesan benar-benar terkirim
            clearTimeout(timer);
            sock.ev.off('messages.update', handler);
            resolve(status);
          } else if (status === 0) {
            // ERROR — server menolak pesan
            clearTimeout(timer);
            sock.ev.off('messages.update', handler);
            reject(new Error(
              `Server WA menolak pesan (status: ERROR, msgId: ${msgId})`
            ));
          }
        }
      }
    };

    sock.ev.on('messages.update', handler);
  });
}

/**
 * Mengirim pesan WhatsApp dan memastikan pesan benar-benar terkirim
 * dengan menunggu ACK dari server.
 *
 * @param {object} sock - Baileys socket connection
 * @param {string} recipientJid - WhatsApp JID penerima
 * @param {string} text - Isi pesan
 * @returns {Promise<{ msgId: string, status: number }>}
 */
async function sendAndVerify(sock, recipientJid, text) {
  // 1. Cek koneksi
  if (!sock.user) {
    throw new Error('Bot belum terhubung ke WhatsApp');
  }

  // 2. Kirim pesan (Baileys generate key.id lokal, belum tentu sampai server)
  const result = await sock.sendMessage(recipientJid, { text });
  const msgId = result?.key?.id;

  if (!msgId) {
    throw new Error('sendMessage gagal: tidak ada key.id di response');
  }

  console.log(`   📨 Pesan dikirim, menunggu ACK dari server... (msgId: ${msgId})`);

  // 3. Tunggu konfirmasi dari server bahwa pesan benar-benar terkirim
  const status = await waitForMessageAck(sock, msgId);

  const statusLabel = { 2: 'SERVER_ACK', 3: 'DELIVERY_ACK', 4: 'READ', 5: 'PLAYED' };
  console.log(`   ✅ ACK diterima: ${statusLabel[status] || status} (msgId: ${msgId})`);

  return { msgId, status };
}

/**
 * Send daily report via WhatsApp
 * @param {object} sock - Baileys socket connection
 * @param {string} recipientJid - WhatsApp JID (e.g., '628123456789@s.whatsapp.net')
 * @param {number} retryCount - Current retry attempt
 */
async function sendDailyReport(sock, recipientJid, retryCount = 0) {
  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 5 * 60 * 1000; // 5 minutes

  try {
    console.log('\n📤 Generating daily report...');
    const message = generateDailyReport();
    
    console.log('📨 Sending to:', recipientJid);
    const { msgId } = await sendAndVerify(sock, recipientJid, message);

    logDelivery(recipientJid, 'success');
    console.log(`✅ Daily report sent & verified! (msgId: ${msgId})\n`);

  } catch (error) {
    console.error('❌ Failed to send report:', error.message);
    logDelivery(recipientJid, 'failed', error.message);

    // Retry logic per PRD Section 7 Rule 7
    if (retryCount < MAX_RETRIES) {
      const nextRetry = retryCount + 1;
      console.log(`🔄 Retry ${nextRetry}/${MAX_RETRIES} in ${RETRY_DELAY_MS / 60000} minutes...`);
      
      setTimeout(() => {
        sendDailyReport(sock, recipientJid, nextRetry);
      }, RETRY_DELAY_MS);
    } else {
      console.error(`❌ All ${MAX_RETRIES} retries exhausted. Report not sent.`);
      logDelivery(recipientJid, 'failed_permanent', `Exceeded ${MAX_RETRIES} retries`);
    }
  }
}

/**
 * Start the daily report scheduler
 * Runs every day at 20:00 WIB (UTC+7 = 13:00 UTC)
 * 
 * @param {object} sock - Baileys socket connection
 * @param {string} recipientJid - WhatsApp JID
 */
function startScheduler(sock, recipientJid) {
  // Schedule: 20:00 WIB daily (adjust if server uses different timezone)
  // Cron: minute hour day month weekday
  const cronExpression = '0 20 * * *';

  console.log('⏰ Daily report scheduler started');
  console.log(`   Schedule: Every day at 20:00 WIB`);
  console.log(`   Recipient: ${recipientJid}`);
  console.log(`   Cron: ${cronExpression}\n`);

  const task = cron.schedule(cronExpression, async () => {
    console.log('\n🕐 Scheduler triggered — sending daily report...');
    await sendDailyReport(sock, recipientJid);
  }, {
    timezone: 'Asia/Jakarta'
  });

  return task;
}

/**
 * Start a periodic reminder that sends the daily report every N minutes.
 * Interval is configurable via REMINDER_INTERVAL_MINUTES or env REMINDER_INTERVAL.
 *
 * @param {object} sock - Baileys socket connection
 * @param {string} recipientJid - WhatsApp JID
 * @returns {{ interval: NodeJS.Timeout, stop: Function }}
 */
function startReminder(sock, recipientJid) {
  const ms = REMINDER_INTERVAL_MINUTES * 60 * 1000;

  console.log(`🔔 Reminder started — every ${REMINDER_INTERVAL_MINUTES} minute(s)`);
  console.log(`   Recipient: ${recipientJid}`);
  console.log(`   Interval : ${ms / 1000}s (${REMINDER_INTERVAL_MINUTES}m)`);
  console.log(`   💡 Ubah jeda: set env REMINDER_INTERVAL=<menit> atau edit REMINDER_INTERVAL_MINUTES\n`);

  const interval = setInterval(async () => {
    const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    console.log(`\n🔔 [${now}] Reminder triggered — sending report...`);

    try {
      const header = `🔔 *REMINDER OTOMATIS (setiap ${REMINDER_INTERVAL_MINUTES} menit)*\n━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      const message = generateDailyReport();
      const { msgId } = await sendAndVerify(sock, recipientJid, header + message);

      logDelivery(recipientJid, 'success');
      console.log(`✅ Reminder sent & verified! (msgId: ${msgId})`);
    } catch (error) {
      console.error('❌ Reminder failed:', error.message);
      logDelivery(recipientJid, 'failed', `Reminder: ${error.message}`);
    }
  }, ms);

  return {
    interval,
    stop: () => {
      clearInterval(interval);
      console.log('🔕 Reminder stopped.');
    }
  };
}

/**
 * Get delivery log entries
 */
function getDeliveryLog() {
  return deliveryLog;
}

/**
 * Get current reminder interval config
 */
function getReminderInterval() {
  return REMINDER_INTERVAL_MINUTES;
}

module.exports = {
  sendDailyReport,
  sendAndVerify,
  startScheduler,
  startReminder,
  getDeliveryLog,
  getReminderInterval,
  logDelivery
};
