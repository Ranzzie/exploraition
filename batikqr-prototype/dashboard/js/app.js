/**
 * BatikQR Seller Dashboard — Main Application Logic
 * Handles navigation, rendering, charts, and CRUD operations
 */

// ============================================================
// State
// ============================================================

let currentPage = 'dashboard';
let currentPeriod = 'today';
let scanChart = null;
let showcaseChart = null;

// ============================================================
// Navigation
// ============================================================

function navigateTo(page) {
  currentPage = page;

  // Hide all pages
  document.querySelectorAll('[id^="page-"]').forEach(el => el.classList.add('hidden'));
  document.getElementById(`page-${page}`).classList.remove('hidden');

  // Update active nav
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  document.querySelector(`.nav-item[data-page="${page}"]`).classList.add('active');

  // Update title
  const titles = {
    dashboard: 'Dashboard Insight',
    etalase: 'Kelola Etalase',
    products: 'Kelola Produk',
    'wa-report': 'Laporan WhatsApp'
  };
  document.getElementById('page-title').textContent = titles[page] || '';

  // Show/hide period filter
  const periodFilter = document.getElementById('period-filter');
  periodFilter.style.display = page === 'dashboard' ? 'inline-flex' : 'none';

  // Render page content
  switch (page) {
    case 'dashboard': renderDashboard(); break;
    case 'etalase': renderEtalase(); break;
    case 'products': renderProductPage(); break;
    case 'wa-report': renderWAReport(); break;
  }

  // Close sidebar on mobile
  document.getElementById('sidebar').classList.remove('open');
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

function setPeriod(period) {
  currentPeriod = period;
  document.querySelectorAll('.period-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.period-btn[data-period="${period}"]`).classList.add('active');
  renderDashboard();
}

// ============================================================
// Modal
// ============================================================

function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// ============================================================
// Toast
// ============================================================

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  toast.innerHTML = `${icons[type] || ''} ${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================================
// Dashboard Rendering
// ============================================================

function renderDashboard() {
  const data = ANALYTICS[currentPeriod];

  // Stats row
  document.getElementById('stats-row').innerHTML = `
    <div class="stat-card">
      <div class="stat-icon icon-scans">📡</div>
      <div class="stat-label">Total Scan</div>
      <div class="stat-value">${formatNumber(data.total_scans)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon icon-views">👁️</div>
      <div class="stat-label">Total Product Views</div>
      <div class="stat-value">${formatNumber(data.total_views)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon icon-purchases">🛒</div>
      <div class="stat-label">Total Pembelian</div>
      <div class="stat-value">${formatNumber(data.total_purchases)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon icon-conversion">🔄</div>
      <div class="stat-label">Conversion Rate</div>
      <div class="stat-value">${data.conversion_rate}%</div>
    </div>
  `;

  // Top viewed
  const viewedBody = document.querySelector('#table-most-viewed tbody');
  viewedBody.innerHTML = data.product_stats
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map((stat, i) => {
      const product = getProductById(stat.product_id);
      return `
        <tr>
          <td><span class="rank-num ${i < 3 ? 'top' : ''}">${i + 1}</span></td>
          <td><strong>${product.product_name}</strong></td>
          <td><span class="tag tag-brand">${product.motif_name}</span></td>
          <td><strong>${formatNumber(stat.views)}</strong></td>
          <td><span class="tag ${getTrendClass(stat.trend)}">${stat.trend === 'up' ? '↑ Naik' : stat.trend === 'down' ? '↓ Turun' : '→ Stabil'}</span></td>
        </tr>`;
    })
    .join('');

  // Top bought
  const boughtBody = document.querySelector('#table-most-bought tbody');
  boughtBody.innerHTML = data.product_stats
    .sort((a, b) => b.purchases - a.purchases)
    .slice(0, 5)
    .map((stat, i) => {
      const product = getProductById(stat.product_id);
      const revenue = stat.purchases * product.price;
      return `
        <tr>
          <td><span class="rank-num ${i < 3 ? 'top' : ''}">${i + 1}</span></td>
          <td><strong>${product.product_name}</strong></td>
          <td><strong>${formatNumber(stat.purchases)}</strong></td>
          <td>${formatRupiah(revenue)}</td>
          <td><span class="tag ${getTrendClass(stat.trend)}">${stat.trend === 'up' ? '↑ Naik' : stat.trend === 'down' ? '↓ Turun' : '→ Stabil'}</span></td>
        </tr>`;
    })
    .join('');

  // Conversion table
  const convBody = document.querySelector('#table-conversion tbody');
  const maxCR = Math.max(...data.product_stats.map(s => s.views > 0 ? (s.purchases / s.views) * 100 : 0));
  convBody.innerHTML = data.product_stats
    .sort((a, b) => {
      const crA = a.views > 0 ? (a.purchases / a.views) * 100 : 0;
      const crB = b.views > 0 ? (b.purchases / b.views) * 100 : 0;
      return crB - crA;
    })
    .map(stat => {
      const product = getProductById(stat.product_id);
      const cr = stat.views > 0 ? ((stat.purchases / stat.views) * 100).toFixed(1) : 0;
      const barWidth = maxCR > 0 ? (cr / maxCR) * 100 : 0;
      return `
        <tr>
          <td>${product.product_name}</td>
          <td>${formatNumber(stat.views)}</td>
          <td>${formatNumber(stat.purchases)}</td>
          <td><strong>${cr}%</strong></td>
          <td>
            <div class="conversion-bar">
              <div class="conversion-fill" style="width:${barWidth}%"></div>
            </div>
          </td>
        </tr>`;
    })
    .join('');

  // Showcase table
  const showcaseBody = document.querySelector('#table-showcases tbody');
  showcaseBody.innerHTML = data.showcase_stats.map(stat => {
    const showcase = getShowcaseById(stat.showcase_id);
    const cr = stat.views > 0 ? ((stat.purchases / stat.views) * 100).toFixed(1) : '0';
    return `
      <tr>
        <td><strong>${showcase.name}</strong></td>
        <td>${formatNumber(stat.scans)}</td>
        <td>${formatNumber(stat.views)}</td>
        <td>${formatNumber(stat.purchases)}</td>
        <td><strong>${cr}%</strong></td>
      </tr>`;
  }).join('');

  // Charts
  renderScanChart(data);
  renderShowcaseChart(data);
}

function renderScanChart(data) {
  const ctx = document.getElementById('scan-chart').getContext('2d');
  if (scanChart) scanChart.destroy();

  let labels, chartData, subtitle;

  if (currentPeriod === 'today') {
    labels = data.hourly_scans.map((_, i) => `${String(i).padStart(2, '0')}:00`);
    chartData = data.hourly_scans;
    subtitle = 'Jumlah scan per jam hari ini';
  } else if (currentPeriod === '7days') {
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    labels = data.daily_scans.map((_, i) => days[i]);
    chartData = data.daily_scans;
    subtitle = 'Jumlah scan per hari (7 hari terakhir)';
  } else {
    labels = data.weekly_scans.map((_, i) => `Minggu ${i + 1}`);
    chartData = data.weekly_scans;
    subtitle = 'Jumlah scan per minggu (30 hari terakhir)';
  }

  document.getElementById('chart-subtitle').textContent = subtitle;

  scanChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Scan',
        data: chartData,
        borderColor: '#7a4b2a',
        backgroundColor: 'rgba(122, 75, 42, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: currentPeriod === 'today' ? 2 : 5,
        pointBackgroundColor: '#7a4b2a',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 }, maxRotation: 0 }
        },
        y: {
          beginAtZero: true,
          grid: { color: '#f0e8e1' },
          ticks: { font: { size: 11 } }
        }
      }
    }
  });
}

function renderShowcaseChart(data) {
  const ctx = document.getElementById('showcase-chart').getContext('2d');
  if (showcaseChart) showcaseChart.destroy();

  const labels = data.showcase_stats.map(s => {
    const sc = getShowcaseById(s.showcase_id);
    return sc.name.replace('Etalase ', '');
  });

  showcaseChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Scans',
          data: data.showcase_stats.map(s => s.scans),
          backgroundColor: 'rgba(27, 79, 114, 0.7)',
          borderRadius: 6
        },
        {
          label: 'Views',
          data: data.showcase_stats.map(s => s.views),
          backgroundColor: 'rgba(183, 123, 77, 0.7)',
          borderRadius: 6
        },
        {
          label: 'Purchases',
          data: data.showcase_stats.map(s => s.purchases),
          backgroundColor: 'rgba(19, 121, 91, 0.7)',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 12 } }
        }
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          beginAtZero: true,
          grid: { color: '#f0e8e1' }
        }
      }
    }
  });
}

// ============================================================
// Etalase CRUD
// ============================================================

function renderEtalase() {
  const container = document.getElementById('showcase-list');
  container.innerHTML = SHOWCASES.map(sc => {
    const productCount = getProductsByShowcase(sc.id).length;
    return `
      <div class="showcase-card">
        <div class="showcase-header">
          <h3 class="showcase-name">${sc.name}</h3>
          <span class="tag ${sc.status === 'active' ? 'tag-success' : 'tag-warning'}">
            ${sc.status === 'active' ? '● Aktif' : '● Nonaktif'}
          </span>
        </div>
        <div class="showcase-meta">
          <span class="tag tag-brand">🔑 ${sc.qr_token}</span>
          <span class="tag tag-info">👘 ${productCount} produk</span>
        </div>
        <p class="showcase-desc">${sc.description}</p>
        <div class="showcase-actions">
          <button class="btn btn-primary btn-sm" onclick="showQR('${sc.id}')">📱 Lihat QR</button>
          <button class="btn btn-secondary btn-sm" onclick="editEtalase('${sc.id}')">✏️ Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteEtalase('${sc.id}')">🗑️ Hapus</button>
        </div>
      </div>`;
  }).join('');
}

function openEtalaseModal(id = null) {
  document.getElementById('modal-etalase-title').textContent = id ? 'Edit Etalase' : 'Tambah Etalase';
  document.getElementById('etalase-edit-id').value = id || '';

  if (id) {
    const sc = getShowcaseById(id);
    document.getElementById('etalase-name').value = sc.name;
    document.getElementById('etalase-desc').value = sc.description;
    document.getElementById('etalase-status').value = sc.status;
  } else {
    document.getElementById('etalase-name').value = '';
    document.getElementById('etalase-desc').value = '';
    document.getElementById('etalase-status').value = 'active';
  }

  openModal('modal-etalase');
}

function editEtalase(id) {
  openEtalaseModal(id);
}

function saveEtalase(e) {
  e.preventDefault();
  const editId = document.getElementById('etalase-edit-id').value;
  const name = document.getElementById('etalase-name').value;
  const desc = document.getElementById('etalase-desc').value;
  const status = document.getElementById('etalase-status').value;

  if (editId) {
    const sc = getShowcaseById(editId);
    sc.name = name;
    sc.description = desc;
    sc.status = status;
    showToast('Etalase berhasil diperbarui');
  } else {
    const token = 'ETL-' + name.substring(0, 3).toUpperCase() + '-' + String(SHOWCASES.length + 1).padStart(2, '0');
    SHOWCASES.push({
      id: 'sc-' + String(SHOWCASES.length + 1).padStart(3, '0'),
      seller_id: 'user-001',
      name,
      qr_token: token,
      status,
      description: desc,
      created_at: new Date().toISOString().split('T')[0]
    });
    showToast('Etalase baru berhasil ditambahkan');
  }

  closeModal('modal-etalase');
  renderEtalase();
}

function deleteEtalase(id) {
  if (confirm('Yakin ingin menghapus etalase ini?')) {
    const idx = SHOWCASES.findIndex(s => s.id === id);
    if (idx > -1) {
      SHOWCASES.splice(idx, 1);
      showToast('Etalase berhasil dihapus', 'info');
      renderEtalase();
    }
  }
}

function showQR(id) {
  const sc = getShowcaseById(id);
  document.getElementById('modal-qr-title').textContent = `QR Code — ${sc.name}`;
  document.getElementById('qr-display').innerHTML = `
    <img src="${generateQRUrl(sc.qr_token)}" alt="QR Code ${sc.name}" width="200" height="200" />
    <div class="qr-token">${sc.qr_token}</div>
    <p class="mt-12 text-muted" style="font-size:0.84rem;">
      URL: https://batikqr.app/s/${sc.qr_token}
    </p>
  `;
  openModal('modal-qr');
}

// ============================================================
// Product CRUD
// ============================================================

function renderProductPage() {
  // Populate showcase filter
  const filterSelect = document.getElementById('product-filter-showcase');
  filterSelect.innerHTML = '<option value="all">Semua Etalase</option>' +
    SHOWCASES.map(sc => `<option value="${sc.id}">${sc.name}</option>`).join('');

  // Populate product modal showcase dropdown
  const modalSelect = document.getElementById('product-showcase');
  modalSelect.innerHTML = '<option value="">Pilih etalase...</option>' +
    SHOWCASES.map(sc => `<option value="${sc.id}">${sc.name}</option>`).join('');

  renderProducts();
}

function renderProducts() {
  const filterVal = document.getElementById('product-filter-showcase').value;
  const filtered = filterVal === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.showcase_id === filterVal);

  const container = document.getElementById('product-list');
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-icon">👘</div>
        <h3>Belum ada produk</h3>
        <p>Tambahkan produk pertama ke etalase</p>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(p => {
    const showcase = getShowcaseById(p.showcase_id);
    const gradient = p.color_gradient
      ? `linear-gradient(135deg, ${p.color_gradient[0]}, ${p.color_gradient[1]})`
      : 'linear-gradient(135deg, #7a4b2a, #b77b4d)';
    return `
      <div class="product-card">
        <div class="product-thumb" style="background:${gradient}">
          ${p.motif_name}
        </div>
        <div class="product-info">
          <h4>${p.product_name}</h4>
          <div class="product-motif">Motif: ${p.motif_name}</div>
          <div class="mt-4" style="font-size:0.8rem; color:var(--muted);">
            ${showcase ? showcase.name : '—'} • Stok: ${p.stock}
          </div>
          <p class="product-story">${p.story_text}</p>
          <div class="product-price">${formatRupiah(p.price)}</div>
        </div>
        <div class="product-footer">
          <span class="tag ${p.status === 'active' ? 'tag-success' : 'tag-warning'}">
            ${p.status === 'active' ? '● Aktif' : '● Nonaktif'}
          </span>
          <div class="flex gap-8">
            <button class="btn btn-ghost btn-sm" onclick="editProduct('${p.id}')">✏️</button>
            <button class="btn btn-danger btn-sm" onclick="deleteProduct('${p.id}')">🗑️</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

function openProductModal(id = null) {
  document.getElementById('modal-product-title').textContent = id ? 'Edit Produk' : 'Tambah Produk';
  document.getElementById('product-edit-id').value = id || '';

  // Ensure showcase dropdown is populated
  const modalSelect = document.getElementById('product-showcase');
  modalSelect.innerHTML = '<option value="">Pilih etalase...</option>' +
    SHOWCASES.map(sc => `<option value="${sc.id}">${sc.name}</option>`).join('');

  if (id) {
    const p = getProductById(id);
    document.getElementById('product-showcase').value = p.showcase_id;
    document.getElementById('product-name').value = p.product_name;
    document.getElementById('product-motif').value = p.motif_name;
    document.getElementById('product-price').value = p.price;
    document.getElementById('product-stock').value = p.stock;
    document.getElementById('product-status').value = p.status;
    document.getElementById('product-story').value = p.story_text;
  } else {
    document.getElementById('product-showcase').value = '';
    document.getElementById('product-name').value = '';
    document.getElementById('product-motif').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-stock').value = '';
    document.getElementById('product-status').value = 'active';
    document.getElementById('product-story').value = '';
  }

  openModal('modal-product');
}

function editProduct(id) {
  openProductModal(id);
}

function saveProduct(e) {
  e.preventDefault();
  const editId = document.getElementById('product-edit-id').value;
  const showcaseId = document.getElementById('product-showcase').value;
  const name = document.getElementById('product-name').value;
  const motif = document.getElementById('product-motif').value;
  const price = parseInt(document.getElementById('product-price').value);
  const stock = parseInt(document.getElementById('product-stock').value);
  const status = document.getElementById('product-status').value;
  const story = document.getElementById('product-story').value;

  if (editId) {
    const p = getProductById(editId);
    p.showcase_id = showcaseId;
    p.product_name = name;
    p.motif_name = motif;
    p.price = price;
    p.stock = stock;
    p.status = status;
    p.story_text = story;
    showToast('Produk berhasil diperbarui');
  } else {
    PRODUCTS.push({
      id: 'prod-' + String(PRODUCTS.length + 1).padStart(3, '0'),
      showcase_id: showcaseId,
      motif_name: motif,
      product_name: name,
      price,
      image_url: null,
      story_text: story,
      status,
      stock,
      color_gradient: ['#7a4b2a', '#b77b4d']
    });
    showToast('Produk baru berhasil ditambahkan');
  }

  closeModal('modal-product');
  renderProducts();
}

function deleteProduct(id) {
  if (confirm('Yakin ingin menghapus produk ini?')) {
    const idx = PRODUCTS.findIndex(p => p.id === id);
    if (idx > -1) {
      PRODUCTS.splice(idx, 1);
      showToast('Produk berhasil dihapus', 'info');
      renderProducts();
    }
  }
}

// ============================================================
// WhatsApp Report
// ============================================================

function renderWAReport() {
  const data = ANALYTICS.today;
  const topViewed = [...data.product_stats].sort((a, b) => b.views - a.views).slice(0, 5);
  const topBought = [...data.product_stats].sort((a, b) => b.purchases - a.purchases).slice(0, 5);

  const trendUp = data.product_stats.filter(s => s.trend === 'up').map(s => getProductById(s.product_id).product_name);
  const trendDown = data.product_stats.filter(s => s.trend === 'down').map(s => getProductById(s.product_id).product_name);

  const today = new Date();
  const dateStr = today.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const message = `📊 *Ringkasan Harian BatikQR*
📅 Tanggal: ${dateStr}
🏪 Toko: ${STORE.name}

━━━━━━━━━━━━━━━━━━
📈 *TOP 5 PALING DILIHAT*
━━━━━━━━━━━━━━━━━━
${topViewed.map((s, i) => {
    const p = getProductById(s.product_id);
    return `${i + 1}. ${p.product_name} — ${formatNumber(s.views)} views`;
  }).join('\n')}

━━━━━━━━━━━━━━━━━━
🛒 *TOP 5 PALING DIBELI*
━━━━━━━━━━━━━━━━━━
${topBought.map((s, i) => {
    const p = getProductById(s.product_id);
    return `${i + 1}. ${p.product_name} — ${formatNumber(s.purchases)} pcs`;
  }).join('\n')}

━━━━━━━━━━━━━━━━━━
📊 *INSIGHT HARI INI*
━━━━━━━━━━━━━━━━━━
📡 Total Scan: ${formatNumber(data.total_scans)}
👁️ Total Views: ${formatNumber(data.total_views)}
🛒 Total Pembelian: ${formatNumber(data.total_purchases)}
🔄 Conversion Rate: ${data.conversion_rate}%

🔺 *Produk Naik:*
${trendUp.length > 0 ? trendUp.map(n => `   • ${n}`).join('\n') : '   Tidak ada'}

🔻 *Produk Turun:*
${trendDown.length > 0 ? trendDown.map(n => `   • ${n}`).join('\n') : '   Tidak ada'}

━━━━━━━━━━━━━━━━━━
🤖 Dikirim otomatis oleh BatikQR Bot
⏰ ${today.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

  document.getElementById('wa-preview').textContent = message;
}

function simulateSendWA() {
  showToast('📤 Mengirim laporan ke WhatsApp...', 'info');
  setTimeout(() => {
    showToast('✅ Laporan berhasil dikirim ke Bu Sari!', 'success');

    // Add to log table
    const tbody = document.querySelector('#table-wa-log tbody');
    const now = new Date();
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${now.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
      <td>${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</td>
      <td>Bu Sari</td>
      <td><span class="tag tag-success">✓ Terkirim</span></td>
    `;
    tbody.insertBefore(row, tbody.firstChild);
  }, 2000);
}

// ============================================================
// Initialize
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  navigateTo('dashboard');
});
