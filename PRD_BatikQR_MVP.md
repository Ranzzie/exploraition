# Product Requirements Document (PRD)
## BatikQR MVP (Web App QR Ecosystem untuk Toko Batik)

- **Versi**: v1.0 (Pivot Draft)
- **Tanggal**: 14 Februari 2026
- **Status**: Siap untuk prototyping hackathon
- **Dokumen owner**: Product Team

---

## 1) Ringkasan Produk

**BatikQR** adalah web app untuk toko batik yang menghubungkan pengalaman offline (scan QR di etalase) ke katalog digital per etalase. Setiap produk menampilkan storytelling motif batik yang menarik, dan seller mendapatkan insight performa produk berdasarkan data scan dan pembelian.

### Tujuan utama
1. Membantu pembeli memahami nilai budaya tiap motif batik dengan cara cepat.
2. Meningkatkan konversi lihat produk menjadi pembelian.
3. Membantu seller mengambil keputusan stok/display berdasarkan data nyata.
4. Mengotomasi laporan ranking performa produk ke WhatsApp owner.

### Nilai inti MVP
- **Customer experience cepat**: scan QR → lihat katalog etalase → pahami motif → beli.
- **Cultural storytelling**: setiap motif punya narasi ringkas dan engaging.
- **Data-driven seller**: insight produk paling dilihat & paling dibeli.
- **Actionable reporting**: ringkasan harian otomatis via bot WhatsApp.

---

## 2) Problem Statement

### Masalah untuk pembeli
- Pengunjung sering melihat batik dari tampilan visual saja tanpa memahami makna motif.
- Informasi produk dan cerita budaya sering tidak tersedia di tempat pembelian.
- Sulit membandingkan produk dalam etalase dengan cepat.

### Masalah untuk seller
- Seller tidak tahu etalase/produk mana paling menarik perhatian.
- Data pembelian sering terpisah dari data minat (view/scan), sehingga insight kurang lengkap.
- Rekap manual memakan waktu dan tidak real-time.

### Dampak
- Potensi pembelian hilang karena edukasi produk kurang.
- Seller sulit mengoptimasi display, restock, dan promosi.
- Pengalaman budaya batik belum maksimal di titik penjualan.

---

## 3) Product Vision & MVP Goal

### Vision
Menjadikan pengalaman belanja batik lebih edukatif, interaktif, dan terukur melalui QR ecosystem berbasis etalase.

### MVP Goal (60–90 hari)
Membuktikan bahwa kombinasi **QR etalase + storytelling motif + analytics ranking + WA report** dapat:
1. Meningkatkan engagement pengunjung terhadap produk batik.
2. Meningkatkan conversion dari view ke pembelian.
3. Membantu seller mengambil keputusan operasional harian lebih cepat.

### Non-goal MVP
- Marketplace multi-merchant skala nasional.
- AI recommendation engine kompleks.
- Integrasi POS enterprise mendalam.
- Loyalty system penuh lintas toko.

---

## 4) Persona Utama

### 4.1 Persona Pembeli 1 — Rani (Turis Budaya)
- **Profil**: 27 tahun, turis domestik, suka produk lokal dengan cerita otentik.
- **Tujuan**:
  - Memahami makna motif sebelum membeli.
  - Memilih produk yang paling sesuai gaya dan nilai budaya.
- **Pain points**:
  - Informasi produk di toko sering minim.
  - Penjelasan staf tidak selalu konsisten.
- **Perilaku digital**:
  - Nyaman scan QR dan baca konten singkat mobile.
- **Kebutuhan produk kritis**:
  - Halaman cepat, visual jelas, storytelling ringkas.

### 4.2 Persona Pembeli 2 — Fajar (Pembeli Cepat)
- **Profil**: 34 tahun, pekerja, belanja dengan waktu terbatas.
- **Tujuan**:
  - Memilih produk cepat tanpa harus tanya detail panjang.
  - Langsung checkout saat sudah cocok.
- **Pain points**:
  - Sulit membedakan motif secara cepat.
