# Product Requirements Document (PRD)
## JogPass MVP (JogjaPass)

- **Versi**: v1.0 (MVP Draft)
- **Tanggal**: 14 Februari 2026
- **Status**: Siap untuk validasi konsep & perencanaan sprint
- **Dokumen owner**: Product Team

---

## 1) Ringkasan Produk

**JogPass** adalah aplikasi **QR Ecosystem** untuk membantu turis dan warga Yogyakarta menjalani aktivitas harian secara lebih praktis melalui QR: melihat menu/produk, memahami cerita budaya lokal, bertransaksi digital, dan mengumpulkan "passport stamp" lintas UMKM.

### Tujuan utama
Memudahkan turis/warga Jogja dengan mengintegrasikan QR dalam kehidupan sehari-hari serta meningkatkan eksposur dan transaksi UMKM lokal.

### Nilai inti MVP
1. **Praktis untuk pengguna**: satu alur scan → lihat info → transaksi.
2. **Mudah untuk UMKM**: pembuatan QR dan update katalog tanpa kompleksitas tinggi.
3. **Berbeda dari katalog biasa**: ada **storytelling budaya** dan **passport gamification**.

---

## 2) Problem Statement

Saat ini pengalaman wisata/aktivitas lokal di Yogyakarta masih terfragmentasi:
- Banyak UMKM belum punya kanal digital sederhana untuk katalog & pembayaran.
- Turis kesulitan menemukan informasi kontekstual (menu/produk + cerita budaya) dalam satu alur.
- Discovery antar-UMKM (cross-sell berbasis lokasi/minat) belum terstruktur.
- Tidak ada insentif ringan yang mendorong wisatawan mengeksplorasi lebih banyak UMKM lokal.

**Dampak**:
- Potensi transaksi hilang.
- Engagement wisatawan rendah.
- UMKM sulit memperoleh data sederhana tentang performa produk/transaksi.

---

## 3) Product Vision & MVP Goal

### Vision
Membangun ekosistem QR terpadu untuk perjalanan wisata dan konsumsi lokal di Yogyakarta, dari discovery sampai transaksi dan loyalitas.

### MVP Goal (90 hari)
Membuktikan bahwa kombinasi **QR katalog + pembayaran + stamp gamification + rekomendasi sederhana** dapat:
- Meningkatkan conversion rate scan → transaksi.
- Mendorong repeat usage pengguna.
- Mendorong kunjungan lintas merchant partner.

### Non-goal MVP
- Super-app dengan fitur sosial kompleks.
- Integrasi multi-kota.
- Loyalty points bernilai uang lintas merchant yang kompleks.
- AI recommendation engine yang canggih.

---

## 4) Persona Utama

### 4.1 Turis domestik/internasional (Primary)
- Kebutuhan: cepat paham menu/produk, mudah bayar, dapat rekomendasi tempat terdekat.
- Pain point: info tersebar, bahasa, dan waktu terbatas.

### 4.2 Warga lokal aktif kuliner/lifestyle (Secondary)
- Kebutuhan: eksplorasi tempat baru, promo/reward ringan, proses order cepat.

### 4.3 Pemilik UMKM / staf merchant (Primary B2B)
- Kebutuhan: dashboard sederhana, update produk cepat, lihat transaksi/performa dasar.
- Pain point: tool digital terlalu rumit, biaya tinggi, proses setup panjang.

### 4.4 User Persona Detail (Penjual & Pembeli)

#### Persona Penjual 1 — Sari (Pemilik Warung Gudeg)
- **Profil**: 41 tahun, pemilik warung keluarga di area wisata, operasional harian dibantu 2 pegawai.
- **Tujuan**:
   - Menambah transaksi tanpa harus pakai sistem yang rumit.
   - Menampilkan cerita menu khas agar turis lebih tertarik membeli.
   - Melihat menu mana paling laku untuk keputusan stok.
- **Pain Points**:
   - Tidak punya banyak waktu untuk belajar aplikasi kompleks.
   - Kesulitan membuat katalog digital yang rapi.
   - Ingin pembayaran cashless tapi takut prosesnya ribet.
