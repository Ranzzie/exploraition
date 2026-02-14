/**
 * BatikQR MVP — Static Data Module
 * Data statis untuk prototipe seller dashboard
 * Referensi: PRD Section 11 (Data Model) & Section 13 (Seed Content)
 */

const STORE = {
  id: 'store-001',
  name: 'Toko Batik Sari',
  owner: 'Bu Sari',
  phone: '628123456789',
  address: 'Jl. Malioboro No. 42, Yogyakarta'
};

const SELLER_USERS = [
  { id: 'user-001', name: 'Bu Sari', phone: '628123456789', role: 'owner' },
  { id: 'user-002', name: 'Dimas', phone: '628198765432', role: 'staff' }
];

const SHOWCASES = [
  {
    id: 'sc-001',
    seller_id: 'user-001',
    name: 'Etalase Motif Klasik',
    qr_token: 'ETL-KLS-01',
    status: 'active',
    description: 'Koleksi batik motif klasik Jawa warisan budaya nusantara',
    created_at: '2026-01-15'
  },
  {
    id: 'sc-002',
    seller_id: 'user-001',
    name: 'Etalase Motif Modern',
    qr_token: 'ETL-MDN-02',
    status: 'active',
    description: 'Koleksi batik dengan sentuhan modern dan kontemporer',
    created_at: '2026-01-18'
  },
  {
    id: 'sc-003',
    seller_id: 'user-001',
    name: 'Etalase Premium',
    qr_token: 'ETL-PRM-03',
    status: 'active',
    description: 'Koleksi batik premium tulis tangan dari pengrajin senior',
    created_at: '2026-01-20'
  }
];