- **Kebutuhan produk kritis**:
  - Informasi inti dalam 1 layar: nama motif, harga, makna singkat, tombol beli.

### 4.3 Persona Penjual 1 — Bu Sari (Pemilik Toko Batik)
- **Profil**: 45 tahun, owner toko batik lokal, keputusan stok dan display dipegang sendiri.
- **Tujuan**:
  - Tahu produk mana yang paling menarik pengunjung.
  - Tahu produk mana paling laku untuk restock.
- **Pain points**:
  - Rekap data manual lambat.
  - Sulit membedakan “dilihat banyak tapi tidak dibeli” vs “langsung laku”.
- **Kebutuhan produk kritis**:
  - Dashboard sederhana + ranking harian.
  - Laporan otomatis ke WhatsApp.

### 4.4 Persona Penjual 2 — Dimas (Staf Operasional)
- **Profil**: 24 tahun, staf toko yang update katalog dan display etalase.
- **Tujuan**:
  - Mudah update produk per etalase.
  - Mudah generate ulang QR bila display berubah.
- **Pain points**:
  - Tool terlalu kompleks menghambat pekerjaan harian.
- **Kebutuhan produk kritis**:
  - CRUD produk sederhana dan QR management praktis.

---

## 5) Scope Fitur MVP

## 5.1 Fitur wajib (In-Scope)

### A. Customer-facing (Pembeli)
1. **Scan QR per etalase** untuk membuka halaman katalog sesuai etalase.
2. **Katalog produk per etalase** (foto, nama produk, nama motif, harga, status).
3. **Storytelling motif per produk** (copywriting singkat, menarik, dan informatif).
4. **Aksi pembelian** (checkout sederhana / pencatatan pembelian sukses).

### B. Seller-facing
1. **Dashboard insight produk**:
   - Produk paling banyak dilihat (most viewed),
   - Produk paling banyak dibeli (most bought),
   - Konversi view→buy sederhana.
2. **Urut ranking** berdasarkan periode (hari ini, 7 hari, 30 hari).
3. **Kelola etalase & produk** (CRUD).
4. **Generate QR per etalase**.

### C. WhatsApp Bot Reporting
1. **Scheduler** laporan harian otomatis.
2. **Isi laporan**:
   - Top 5 most viewed,
   - Top 5 most bought,
   - highlight produk naik/turun,
   - ringkasan conversion rate.
3. **Pengiriman** ke nomor WhatsApp owner/stakeholder toko.

## 5.2 Fitur ditunda (Out-of-Scope/Post-MVP)
1. Rekomendasi personal berbasis AI.
2. Multi-cabang dengan role permission kompleks.
3. Loyalty/points pelanggan.
4. Integrasi omnichannel (marketplace) penuh.
5. Content management multimedia kompleks (video panjang, live stream).

---

## 6) Core Concept Translation

### 6.1 QR per etalase (offline to online)
Setiap etalase fisik memiliki QR unik yang memetakan user ke katalog digital sesuai konteks etalase tersebut.

### 6.2 Storytelling batik sebagai pembeda
Setiap produk memuat narasi motif batik untuk meningkatkan nilai emosional dan pemahaman budaya.

### 6.3 Analytics two-layer
- Layer 1: **Interest** (scan/view)
- Layer 2: **Purchase** (buy)
Perbandingan dua layer membantu seller membaca funnel produk.

### 6.4 WhatsApp as execution channel
Insight tidak berhenti di dashboard; hasil ranking di-deliver langsung via WA agar keputusan harian lebih cepat.

---

## 7) System Rules / Process Logic

1. **IF** QR etalase di-scan **THEN** sistem membuka halaman katalog etalase terkait.
2. **IF** etalase tidak aktif **THEN** sistem menampilkan status “etalase tidak tersedia”.
3. **IF** user membuka detail produk **THEN** sistem mencatat event `product_viewed`.
4. **IF** pembelian sukses **THEN** sistem mencatat event `purchase_completed`.
5. **IF** periode laporan dipilih **THEN** sistem mengurutkan produk berdasarkan jumlah view dan buy.
6. **IF** scheduler harian berjalan **THEN** bot WA mengirim ringkasan ranking otomatis.
7. **IF** pengiriman WA gagal **THEN** sistem retry sesuai policy dan log error.
8. **IF** story motif kosong **THEN** sistem menampilkan template copy default agar halaman tetap informatif.

