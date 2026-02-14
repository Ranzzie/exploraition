/**
 * BatikQR WhatsApp Bot — Static Report Data
 * Data statis identik dengan dashboard untuk konsistensi demo
 * Referensi: PRD Section 11 (Data Model), Section 13 (Seed Content)
 */

const STORE = {
  id: 'store-001',
  name: 'Toko Batik Sari',
  owner: 'Bu Sari',
  phone: '628123456789'
};

const PRODUCTS = [
  { id: 'prod-001', motif_name: 'Truntum', product_name: 'Kemeja Batik Truntum Heritage', price: 389000 },
  { id: 'prod-002', motif_name: 'Kawung', product_name: 'Blouse Batik Kawung Signature', price: 349000 },
  { id: 'prod-003', motif_name: 'Parang', product_name: 'Dress Batik Parang Rusak', price: 475000 },
  { id: 'prod-004', motif_name: 'Sido Mukti', product_name: 'Sarung Batik Sido Mukti', price: 299000 },
  { id: 'prod-005', motif_name: 'Megamendung', product_name: 'Outer Batik Megamendung Classic', price: 425000 },
  { id: 'prod-006', motif_name: 'Lereng', product_name: 'Scarf Batik Lereng Elegan', price: 189000 },
  { id: 'prod-007', motif_name: 'Sekar Jagad', product_name: 'Kemeja Batik Sekar Jagad', price: 410000 },
  { id: 'prod-008', motif_name: 'Ceplok', product_name: 'Rok Batik Ceplok Modern', price: 325000 },
  { id: 'prod-009', motif_name: 'Truntum', product_name: 'Kebaya Batik Tulis Truntum', price: 1250000 },
  { id: 'prod-010', motif_name: 'Parang', product_name: 'Kain Batik Tulis Parang Barong', price: 1850000 },
  { id: 'prod-011', motif_name: 'Semen Rama', product_name: 'Selendang Batik Tulis Semen Rama', price: 975000 }
];

const DAILY_ANALYTICS = {
  total_scans: 1284,
  total_views: 3912,
  total_purchases: 286,
  conversion_rate: 7.3,
  product_stats: [
    { product_id: 'prod-005', views: 834, purchases: 64, trend: 'up' },
    { product_id: 'prod-001', views: 765, purchases: 71, trend: 'up' },
    { product_id: 'prod-002', views: 612, purchases: 53, trend: 'down' },
    { product_id: 'prod-003', views: 488, purchases: 41, trend: 'up' },
    { product_id: 'prod-006', views: 410, purchases: 37, trend: 'down' },
    { product_id: 'prod-007', views: 298, purchases: 28, trend: 'up' },
    { product_id: 'prod-008', views: 245, purchases: 22, trend: 'stable' },
    { product_id: 'prod-004', views: 198, purchases: 18, trend: 'down' },
    { product_id: 'prod-009', views: 152, purchases: 14, trend: 'up' },
    { product_id: 'prod-010', views: 120, purchases: 8, trend: 'up' },
    { product_id: 'prod-011', views: 90, purchases: 6, trend: 'stable' }
  ]
};

function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

function formatNumber(num) {
  return num.toLocaleString('id-ID');
}

module.exports = {
  STORE,
  PRODUCTS,
  DAILY_ANALYTICS,
  getProductById,
  formatNumber
};
