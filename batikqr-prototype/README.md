# BatikQR MVP Prototype

Prototipe untuk **BatikQR** — web app QR ecosystem untuk toko batik yang menghubungkan pengalaman offline (scan QR di etalase) ke katalog digital, dilengkapi seller dashboard dan WhatsApp bot reporting.

> 📋 Referensi: [PRD BatikQR MVP](../PRD_BatikQR_MVP.md)

---

## 📁 Struktur Proyek

```
batikqr-prototype/
├── dashboard/                  # Seller Dashboard (Frontend)
│   ├── index.html              # Single-page dashboard app
│   ├── css/
│   │   └── style.css           # Stylesheet (tema batik)
│   └── js/
│       ├── data.js             # Data statis (mock data)
│       └── app.js              # Logic: navigasi, chart, CRUD, render
│
├── whatsapp-bot/               # WhatsApp Bot (Node.js + Baileys)
│   ├── package.json            # Dependencies
│   ├── .env.example            # Contoh konfigurasi
│   ├── .gitignore
│   └── src/
│       ├── index.js            # Entry point + koneksi Baileys
│       ├── data.js             # Data statis (sinkron dgn dashboard)
│       ├── formatter.js        # Message formatter laporan
│       └── scheduler.js        # Cron scheduler + retry logic
│
└── README.md                   # Dokumentasi ini
```

---

## 🏪 Seller Dashboard

Dashboard frontend untuk seller yang mencakup fitur sesuai PRD Section 5.1B:

### Fitur

| Fitur | Deskripsi | PRD Ref |
|-------|-----------|---------|
| **Dashboard Insight** | Stats overview, ranking most viewed & most bought, conversion rate, chart tren scan | FR-07, FR-08, FR-09, FR-10 |
| **Kelola Etalase** | CRUD etalase, generate QR code per etalase | FR-06 |
| **Kelola Produk** | CRUD produk per etalase, storytelling motif, filter per etalase | FR-06 |
| **Laporan WhatsApp** | Preview laporan harian, log pengiriman, trigger kirim manual | FR-11, FR-12, FR-13 |

### Cara Menjalankan

Dashboard adalah file HTML statis — cukup buka di browser:

```bash
# Opsi 1: Buka langsung
open dashboard/index.html

# Opsi 2: Pakai live server (recommended)
npx serve dashboard

# Opsi 3: Python HTTP server
cd dashboard && python3 -m http.server 8080
```

### Screenshot Fitur

- **📊 Dashboard Insight** — Stat cards, ranking tables, conversion bars, chart tren scan per jam/hari/minggu
- **🏪 Kelola Etalase** — Card-based view, QR generation via API, CRUD modal
- **👘 Kelola Produk** — Product cards dengan storytelling motif, filter per etalase
- **💬 Laporan WA** — Preview message format, delivery log table

---

## 🤖 WhatsApp Bot

Bot WhatsApp menggunakan **Baileys** (`@whiskeysockets/baileys`) untuk mengirim laporan harian otomatis sesuai PRD Section 5.1C.

### Fitur Bot

| Fitur | Deskripsi | PRD Ref |
|-------|-----------|---------|
| **Scheduler Harian** | Kirim laporan otomatis setiap pukul 20:00 WIB | FR-11 |
| **Format Laporan** | Top 5 viewed, Top 5 bought, highlight naik/turun, conversion rate | FR-11, FR-12 |
| **Retry Logic** | Retry hingga 3x jika pengiriman gagal (interval 5 menit) | System Rule 7 |
| **Delivery Log** | Catat semua status pengiriman | FR-13 |
| **Manual Trigger** | Kirim pesan "report" untuk trigger laporan manual | - |

### Setup & Menjalankan

```bash
# 1. Masuk ke folder bot
cd whatsapp-bot

# 2. Install dependencies
npm install

# 3. (Opsional) Set nomor penerima
#    Edit RECIPIENT_NUMBER di src/index.js
#    atau set environment variable:
export RECIPIENT_NUMBER=628123456789

# 4. Jalankan bot
npm start

# 5. Scan QR code yang muncul di terminal dengan WhatsApp
#    WhatsApp → Menu (⋮) → Perangkat Tertaut → Tautkan Perangkat
```

### Command Bot

Kirim pesan berikut ke bot via WhatsApp:

| Perintah | Fungsi |
|----------|--------|
| `report` / `laporan` | Kirim laporan harian sekarang |
| `status` | Cek status bot dan riwayat pengiriman |
| `help` / `bantuan` | Tampilkan daftar perintah |

### Contoh Format Laporan

```
📊 RINGKASAN HARIAN BATIKQR
━━━━━━━━━━━━━━━━━━━━━━
📅 Jumat, 14 Februari 2026
🏪 Toko Batik Sari

📈 TOP 5 PRODUK PALING DILIHAT
━━━━━━━━━━━━━━━━━━━━━━
🥇 Outer Batik Megamendung Classic
    👁️ 834 views
🥈 Kemeja Batik Truntum Heritage
    👁️ 765 views
...

🛒 TOP 5 PRODUK PALING DIBELI
━━━━━━━━━━━━━━━━━━━━━━
🥇 Kemeja Batik Truntum Heritage
    🛒 71 pcs (CR: 9.3%)
...

📊 RINGKASAN PERFORMA
━━━━━━━━━━━━━━━━━━━━━━
📡 Total Scan     : 1.284
👁️ Total Views    : 3.912
🛒 Total Pembelian: 286
🔄 Conversion Rate: 7.3%
```

---

## 🗂️ Data Statis

Semua data bersifat statis (mock) untuk kebutuhan presentasi prototipe. Data mencakup:

- **3 Etalase**: Motif Klasik, Motif Modern, Premium
- **11 Produk**: Beragam motif batik (Truntum, Kawung, Parang, Megamendung, dll.)
- **Analytics**: Data per periode (hari ini, 7 hari, 30 hari) mencakup views, purchases, trends
- **Storytelling**: Copywriting motif batik sesuai PRD Section 13

---

## 🔗 Mapping ke PRD

| PRD Section | Implementasi |
|-------------|-------------|
| 5.1B Seller-facing | Dashboard: insight, ranking, CRUD, QR |
| 5.1C WA Bot Reporting | Bot: scheduler, formatter, delivery |
| 7 System Rules (Rule 5-8) | Period filter, scheduler, retry, default content |
| 9.2 Seller Dashboard (FR-06 to FR-10) | Dashboard pages |
| 9.3 Bot & Notification (FR-11 to FR-13) | WhatsApp bot modules |
| 11 Data Model | Static data structure |
| 13 Copywriting Storytelling | Product story_text |

---

## ⚠️ Catatan Prototipe

- Data bersifat **statis** dan disimpan di memori (tidak ada database).
- CRUD beroperasi pada array in-memory — refresh halaman akan reset data.
- QR code di-generate via `api.qrserver.com` (membutuhkan internet).
- WhatsApp bot memerlukan **scan QR WhatsApp** saat pertama kali dijalankan.
- Session bot disimpan di folder `auth_session/` — tidak perlu scan ulang selama session valid.

---

*BatikQR MVP Prototype — Dibuat untuk hackathon & validasi konsep*