---

## 8) Basic User Flow (MVP)

### 8.1 Pembeli
1. Scan QR di etalase.
2. Buka katalog etalase.
3. Lihat produk + storytelling motif.
4. Pilih produk.
5. Lakukan pembelian.
6. Sistem menampilkan status sukses.

### 8.2 Seller
1. Login dashboard.
2. Kelola produk per etalase.
3. Pantau ranking viewed vs bought.
4. Terima laporan harian via WhatsApp.
5. Ambil keputusan display/restock/promosi.

---

## 9) Functional Requirements (MVP)

### 9.1 Customer App
- **FR-01**: Sistem harus route QR token ke etalase yang benar.
- **FR-02**: Sistem harus menampilkan katalog berdasarkan etalase aktif.
- **FR-03**: Sistem harus menampilkan storytelling per produk.
- **FR-04**: Sistem harus mencatat event scan dan view.
- **FR-05**: Sistem harus mencatat transaksi pembelian sukses.

### 9.2 Seller Dashboard
- **FR-06**: Seller dapat CRUD etalase dan produk.
- **FR-07**: Seller dapat melihat ranking most viewed.
- **FR-08**: Seller dapat melihat ranking most bought.
- **FR-09**: Seller dapat melihat conversion view→buy per produk.
- **FR-10**: Seller dapat filter data berdasarkan periode waktu.

### 9.3 Bot & Notification
- **FR-11**: Sistem harus generate ringkasan harian ranking otomatis.
- **FR-12**: Sistem harus mengirim ringkasan ke WhatsApp tujuan.
- **FR-13**: Sistem harus menyimpan log status pengiriman WA.

---

## 10) Non-Functional Requirements

1. **Performance**: halaman katalog terbuka < 3 detik di jaringan mobile normal.
2. **Availability**: uptime target 99.0% pada masa pilot.
3. **Security**:
   - endpoint dashboard dilindungi autentikasi,
   - validasi callback pembelian,
   - sanitasi input story untuk mencegah script injection.
4. **Scalability MVP**: dukung minimal 1 toko dengan 3.000 scan/hari.
5. **Usability**:
   - customer flow maksimal 3–4 langkah inti,
   - seller dashboard dapat dipahami user non-teknis.

---

## 11) Data Model Konseptual (Ringkas)

- **SellerUser**: id, name, phone, role.
- **Showcase**: id, seller_id, name, qr_token, status.
- **Product**: id, showcase_id, motif_name, product_name, price, image_url, story_text, status.
- **EventLog**: id, event_type (`qr_scanned`, `product_viewed`, `purchase_completed`), product_id, showcase_id, timestamp.
- **Order**: id, product_id, total_amount, payment_status, paid_at.
- **DailyReport**: id, report_date, top_viewed_json, top_bought_json, conversion_summary.
- **BotDeliveryLog**: id, report_id, channel, recipient, status, sent_at, error_message.

---

## 12) Integrasi & Arsitektur Teknis (MVP)

### Stack rekomendasi vibe-coding
- **Frontend**: web responsive mobile-first.
- **Backend**: API + event ingestion + scheduler.
- **Database**: PostgreSQL.
- **WA Bot**: WhatsApp Cloud API / provider pihak ketiga.
- **(Opsional) Payment**: Midtrans untuk validasi pembelian otomatis.

### Prinsip implementasi
- Mulai dari monolith modular untuk kecepatan delivery.
- Event tracking wajib dari hari pertama.
- Semua fitur yang tidak memengaruhi validasi konsep ditunda ke post-MVP.

---

## 13) Copywriting Storytelling Motif (Seed Content MVP)

### Truntum
“Motif **Truntum** melambangkan cinta yang tumbuh kembali—simbol ketulusan yang terus menyala. Pilihan tepat untuk tampilan anggun dengan makna mendalam.”