- **Perilaku Digital**:
   - Aktif menggunakan WhatsApp dan kamera HP.
   - Nyaman dengan form sederhana dan langkah singkat.
- **Kebutuhan Produk Kritis**:
   - Onboarding cepat (<10 menit), generate QR instan.
   - CRUD menu sederhana (nama, harga, foto, caption cerita).
   - Dashboard ringkas: scan, transaksi, item terlaris.
- **Definition of Success**:
   - Jumlah transaksi naik, terutama dari turis baru.
   - Bisa update menu sendiri tanpa bantuan teknis.

#### Persona Penjual 2 — Bima (Pengelola Toko Kerajinan)
- **Profil**: 29 tahun, mengelola toko batik & suvenir, fokus pada storytelling produk.
- **Tujuan**:
   - Menjelaskan filosofi produk dengan cara cepat saat toko ramai.
   - Meningkatkan conversion dari pengunjung yang hanya melihat-lihat.
- **Pain Points**:
   - Sulit menyampaikan cerita produk ke semua pengunjung secara konsisten.
   - Sulit melacak produk mana yang paling menarik untuk turis.
- **Kebutuhan Produk Kritis**:
   - Tiap produk punya foto + caption budaya.
   - QR per merchant yang stabil dan mudah dipasang di toko.
   - Data produk populer untuk bahan restock dan display.

#### Persona Pembeli 1 — Rina (Turis Domestik Short Trip)
- **Profil**: 26 tahun, pekerja remote, liburan 2D1N di Jogja, mobile-first.
- **Tujuan**:
   - Cepat menemukan makanan/produk lokal yang autentik.
   - Bayar praktis tanpa antre panjang.
   - Dapat rekomendasi tempat terdekat setelah transaksi.
- **Pain Points**:
   - Informasi menu/produk tersebar di banyak platform.
   - Bingung memilih tempat yang benar-benar lokal dan relevan.
- **Perilaku Digital**:
   - Sering scan QR di meja/etalase.
   - Lebih suka alur tanpa install aplikasi.
- **Kebutuhan Produk Kritis**:
   - Halaman merchant cepat dibuka, jelas, dan mudah checkout.
   - Pembayaran digital yang familiar (QRIS/e-wallet).
   - Reward ringan (stamp/badge) untuk eksplorasi.
- **Definition of Success**:
   - Dalam satu perjalanan bisa menemukan beberapa UMKM lokal dengan mudah.
   - Proses scan sampai bayar terasa cepat dan minim friksi.

#### Persona Pembeli 2 — Arif (Warga Lokal Explorer)
- **Profil**: 33 tahun, karyawan, hobi kulineran akhir pekan di Jogja.
- **Tujuan**:
   - Menemukan tempat baru yang masih lokal/otentik.
   - Mendapat manfaat nyata dari aktivitas jelajah (badge/promo partner).
- **Pain Points**:
   - Rekomendasi aplikasi umum sering terlalu mainstream.
   - Tidak ada insentif konsisten untuk eksplor merchant kecil.
- **Kebutuhan Produk Kritis**:
   - Rekomendasi berbasis lokasi + kategori yang relevan.
   - Passport progress yang jelas dan memotivasi.
   - Riwayat aktivitas sederhana untuk melanjutkan jelajah berikutnya.

---

## 5) Scope Fitur MVP

## 5.1 Fitur wajib (In-Scope)

### A. Untuk Pengguna (Turis/Warga)
1. **Scan QR merchant** untuk membuka halaman web merchant.
2. **Lihat katalog** (menu/produk/tiket sederhana) + harga + deskripsi.
3. **Story behind item**: 1 foto + caption budaya/konteks lokal per item.
4. **Checkout sederhana** dan pembayaran digital (QRIS/e-wallet via payment gateway).
5. **Digital stamp otomatis** setelah transaksi sukses (1 transaksi valid = 1 stamp per merchant per hari).
6. **Passport view** untuk melihat jumlah stamp, badge unlocked.
7. **Rekomendasi terdekat sederhana** berbasis kategori + jarak + partner aktif.

