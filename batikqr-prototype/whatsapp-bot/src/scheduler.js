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
const { generateDailyReport, generateStatusNotification } = require('./formatter');

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
 * Get delivery log entries
 */
function getDeliveryLog() {
  return deliveryLog;
}

module.exports = {
  sendDailyReport,
  startScheduler,
  getDeliveryLog,
  logDelivery
};