### Megamendung
“Motif **Megamendung** terinspirasi awan yang menaungi: teduh, tenang, dan berwibawa. Coraknya memberi karakter kuat namun tetap elegan.”

### Kawung
“Motif **Kawung** merepresentasikan kebijaksanaan, kesucian, dan pengendalian diri. Pola geometrisnya membuatnya klasik, rapi, dan timeless.”

### Parang
“Motif **Parang** menggambarkan semangat pantang menyerah dan kesinambungan perjuangan. Cocok untuk kesan tegas, berkarakter, dan berkelas.”

> Catatan: konten budaya perlu validasi kurator/ahli budaya sebelum produksi skala besar.

---

## 14) Success Metrics & KPI MVP

### North-star proxy
- **View-to-Purchase Conversion Rate** per produk.

### KPI utama
1. **Scan activation**: ≥ 70% scan menghasilkan minimal 1 product view.
2. **Conversion**: ≥ 10% dari product view berujung pembelian.
3. **Dashboard usage**: seller membuka dashboard minimal 4x/minggu.
4. **WA report reliability**: ≥ 95% laporan harian terkirim sukses.
5. **Data usefulness**: seller dapat mengidentifikasi minimal 3 produk top performer per minggu.

### Guardrail metric
- Error rate halaman katalog < 1%.
- Duplikasi event scan/view < 3%.

---

## 15) Eksperimen Validasi Konsep (Hackathon)

### Fase 1: Build Core (Hari 1–2)
- QR mapping, katalog etalase, storytelling seed content.

### Fase 2: Tracking & Dashboard (Hari 2–3)
- Event tracking, ranking viewed/bought, filter periode.

### Fase 3: WA Bot Demo (Hari 3)
- Scheduler + message formatter + send ke nomor uji.

### Fase 4: Demo Scenario (Hari 3)
- Simulasi scan ramai + pembelian + laporan harian.

---

## 16) Risiko & Mitigasi

1. **Data pembelian belum rapi**
   - Mitigasi: definisi event transaksi yang tegas + validasi status.
2. **Konten budaya kurang akurat**
   - Mitigasi: template konten + review cepat oleh sumber tepercaya.
3. **WA API limitation / rate limit**
   - Mitigasi: batching, retry, dan fallback manual export.
4. **Adopsi staf toko rendah**
   - Mitigasi: dashboard super sederhana + onboarding 15 menit.

---

## 17) Asumsi Kunci & Technical Constraints

### Asumsi
- Toko memasang QR fisik di setiap etalase.
- Pengunjung memiliki smartphone dengan internet.
- Owner/staf aktif menggunakan WhatsApp untuk operasional.

### Constraint
- Tim kecil dan waktu hackathon terbatas.
- Fokus validasi konsep, bukan arsitektur enterprise.
- Integrasi eksternal dipilih yang paling cepat diimplementasi.

---

## 18) MVP Delivery Plan (High-Level)

### Sprint/Batch 1
- Data model, QR token mapping, halaman katalog etalase.

### Sprint/Batch 2
- Storytelling module, tracking scan/view/purchase.

### Sprint/Batch 3
- Dashboard ranking + filter periode.

### Sprint/Batch 4
- WA bot summary + hardening demo.

---

## 19) Open Questions

1. Definisi “pembelian” untuk hackathon: simulasi checkout atau payment gateway live?
2. Laporan WA: harian saja atau perlu mode on-demand (manual trigger)?
3. Apakah ranking dipisah per etalase atau agregat seluruh toko?
4. Apakah perlu multi-bahasa (ID/EN) untuk turis asing sejak MVP?

---

## 20) Definisi MVP “Done”

MVP dinyatakan siap jika:
1. QR etalase berhasil mengarahkan ke katalog yang tepat.
2. Storytelling motif tampil pada produk utama.
3. Dashboard menampilkan ranking viewed & bought dengan benar.
4. WA bot mengirim laporan ringkasan otomatis minimal 1 kali sukses.
5. Demo end-to-end (scan → view → buy → report) berjalan stabil.