const PRODUCTS = [
  // Etalase Motif Klasik
  {
    id: 'prod-001',
    showcase_id: 'sc-001',
    motif_name: 'Truntum',
    product_name: 'Kemeja Batik Truntum Heritage',
    price: 389000,
    image_url: null,
    story_text: 'Motif Truntum melambangkan cinta yang tumbuh kembali—simbol ketulusan yang terus menyala. Pilihan tepat untuk tampilan anggun dengan makna mendalam.',
    status: 'active',
    stock: 12,
    color_gradient: ['#8B6914', '#D4A843']
  },
  {
    id: 'prod-002',
    showcase_id: 'sc-001',
    motif_name: 'Kawung',
    product_name: 'Blouse Batik Kawung Signature',
    price: 349000,
    image_url: null,
    story_text: 'Motif Kawung merepresentasikan kebijaksanaan, kesucian, dan pengendalian diri. Pola geometrisnya membuatnya klasik, rapi, dan timeless.',
    status: 'active',
    stock: 4,
    color_gradient: ['#5C4033', '#A0826D']
  },
  {
    id: 'prod-003',
    showcase_id: 'sc-001',
    motif_name: 'Parang',
    product_name: 'Dress Batik Parang Rusak',
    price: 475000,
    image_url: null,
    story_text: 'Motif Parang menggambarkan semangat pantang menyerah dan kesinambungan perjuangan. Cocok untuk kesan tegas, berkarakter, dan berkelas.',
    status: 'active',
    stock: 8,
    color_gradient: ['#704214', '#C49A6C']
  },
  {
    id: 'prod-004',
    showcase_id: 'sc-001',
    motif_name: 'Sido Mukti',
    product_name: 'Sarung Batik Sido Mukti',
    price: 299000,
    image_url: null,
    story_text: 'Motif Sido Mukti bermakna harapan untuk hidup sejahtera dan bahagia. Simbol doa kebaikan yang menyelimuti pemakainya.',
    status: 'active',
    stock: 15,
    color_gradient: ['#6B4226', '#B8860B']
  },
  // Etalase Motif Modern
  {
    id: 'prod-005',
    showcase_id: 'sc-002',
    motif_name: 'Megamendung',
    product_name: 'Outer Batik Megamendung Classic',
    price: 425000,
    image_url: null,
    story_text: 'Motif Megamendung terinspirasi awan yang menaungi: teduh, tenang, dan berwibawa. Coraknya memberi karakter kuat namun tetap elegan.',
    status: 'active',
    stock: 6,
    color_gradient: ['#1B4F72', '#5DADE2']
  },
  {
    id: 'prod-006',
    showcase_id: 'sc-002',
    motif_name: 'Lereng',
    product_name: 'Scarf Batik Lereng Elegan',
    price: 189000,
    image_url: null,
    story_text: 'Motif Lereng menggambarkan lereng gunung yang kokoh dan penuh keteguhan. Aksesori sempurna untuk melengkapi gaya stylish Anda.',
    status: 'active',
    stock: 20,
    color_gradient: ['#4A235A', '#A569BD']
  },
  {
    id: 'prod-007',
    showcase_id: 'sc-002',
    motif_name: 'Sekar Jagad',
    product_name: 'Kemeja Batik Sekar Jagad',
    price: 410000,
    image_url: null,
    story_text: 'Motif Sekar Jagad menggambarkan keindahan dan keberagaman dunia. Setiap potongannya menyatu harmonis, seperti keragaman yang saling melengkapi.',
    status: 'active',
    stock: 9,
    color_gradient: ['#1E8449', '#52BE80']
  },
  {
    id: 'prod-008',
    showcase_id: 'sc-002',
    motif_name: 'Ceplok',
    product_name: 'Rok Batik Ceplok Modern',
    price: 325000,
    image_url: null,
    story_text: 'Motif Ceplok memiliki pola simetris yang mencerminkan keseimbangan hidup. Desain modern yang tetap menghormati tradisi.',
    status: 'active',
    stock: 11,
    color_gradient: ['#922B21', '#E74C3C']
  },
  // Etalase Premium
  {
    id: 'prod-009',
    showcase_id: 'sc-003',
    motif_name: 'Truntum',
    product_name: 'Kebaya Batik Tulis Truntum',
    price: 1250000,
    image_url: null,
    story_text: 'Karya batik tulis tangan motif Truntum dari pengrajin senior Yogyakarta. Setiap helai benang menyimpan cinta dan ketulusan sang pembatik.',
    status: 'active',
    stock: 3,
    color_gradient: ['#7D6608', '#F1C40F']
  },
  {
    id: 'prod-010',
    showcase_id: 'sc-003',
    motif_name: 'Parang',
    product_name: 'Kain Batik Tulis Parang Barong',
    price: 1850000,
    image_url: null,
    story_text: 'Parang Barong adalah level tertinggi dari motif Parang, dahulu hanya dikenakan keluarga keraton. Karya agung batik tulis dengan detail luar biasa.',
    status: 'active',
    stock: 2,
    color_gradient: ['#784212', '#E67E22']
  },
  {
    id: 'prod-011',
    showcase_id: 'sc-003',
    motif_name: 'Semen Rama',
    product_name: 'Selendang Batik Tulis Semen Rama',
    price: 975000,
    image_url: null,
    story_text: 'Motif Semen Rama melambangkan kesuburan dan kemakmuran, terinspirasi dari kisah epik Ramayana. Karya seni yang bisa dikenakan.',
    status: 'active',
    stock: 5,
    color_gradient: ['#0E6251', '#1ABC9C']
  }
];

// ============================================================
// Analytics Data — Static per Period
// ============================================================