### B. Untuk UMKM
1. **Merchant onboarding sederhana** (profil usaha + kategori).
2. **Kelola katalog**: tambah/edit/hapus item (nama, harga, foto, caption cerita).
3. **Generate QR code** unik merchant.
4. **Dashboard analytics basic**:
   - jumlah scan,
   - jumlah transaksi,
   - item populer,
   - stamp yang terkumpul dari merchant tersebut.

### C. Platform/Admin
1. **Manajemen merchant partner** (aktif/nonaktif).
2. **Rule engine sederhana** untuk stamp & badge.
3. **Pelacakan event dasar** untuk validasi metrik MVP.

## 5.2 Fitur ditunda (Out-of-Scope/Post-MVP)
1. Leaderboard publik real-time lintas semua user.
2. Program reward kompleks berbasis poin finansial.
3. Multi-language penuh + terjemahan otomatis konten.
4. Route optimization/itinerary builder.
5. Review/rating dan UGC penuh.
6. Integrasi POS mendalam per merchant.
7. Dynamic pricing dan campaign automation kompleks.

---

## 6) Core Concept Translation (dari brainstorming)

### 6.1 Multi-business type
MVP mendukung minimal 4 kategori merchant:
- Kafe/warung,
- Rumah makan/street food,
- Toko kerajinan,
- Tiket attraction skala kecil.

### 6.2 Cultural storytelling via QR
Setiap item katalog memiliki konten storytelling ringkas:
- 1 foto,
- 1 caption,
- optional tag budaya (contoh: kuliner tradisional, batik, kopi lokal).

### 6.3 Tourism passport gamification
- Stamp diberikan otomatis setelah transaksi berhasil.
- Badge awal MVP:
  - **Local Food Hunter**: 3 stamp kategori kuliner,
  - **Cultural Explorer**: 3 stamp kategori kerajinan/atraksi,
  - **Jogja Trail Starter**: 5 stamp total lintas kategori.

### 6.4 Smart recommendation (rule-based)
Rekomendasi tampil setelah transaksi/scan dengan aturan sederhana:
- merchant aktif,
- radius terdekat,
- kategori relevan dari aktivitas terakhir user.

---

## 7) System Rules / Process Logic

1. **IF** pengguna scan QR merchant **THEN** sistem menampilkan halaman merchant yang sesuai.
2. **IF** merchant nonaktif **THEN** sistem menampilkan status “merchant tidak tersedia”.
3. **IF** transaksi sukses dari payment gateway **THEN** sistem mencatat order sebagai paid dan menambahkan 1 stamp valid.
4. **IF** pengguna sudah mendapat stamp dari merchant yang sama di hari yang sama **THEN** stamp tambahan tidak diberikan.
5. **IF** jumlah stamp memenuhi aturan badge **THEN** badge otomatis di-unlock.
6. **IF** pembayaran gagal/expired **THEN** order tetap unpaid dan stamp tidak diberikan.
7. **IF** item tidak aktif/stok habis saat checkout **THEN** sistem mencegah checkout item tersebut.
8. **IF** geolokasi user tersedia **THEN** rekomendasi diurutkan berdasarkan kedekatan + relevansi kategori.
9. **IF** geolokasi user tidak tersedia **THEN** rekomendasi fallback ke partner populer di area default (mis. Malioboro).
10. **IF** konten storytelling kosong **THEN** sistem tetap menampilkan item dengan template deskripsi standar.

---

## 8) Basic User Flow (MVP)

### 8.1 User (Turis/Warga)
1. User scan QR di merchant.
2. Sistem buka halaman merchant (katalog + story).
3. User pilih item lalu checkout.
4. User bayar via metode digital yang tersedia.
5. Setelah sukses: receipt tampil + stamp bertambah.
6. User melihat badge/progress passport.
7. User menerima rekomendasi merchant terdekat/relevan.

### 8.2 Merchant (UMKM)
1. Merchant daftar/login dashboard.
2. Merchant lengkapi profil & kategori usaha.
3. Merchant input katalog + foto + caption story.
4. Merchant generate/unduh QR.
5. Merchant memantau scan/transaksi di dashboard.

---

## 9) Functional Requirements (MVP)

