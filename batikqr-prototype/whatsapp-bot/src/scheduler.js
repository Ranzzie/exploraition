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
    await sock.sendMessage(recipientJid, { text: message });

    logDelivery(recipientJid, 'success');
    console.log('✅ Daily report sent successfully!\n');

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
      await sock.sendMessage(recipientJid, { text: header + message });
      logDelivery(recipientJid, 'success');
      console.log('✅ Reminder sent successfully!');
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
  startScheduler,
  startReminder,
  getDeliveryLog,
  getReminderInterval,
  logDelivery
};