const ANALYTICS = {
  today: {
    total_scans: 1284,
    total_views: 3912,
    total_purchases: 286,
    conversion_rate: 7.3,
    revenue: 124750000,
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
    ],
    hourly_scans: [12, 18, 8, 5, 3, 2, 15, 45, 89, 142, 168, 185, 156, 120, 98, 78, 62, 45, 22, 10, 0, 0, 0, 0],
    showcase_stats: [
      { showcase_id: 'sc-001', scans: 524, views: 1563, purchases: 121 },
      { showcase_id: 'sc-002', scans: 486, views: 1487, purchases: 98 },
      { showcase_id: 'sc-003', scans: 274, views: 862, purchases: 67 }
    ]
  },
  '7days': {
    total_scans: 8456,
    total_views: 25890,
    total_purchases: 1842,
    conversion_rate: 7.1,
    revenue: 812400000,
    product_stats: [
      { product_id: 'prod-001', views: 5240, purchases: 482, trend: 'up' },
      { product_id: 'prod-005', views: 4980, purchases: 410, trend: 'up' },
      { product_id: 'prod-002', views: 3850, purchases: 324, trend: 'stable' },
      { product_id: 'prod-003', views: 3120, purchases: 268, trend: 'up' },
      { product_id: 'prod-007', views: 2640, purchases: 198, trend: 'up' },
      { product_id: 'prod-006', views: 2280, purchases: 176, trend: 'down' },
      { product_id: 'prod-008', views: 1760, purchases: 142, trend: 'stable' },
      { product_id: 'prod-004', views: 1420, purchases: 108, trend: 'down' },
      { product_id: 'prod-009', views: 980, purchases: 86, trend: 'up' },
      { product_id: 'prod-010', views: 720, purchases: 42, trend: 'up' },
      { product_id: 'prod-011', views: 540, purchases: 32, trend: 'stable' }
    ],
    daily_scans: [1120, 1245, 1380, 1190, 1050, 1187, 1284],
    showcase_stats: [
      { showcase_id: 'sc-001', scans: 3450, views: 10210, purchases: 782 },
      { showcase_id: 'sc-002', scans: 3180, views: 9680, purchases: 624 },
      { showcase_id: 'sc-003', scans: 1826, views: 5600, purchases: 436 }
    ]
  },
  '30days': {
    total_scans: 34520,
    total_views: 108400,
    total_purchases: 7856,
    conversion_rate: 7.2,
    revenue: 3428000000,
    product_stats: [
      { product_id: 'prod-001', views: 21200, purchases: 1980, trend: 'up' },
      { product_id: 'prod-005', views: 19800, purchases: 1720, trend: 'up' },
      { product_id: 'prod-002', views: 15400, purchases: 1280, trend: 'down' },
      { product_id: 'prod-003', views: 12800, purchases: 1050, trend: 'stable' },
      { product_id: 'prod-007', views: 10500, purchases: 820, trend: 'up' },
      { product_id: 'prod-006', views: 9200, purchases: 695, trend: 'down' },
      { product_id: 'prod-008', views: 7200, purchases: 580, trend: 'stable' },
      { product_id: 'prod-004', views: 5800, purchases: 442, trend: 'down' },
      { product_id: 'prod-009', views: 4100, purchases: 362, trend: 'up' },
      { product_id: 'prod-010', views: 2900, purchases: 186, trend: 'up' },
      { product_id: 'prod-011', views: 2200, purchases: 148, trend: 'stable' }
    ],
    weekly_scans: [7800, 8200, 8950, 9570],
    showcase_stats: [
      { showcase_id: 'sc-001', scans: 14100, views: 43200, purchases: 3320 },
      { showcase_id: 'sc-002', scans: 12800, views: 39800, purchases: 2640 },
      { showcase_id: 'sc-003', scans: 7620, views: 25400, purchases: 1896 }
    ]
  }
};

// ============================================================
// Helper Functions
// ============================================================

function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

function getShowcaseById(id) {
  return SHOWCASES.find(s => s.id === id);
}

function getProductsByShowcase(showcaseId) {
  return PRODUCTS.filter(p => p.showcase_id === showcaseId);
}

function formatRupiah(amount) {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

function formatNumber(num) {
  return num.toLocaleString('id-ID');
}

function getConversionRate(views, purchases) {
  if (views === 0) return '0%';
  return ((purchases / views) * 100).toFixed(1) + '%';
}

function getTrendIcon(trend) {
  switch (trend) {
    case 'up': return '<span class="trend-up">↑ Naik</span>';
    case 'down': return '<span class="trend-down">↓ Turun</span>';
    default: return '<span class="trend-stable">→ Stabil</span>';
  }
}

function getTrendClass(trend) {
  switch (trend) {
    case 'up': return 'tag-success';
    case 'down': return 'tag-warning';
    default: return 'tag-neutral';
  }
}

function generateQRUrl(token) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://batikqr.app/s/${token}`)}`;
}
