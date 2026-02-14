/**
 * BatikQR WhatsApp Bot — Message Formatter
 * Formats daily report data into WhatsApp-friendly messages
 * 
 * Referensi PRD Section 5.1C (WhatsApp Bot Reporting):
 * - Top 5 most viewed
 * - Top 5 most bought
 * - Highlight produk naik/turun
 * - Ringkasan conversion rate
 */

const { STORE, DAILY_ANALYTICS, getProductById, formatNumber } = require('./data');

/**
 * Generate the daily summary report message
 * @returns {string} Formatted WhatsApp message
 */
function generateDailyReport() {
  const data = DAILY_ANALYTICS;
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const timeStr = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Top 5 most viewed
  const topViewed = [...data.product_stats]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  // Top 5 most bought
  const topBought = [...data.product_stats]
    .sort((a, b) => b.purchases - a.purchases)
    .slice(0, 5);

  // Trend analysis
  const trendUp = data.product_stats
    .filter(s => s.trend === 'up')
    .map(s => getProductById(s.product_id));

  const trendDown = data.product_stats
    .filter(s => s.trend === 'down')
    .map(s => getProductById(s.product_id));

  // Build message
  const lines = [
    `📊 *RINGKASAN HARIAN BATIKQR*`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `📅 ${dateStr}`,
    `🏪 ${STORE.name}`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `📈 *TOP 5 PRODUK PALING DILIHAT*`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    ...topViewed.map((stat, i) => {
      const product = getProductById(stat.product_id);
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
      return `${medal} ${product.product_name}\n    👁️ ${formatNumber(stat.views)} views`;
    }),
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `🛒 *TOP 5 PRODUK PALING DIBELI*`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    ...topBought.map((stat, i) => {
      const product = getProductById(stat.product_id);
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
      const cr = stat.views > 0 ? ((stat.purchases / stat.views) * 100).toFixed(1) : '0';
      return `${medal} ${product.product_name}\n    🛒 ${formatNumber(stat.purchases)} pcs (CR: ${cr}%)`;
    }),
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `📊 *RINGKASAN PERFORMA*`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `📡 Total Scan     : ${formatNumber(data.total_scans)}`,
    `👁️ Total Views    : ${formatNumber(data.total_views)}`,
    `🛒 Total Pembelian: ${formatNumber(data.total_purchases)}`,
    `🔄 Conversion Rate: *${data.conversion_rate}%*`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `📈 *HIGHLIGHT PRODUK*`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
  ];

  // Trend up
  if (trendUp.length > 0) {
    lines.push(`🔺 *Produk Naik:*`);
    trendUp.forEach(p => {
      lines.push(`   ✅ ${p.product_name}`);
    });
  }

  // Trend down
  if (trendDown.length > 0) {
    lines.push(`🔻 *Produk Turun:*`);
    trendDown.forEach(p => {
      lines.push(`   ⚠️ ${p.product_name}`);
    });
  }

  lines.push(
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `🤖 _Laporan otomatis oleh BatikQR Bot_`,
    `⏰ Dikirim: ${timeStr} WIB`
  );

  return lines.join('\n');
}

/**
 * Generate a short notification when report is sent
 * @param {string} status - 'success' | 'failed'
 * @returns {string}
 */
function generateStatusNotification(status) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });

  if (status === 'success') {
    return `✅ Laporan harian BatikQR berhasil dikirim (${timeStr} WIB)`;
  }
  return `❌ Gagal mengirim laporan harian BatikQR (${timeStr} WIB). Akan diulang dalam 5 menit.`;
}

module.exports = {
  generateDailyReport,
  generateStatusNotification
};