## 9.1 Aplikasi Pengguna
- FR-01: Sistem harus membaca QR dan route ke merchant page yang benar.
- FR-02: Sistem harus menampilkan katalog berdasarkan merchant & status item.
- FR-03: Sistem harus mendukung checkout single-merchant.
- FR-04: Sistem harus menerima callback status pembayaran dari gateway.
- FR-05: Sistem harus menerbitkan stamp otomatis untuk transaksi sukses sesuai rule.
- FR-06: Sistem harus menampilkan passport progress dan badge.
- FR-07: Sistem harus menampilkan rekomendasi merchant minimal 3 item.

## 9.2 Aplikasi Merchant
- FR-08: Merchant dapat CRUD item katalog.
- FR-09: Merchant dapat mengunggah foto item dan caption storytelling.
- FR-10: Merchant dapat menghasilkan QR merchant unik.
- FR-11: Merchant dapat melihat metrik dasar harian/mingguan.

## 9.3 Admin/Platform
- FR-12: Admin dapat mengaktifkan/menonaktifkan merchant.
- FR-13: Admin dapat mengubah aturan badge/stamp sederhana.
- FR-14: Sistem menyimpan log event inti (scan, checkout, paid, stamp granted).

---

## 10) Non-Functional Requirements

1. **Performance**: merchant page terbuka < 3 detik pada koneksi mobile normal.
2. **Availability**: target uptime MVP 99.0%.
3. **Security**:
   - transaksi hanya dianggap valid dari callback payment terverifikasi,
   - data pribadi minimum dan sesuai prinsip least data.
4. **Scalability (MVP)**: mampu menangani 200 merchant aktif & 10.000 MAU awal.
5. **Usability**:
   - alur scan-ke-checkout maksimal 4 langkah inti,
   - dashboard merchant mudah dipakai non-teknis.
6. **Compliance awal**:
   - kebijakan privasi,
   - persetujuan penggunaan lokasi (opsional),
   - kepatuhan proses pembayaran melalui provider berlisensi.

---

## 11) Data Model Konseptual (Ringkas)

- **User**: id, nama opsional, kontak, role, preferensi bahasa.
- **Merchant**: id, nama, kategori, lokasi, status, qr_token.
- **CatalogItem**: id, merchant_id, nama, harga, foto_url, story_caption, status.
- **Order**: id, user_id, merchant_id, total, payment_status, paid_at.
- **Stamp**: id, user_id, merchant_id, order_id, awarded_at.
- **Badge**: id, code, rule.
- **UserBadge**: user_id, badge_id, unlocked_at.
- **EventLog**: actor, event_type, ref_id, metadata, timestamp.

---

## 12) Integrasi & Arsitektur Teknis (MVP)

### Rekomendasi pendekatan vibe-coding (praktis, cepat iterasi)
- **Frontend**: Web app responsif (mobile-first).
- **Backend**: API sederhana + webhook handler payment.
- **Database**: relational DB (PostgreSQL/MySQL).
- **Payment**: Midtrans atau Xendit (pilih satu dulu untuk MVP).
- **Maps/Location**: API maps ringan untuk hitung jarak & pin lokasi.

### Prinsip implementasi
- Mulai dari monolith modular agar cepat validasi.
- Prioritaskan telemetry dan event tracking sejak awal.
- Desain skema data siap di-upgrade ke loyalty/reward pasca-MVP.

---

## 13) Success Metrics & KPI MVP

### North-star proxy (MVP)
- **Scan-to-Paid Conversion Rate**.

### KPI utama
1. Aktivasi merchant:
   - ≥ 50 merchant onboard dalam fase pilot.
2. Aktivasi pengguna:
   - ≥ 30% user scanner melakukan minimal 1 transaksi.
3. Retensi awal:
   - ≥ 20% user kembali scan/transaksi dalam 30 hari.
4. Engagement gamification:
   - ≥ 25% user bertransaksi memiliki minimal 2 stamp.
5. Cross-merchant discovery:
   - ≥ 15% transaksi berasal dari rekomendasi.

### Guardrail metric
- Payment failure rate < 5%.
- Duplicate/fraud stamp rate < 1%.

---

## 14) Eksperimen Validasi Konsep (90 Hari)

### Fase 1 (Minggu 1-4): Setup Pilot
- Rekrut 20 merchant awal di area padat wisata.
- Uji alur scan → bayar → stamp end-to-end.

### Fase 2 (Minggu 5-8): Optimasi Konversi
- A/B sederhana untuk copy CTA dan posisi story.
- Tuning rule rekomendasi berbasis radius/kategori.

### Fase 3 (Minggu 9-12): Evaluasi PMF awal
- Tambah merchant hingga target 50.
- Ukur retensi, cross-merchant, dan dampak storytelling.

---

## 15) Risiko & Mitigasi

1. **Adopsi UMKM rendah**
   - Mitigasi: onboarding assisted, template katalog, pelatihan singkat.
2. **User enggan login/register**
   - Mitigasi: guest flow untuk scan & browse, login saat checkout/reward.
3. **Konten storytelling minim kualitas**
   - Mitigasi: template narasi + contoh konten lokal.
4. **Kendala jaringan di lokasi tertentu**
   - Mitigasi: optimasi aset ringan, caching halaman merchant.
5. **Fraud stamp**
   - Mitigasi: validasi berbasis order paid + limit per merchant per hari.

---

## 16) Asumsi Kunci & Technical Constraints

### Asumsi
- Merchant bersedia memasang QR fisik di lokasi.
- Payment gateway mampu melayani metode pembayaran mayoritas pengguna target.
- Pengguna bersedia berbagi lokasi secara opsional untuk rekomendasi lebih relevan.

### Constraint
- Tim kecil (vibe-coding): fokus ke fitur inti, bukan custom enterprise.
- Anggaran terbatas: gunakan layanan pihak ketiga untuk payment/maps.
- MVP harus dapat berjalan di browser mobile tanpa install aplikasi native.

---

## 17) Optional Feature Exploration (Pasca-MVP Prioritized)

### 17.1 Fitur potensial bernilai tinggi
1. **Leaderboard wisatawan support UMKM** (regional/tematik).
2. **Digital postcard collectible** berbasis milestone perjalanan.
3. **Promo campaign partner** (happy hour, bundle lintas merchant).
4. **Mini itinerary** “1 hari jelajah Jogja” otomatis dari riwayat scan.

### 17.2 Certain rules (penguatan rule engine)
1. Rule anti-abuse berbasis device fingerprint + velocity check.
2. Rule reward musiman (event budaya, libur panjang).
3. Rule rekomendasi waktu nyata (jam makan, jam ramai, cuaca).

### 17.3 Monetization opportunities
1. **Subscription merchant (SaaS ringan)**:
   - Free tier: katalog + QR basic,
   - Pro tier: analytics lebih detail + campaign tools.
2. **Transaction fee** kecil per pembayaran sukses (opsional, hati-hati sensitivitas UMKM).
3. **Sponsored placement** di rekomendasi (dengan label jelas).
4. **B2B tourism package**: bundling pass untuk hotel/travel partner.

---

## 18) MVP Delivery Plan (High-Level)

### Sprint 1
- Merchant onboarding, katalog, QR generation.

### Sprint 2
- User scan flow, checkout, payment callback.

### Sprint 3
- Stamp, badge, passport page.

### Sprint 4
- Recommendation engine sederhana, analytics basic, hardening.

---

## 19) Open Questions untuk Discovery Lanjutan

1. Apakah MVP fokus area geografis awal: Malioboro saja atau multi-area?
2. Metode pembayaran prioritas awal: QRIS saja atau + e-wallet tertentu?
3. Apakah login wajib dari awal, atau guest-first?
4. Reward partner awal berbentuk apa yang paling feasible (diskon, voucher, konten digital)?
5. Bagaimana mekanisme moderasi konten storytelling merchant?

---

## 20) Lampiran: Definisi MVP “Done”

MVP dianggap sukses dan siap lanjut ke fase growth jika:
1. Semua fitur in-scope berjalan stabil di pilot.
2. KPI minimum tercapai selama 4 minggu berturut-turut.
3. Ada bukti user dan merchant ingin terus menggunakan produk.
4. Ada keputusan jelas fitur mana yang dinaikkan ke fase berikutnya.

---

## Catatan Penamaan
Dokumen ini menggunakan nama produk **JogPass** (alias **JogjaPass**) sesuai input. Final branding dapat dikunci di tahap desain identitas merek.
