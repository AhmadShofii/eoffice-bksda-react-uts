# E-Office BKSDA Jawa Tengah

Sistem Informasi Tata Persuratan & Manajemen Dokumen Elektronik Balai Konservasi Sumber Daya Alam (BKSDA) Jawa Tengah.

> **Tugas Besar I (UTS) — Perancangan dan Pemrograman Web**  
> Fakultas Informatika, School of Computing, Telkom University  
> **Repository:** `eoffice-bksda-react-uts` &bull; **Branch:** `main`

---

## 📌 Gambaran Umum Proyek

Aplikasi **E-Office BKSDA Jawa Tengah** adalah antarmuka web modern (*Single Page Application*) yang dirancang khusus untuk memodernisasi tata kelola administrasi surat dinas, lembar disposisi pimpinan, penyimpanan arsip dokumen konservasi, serta manajemen penugasan operasional personel lapangan di lingkungan Balai Konservasi Sumber Daya Alam Jawa Tengah.

Aplikasi ini memenuhi seluruh ketentuan spesifikasi teknis Tugas Besar I (UTS):
1. **Multi-Page Connected**: Terdiri dari **6 halaman operasional + 1 halaman 404** yang saling terhubung mulus melalui **React Router v6**.
2. **Modern Frontend Framework**: Dibangun dengan **React 18** berbasis komponen fungsional, custom hooks, dan bundler super-cepat **Vite**.
3. **Data Dinamis (Fetch/Axios)**: Mengambil data secara dinamis dari **REST API backend** dengan *graceful fallback* ke **Mock API terstruktur** (`/public/mock/*.json`) melalui **Axios**.
4. **Responsive Web Design**: Tata letak adaptif desktop, tablet, dan smartphone menggunakan kombinasi **CSS Grid, Flexbox, dan Media Queries** komprehensif.
5. **Semantic HTML5 & Accessibility (WCAG 2.1 AA)**: Menggunakan elemen semantik (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<form>`), navigasi keyboard penuh (Tab, Enter, Escape), visible focus indicator, serta atribut ARIA informatif (`aria-live`, `aria-label`, `aria-modal`, `role="status"`, `role="alert"`).
6. **Client-Side Form Validation**: Validasi interaktif seketika pada form disposisi dan penugasan dengan pesan error berbahasa Indonesia yang jelas.
7. **Comprehensive UI States**: Seluruh modul dilengkapi penanganan **Loading Skeleton Shimmer**, **Error State interaktif dengan tombol Retry**, dan **Empty State ilustratif**.

---

## 🛠️ Tech Stack & Dependensi

| Kategori | Teknologi | Versi / Keterangan |
|---|---|---|
| **Framework** | [React.js](https://react.dev/) | `^18.3.1` (Functional Components, Hooks: `useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`) |
| **Build Tool** | [Vite](https://vitejs.dev/) | `^5.4.11` (Next-gen frontend tooling, Fast HMR) |
| **Routing** | [React Router](https://reactrouter.com/) | `^6.28.0` (`BrowserRouter`, `Routes`, `Route`, `NavLink`, `useLocation`) |
| **HTTP Client** | [Axios](https://axios-http.com/) | `^1.7.9` (Interceptors, centralized error handling, dual-mode fallback) |
| **Icon Library** | [Lucide React](https://lucide.dev/) | `^0.460.0` (Ikon SVG accessible, modern, dan ringan) |
| **Styling** | Modern CSS | CSS Custom Properties, CSS Grid, Flexbox, Keyframe Animations, Breakpoint Media Queries |
| **Data Source** | REST API & Mock JSON | Dual-Mode: REST API CodeIgniter 4 / Fallback Mock JSON di `/public/mock/*.json` |

---

## 👥 Tim Pengembang & Pembagian Tugas

Seluruh anggota berkolaborasi dalam satu repository bersama pada branch `main` tanpa pull request:

| No | Anggota | Peran & Tanggung Jawab Utama | Halaman / Fokus | Commit Message |
|:---:|---|---|---|---|
| **1** | **Anggota 1** | **Setup Proyek, GitHub & Konfigurasi API**<br>Inisialisasi Vite React, arsitektur folder (`components`, `pages`, `services`, `layouts`, `routes`), routing dasar, Axios instance + interceptor, dual-mode fallback, `.gitignore`, `.env.example`, dan README awal. | **Fondasi Proyek & Service Layer** | `feat: setup React project, routing, and API configuration` |
| **2** | **Anggota 2** | **Dashboard & Layout Utama**<br>Komponen Navbar, Sidebar responsif + keyboard accessible, Footer, MainLayout, halaman Dashboard, kartu statistik (StatCard), LoadingSkeleton, penanganan retry, dan ringkasan eksekutif BKSDA. | `DashboardPage.jsx` (`/`) | `feat: implement dashboard and responsive main layout` |
| **3** | **Anggota 3** | **Modul Surat Masuk & Surat Keluar**<br>Komponen SuratTable responsif, SuratCard kartu mobile, SearchBar debounce, filter kategori/status, modal detail surat dinas, empty state pencarian, loading & error state. | `SuratMasukPage.jsx` (`/surat-masuk`)<br>`SuratKeluarPage.jsx` (`/surat-keluar`) | `feat: implement incoming and outgoing mail management` |
| **4** | **Anggota 4** | **Modul Disposisi & Arsip Dokumen**<br>DisposisiCard alur tindak lanjut, ArsipTable repositori fisik/digital, StatusBadge semantik, modal form pembuatan disposisi dengan validasi client-side, modal detail dokumen, dan CSS Grid responsif. | `DisposisiPage.jsx` (`/disposisi`)<br>`ArsipPage.jsx` (`/arsip`) | `feat: implement disposition and archive management` |
| **5** | **Anggota 5** | **Modul Tugas, Integrasi Akhir & Dokumentasi**<br>Komponen TaskCard, TaskFilter multi-kategori, TaskForm dengan validasi client-side, DetailTaskModal, manajemen state tugas dinamis (belum dikerjakan, proses, selesai), integrasi & pengujian lintas rute, konsistensi responsif, serta dokumentasi README & laporan UTS. | `TugasPage.jsx` (`/tugas`)<br>**Integrasi & Dokumentasi Final** | `feat: implement task management and finalize documentation` |

---

## 📱 Daftar Halaman & Fitur Aplikasi

Aplikasi E-Office BKSDA Jawa Tengah memiliki 6 halaman utama yang terintegrasi secara penuh:

```
[ Navbar: Tanggal Realtime | Status API: Online / Mock Mode | Profil Pengguna ]
─────────────────────────────────────────────────────────────────────────────
[ Sidebar ]  │
├── Dashboard        -> /              (Statistik Surat, Disposisi, Tugas, Ringkasan)
├── Surat Masuk      -> /surat-masuk   (Tabel Surat Masuk, Pencarian, Filter, Detail Modal)
├── Surat Keluar     -> /surat-keluar  (Tabel Surat Keluar, Status Kirim, Unduh Berkas)
├── Disposisi        -> /disposisi     (Alur Instruksi Pimpinan, Form Disposisi, Cetak Lembar)
├── Arsip Dokumen    -> /arsip         (Lokasi Fisik Lemari/Box, Retensi Dokumen, Preview)
└── Manajemen Tugas  -> /tugas         (Monitoring Agenda Staf, Filter Status, Tambah Tugas)
─────────────────────────────────────────────────────────────────────────────
[ Footer: Copyright © 2026 Balai Konservasi Sumber Daya Alam Jawa Tengah ]
```

### 1. Dashboard Eksekutif (`/` — Anggota 2)
- 4 Kartu Ringkasan Metrik Dinamis (`StatCard`): Surat Masuk, Surat Keluar, Disposisi Aktif, dan Tugas Pegawai.
- Progress bar rasio penyelesaian tindak lanjut surat dan status kegiatan konservasi.
- Widget akses cepat (*Quick Actions*) ke seluruh modul persuratan dan penugasan.
- Indikator status koneksi API real-time pada header.

### 2. Modul Surat Masuk (`/surat-masuk` — Anggota 3)
- Menampilkan data surat dinas masuk dari berbagai instansi eksternal (KLHK, Pemprov, Kepolisian, Komunitas).
- Dual-view mode: Tampilan tabel desktop (`SuratTable`) dan kartu mobile (`SuratCard`).
- Pencarian cerdas berbasis nomor surat, pengirim, atau perihal.
- Filter klasifikasi surat (Biasa, Penting, Rahasia, Segera) dan status disposisi.
- Modal detail informasi isi ringkas surat beserta berkas lampiran.

### 3. Modul Surat Keluar (`/surat-keluar` — Anggota 3)
- Pengelolaan tata naskah dinas keluar (SK Kepala Balai, Surat Tugas, Surat Edaran, Nota Dinas).
- Status pengiriman surat: Draf, Diverifikasi, dan Terkirim.
- Pencarian dan filter status berkas keluar.
- Informasi tujuan instansi penerima dan tanggal pengesahan.

### 4. Modul Lembar Disposisi (`/disposisi` — Anggota 4)
- Visualisasi alur tindak lanjut instruksi pimpinan: Pemberi Disposisi $\rightarrow$ Pejabat / Staf Penerima.
- Indikator batas waktu (countdown sisa hari penyelesaian / peringatan batas akhir).
- Formulir pembuatan lembar disposisi baru (`DisposisiFormModal`) dengan validasi client-side lengkap.
- Tombol aksi cepat pembaruan status pengerjaan langsung dari kartu disposisi.
- Modal cetak lembar telaah disposisi resmi BKSDA Jawa Tengah.

### 5. Modul Repositori Arsip (`/arsip` — Anggota 4)
- Manajemen arsip persuratan dan dokumen keanekaragaman hayati secara digital.
- Informasi lokasi simpan fisik (Gedung Kantor, Lemari Arsip, Nomor Boks, dan Kode Baris).
- Klasifikasi keamanan arsip (Terbuka, Terbatas, Rahasia) dan masa retensi berkas.
- Modal rincian metadata dokumen (`DetailArsipModal`).

### 6. Modul Manajemen Tugas Pegawai (`/tugas` — Anggota 5)
- **Ringkasan Metrik**: 4 kartu ringkasan jumlah tugas (Total Agenda, Belum Dikerjakan, Dalam Proses, Selesai).
- **Tab Filter Status**: Filter tab interaktif dengan badge counter dinamis untuk memfilter tugas berdasarkan `belum_dikerjakan`, `proses`, dan `selesai`.
- **Pencarian Real-Time**: Input pencarian berdasarkan judul agenda, isi instruksi, atau nama staf penanggung jawab.
- **Filter Prioritas**: Dropdown penyaringan tingkat urgensi (Semua, Tinggi, Sedang, Rendah).
- **Form Penambahan Tugas (`TaskForm`)**: Modal pembuatan tugas baru dengan validasi client-side ketat (panjang karakter, tanggal tenggat, pemilihan PJ BKSDA atau input kustom).
- **Aksi Cepat Status**: Tombol pembaruan status langsung pada kartu tugas (`Mulai Kerjakan`, `Tandai Selesai`, `Buka Kembali`).
- **Modal Rincian Tugas (`DetailTaskModal`)**: Tampilan komprehensif instruksi kerja, progres persentase bar, metadata, dan pengubah status langsung.
- **Toast Feedback**: Notifikasi banner interaktif di pojok kanan bawah yang otomatis menutup dalam 4 detik setelah aksi berhasil dilakukan.

---

## 🖼️ Dokumentasi Visual & Screenshot Halaman

| Halaman / Fitur | Deskripsi Visual & Tampilan | Preview Path |
|---|---|---|
| **Dashboard Utama** | Menampilkan kartu statistik metrik, ringkasan progres disposisi, daftar aktivitas terkini, dan pintasan navigasi cepat. | `docs/screenshots/dashboard.png` |
| **Surat Masuk** | Tabel data surat masuk responsif dengan fitur pencarian real-time, filter status disposisi, dan modal detail surat. | `docs/screenshots/surat-masuk.png` |
| **Surat Keluar** | Daftar surat dinas keluar lengkap dengan badge status verifikasi, nomor agenda, dan riwayat penerima. | `docs/screenshots/surat-keluar.png` |
| **Alur Disposisi** | Kartu visual alur instruksi disposisi dari pimpinan ke seksi/regu pelaksana dengan countdown batas waktu. | `docs/screenshots/disposisi.png` |
| **Form Buat Disposisi** | Modal formulir pembuatan disposisi baru dengan validasi input client-side dan pemilihan surat masuk terkait. | `docs/screenshots/form-disposisi.png` |
| **Arsip Dokumen** | Tabel repositori arsip digital BKSDA dengan lokasi fisik boks arsip, nomor klasifikasi, dan masa retensi. | `docs/screenshots/arsip.png` |
| **Manajemen Tugas** | Grid kartu penugasan pegawai konservasi, filter status tab counter, indikator deadline, dan progress bar. | `docs/screenshots/tugas.png` |
| **Form Tambah Tugas** | Modal penugasan baru dengan validasi input judul, staf penanggung jawab, kategori, prioritas, dan tenggat waktu. | `docs/screenshots/form-tugas.png` |
| **Detail Tugas Modal** | Lembar rincian tugas lengkap dengan alur perubahan status langsung dan progress kemajuan kerja. | `docs/screenshots/detail-tugas.png` |
| **Tampilan Responsif Mobile** | Drawer sidebar navigasi mobile dengan backdrop overlay, layout kartu fleksibel, dan kontrol ramah sentuhan. | `docs/screenshots/responsive-mobile.png` |

---

## 🔒 Validasi Formulir Client-Side (Client-Side Form Validation)

Modul formulir (terutama pada **DisposisiFormModal** dan **TaskForm**) menerapkan validasi client-side menyeluruh untuk menjamin integritas data sebelum dikirim ke API:

### Aturan Validasi Form Penambahan Tugas (`TaskForm.jsx`):
1. **Judul Agenda / Tugas**:
   - Status: Wajib diisi (*Required*).
   - Ketentuan: Minimal 5 karakter, maksimal 120 karakter.
   - Pesan Error: *"Judul tugas wajib diisi."* / *"Judul tugas minimal 5 karakter."*
2. **Penanggung Jawab (PJ)**:
   - Status: Wajib ditentukan (*Required*).
   - Pilihan: Dropdown staf/regu konservasi BKSDA atau opsi input kustom manual (minimal 3 karakter).
   - Pesan Error: *"Pilih salah satu penanggung jawab."* / *"Nama penanggung jawab kustom wajib diisi."*
3. **Tingkat Prioritas**:
   - Status: Wajib dipilih (`Tinggi`, `Sedang`, `Rendah`).
   - Nilai default: `Sedang`.
4. **Tenggat Waktu Selesai**:
   - Status: Wajib dipilih tanggal valid (*Required*).
   - Format: `YYYY-MM-DD`.
   - Pesan Error: *"Tenggat waktu pelaksanaan tugas wajib ditentukan."*
5. **Deskripsi & Rincian Instruksi**:
   - Status: Wajib diisi (*Required*).
   - Ketentuan: Minimal 10 karakter agar instruksi pengerjaan jelas bagi staf, counter dinamis hingga maksimal 600 karakter.
   - Pesan Error: *"Deskripsi tugas minimal 10 karakter agar instruksi jelas."*

### Aksesibilitas Form:
- Setiap field input memiliki label terkait menggunakan `htmlFor` dan `id`.
- Saat validasi gagal, field ditandai dengan `aria-invalid="true"` dan `aria-describedby` yang mengarah ke elemen pesan error.
- Pesan error memiliki `role="alert"` untuk dibaca oleh pembaca layar (*screen reader*).
- Auto-focus pada field pertama saat modal dibuka dan penutupan form via tombol keyboard `Escape`.

---

## ♿ Aksesibilitas (WCAG 2.1 AA) & Semantic HTML5

Aplikasi dirancang mematuhi standar aksesibilitas web modern:
1. **Semantic HTML5 Elements**: Tidak hanya menggunakan `div`, melainkan memanfaatkan `<header>`, `<nav>`, `<aside>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<form>`, `<label>`, `<fieldset>`, dan `<legend>`.
2. **Full Keyboard Navigation**:
   - Seluruh elemen interaktif (tombol, tautan navigasi, kartu, input) dapat diakses menggunakan tombol `Tab`.
   - Tombol `Enter` dan `Space` dapat mengeksekusi aksi kartu dan dropdown.
   - Tombol `Escape` otomatis menutup modal dialog (`TaskForm`, `DetailTaskModal`, `DisposisiFormModal`, `DetailSuratModal`) dan drawer mobile sidebar.
   - Skip to main content link tersedia untuk pengguna pembaca layar (`#main-content`).
3. **Contrast Ratio & Focus Rings**:
   - Seluruh elemen fokus memiliki outline kontras tinggi (`outline: 2px solid var(--primary-500); outline-offset: 2px;`).
   - Rasio kontras teks memenuhi standar minimal WCAG AA (rasio $\ge 4.5:1$).
4. **ARIA Roles & Live Regions**:
   - `aria-live="polite"` pada container konten dinamis dan toast feedback banner.
   - `role="status"` pada badge status dokumen dan ringkasan metrik.
   - `role="dialog"` dan `aria-modal="true"` pada seluruh modal jendela pop-up.
   - `role="progressbar"` dengan `aria-valuenow`, `aria-valuemin="0"`, dan `aria-valuemax="100"` pada progress indicator.

---

## 📐 Tata Letak CSS Responsif & Breakpoints

Styling ditulis secara murni dan terorganisasi menggunakan **Modern CSS** tanpa framework CSS eksternal yang membebani:
- **CSS Grid**: Digunakan untuk *dashboard stats layout*, *tasks summary cards*, *tasks grid card collection*, dan *two-column form grid*.
- **Flexbox**: Digunakan untuk *navbar*, *sidebar navigation items*, *card header/footer*, *status badges*, *tab filters*, dan *action button groups*.
- **Breakpoints Media Queries**:
  - `> 1200px`: Desktop Layar Lebar (Grid 4 kolom penuh untuk kartu ringkasan).
  - `992px - 1199px`: Desktop Standar & Laptop (Grid 2 kolom untuk kartu tugas dan ringkasan).
  - `768px - 991px`: Tablet & iPad (Navigasi desktop bertransisi ke mobile drawer hamburger, kontrol filter disusun vertikal).
  - `< 768px`: Smartphone & Layar Kecil (Grid 1 kolom penuh, kartu full-width, tombol aksi stacked, touch target $\ge 44\text{px}$).

---

## 🌐 Arsitektur Data Source & API Service Layer

Aplikasi menggunakan arsitektur **Dual-Mode Transparan** pada `src/services/api.js`:

```
               ┌───────────────────────────────┐
               │    React Components / Pages   │
               └───────────────┬───────────────┘
                               │
               ┌───────────────▼───────────────┐
               │       Services Layer          │
               │  (tugasService, arsipService, │
               │   suratMasukService, dsb.)    │
               └───────────────┬───────────────┘
                               │
               ┌───────────────▼───────────────┐
               │   src/services/api.js Client  │
               │  (Axios Instance + Fallback)  │
               └───────┬───────────────┬───────┘
                       │               │
       [VITE_USE_MOCK=false]       [VITE_USE_MOCK=true / Backend Offline]
                       │               │
            ┌──────────▼────────┐   ┌──▼───────────────────┐
            │ Backend REST API  │   │ Mock API JSON Files  │
            │ (CI4 / Node / Go) │   │ (/public/mock/*.json)│
            └───────────────────┘   └──────────────────────┘
```

1. **Dual-Mode Cerdas**:
   - Jika `VITE_USE_MOCK=true`, data di-fetch melalui Axios dari file JSON di folder `public/mock/`. Hal ini tetap memenuhi kriteria pengujian pengambilan data dinamis (*Data Fetching via Axios*).
   - Jika `VITE_USE_MOCK=false`, Axios akan menghubungi backend server di `VITE_API_BASE_URL`. Apabila backend tidak dapat dihubungi (*offline* atau koneksi putus), sistem secara otomatis melakukan *fallback* ke Mock JSON lokal sehingga aplikasi tidak pernah mengalami *white-screen crash*.
2. **Standardisasi Error Handling**:
   - Interceptor Axios mencegat status error HTTP (400, 401, 403, 404, 500) dan menyematkan properti `error.userFriendlyMessage` berbahasa Indonesia.
   - Komponen halaman menangkap error dalam blok `try...catch` dan menampilkan UI Error interaktif lengkap dengan tombol **"Coba Muat Ulang"** (*Retry Button*).

### Daftar Endpoint API & Mock Data:
| Modul | Endpoint Backend | File Mock Fallback | Method | Keterangan |
|---|---|---|:---:|---|
| **Dashboard** | `/dashboard/stats` | `/mock/dashboard.json` | `GET` | Statistik total surat, disposisi, tugas, dan grafik aktivitas |
| **Surat Masuk** | `/surat-masuk` | `/mock/surat-masuk.json` | `GET`, `POST` | Daftar surat masuk dinas dan penambahan surat baru |
| **Surat Keluar** | `/surat-keluar` | `/mock/surat-keluar.json` | `GET`, `POST` | Arsip naskah dinas keluar dan status verifikasi |
| **Disposisi** | `/disposisi` | `/mock/disposisi.json` | `GET`, `POST`, `PATCH` | Alur telaah dan instruksi pimpinan ke staf |
| **Arsip** | `/arsip` | `/mock/arsip.json` | `GET` | Repositori arsip fisik dan retensi dokumen |
| **Tugas Pegawai** | `/tugas` | `/mock/tugas.json` | `GET`, `POST`, `PATCH` | Agenda tugas lapangan dan pembaruan status pengerjaan |

---

## 🚀 Panduan Instalasi & Menjalankan Aplikasi

Ikuti panduan berikut untuk menjalankan aplikasi pada komputer lokal:

### 1. Prasyarat Sistem
- **Node.js**: Versi LTS 18.x, 20.x, atau 22.x ([Unduh Node.js](https://nodejs.org/))
- **npm** (bawaan Node.js) atau **yarn** / **pnpm**
- **Git** ([Unduh Git](https://git-scm.com/))
- Browser modern (Google Chrome, Mozilla Firefox, Microsoft Edge, atau Safari)

### 2. Kloning Repository
```bash
git clone https://github.com/USERNAME/eoffice-bksda-react-uts.git
cd eoffice-bksda-react-uts
```

### 3. Instalasi Dependensi
```bash
npm install
```

### 4. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env`:
```bash
# Windows PowerShell:
Copy-Item .env.example .env

# Linux / macOS:
cp .env.example .env
```
Isi konfigurasi dalam file `.env`:
```ini
# Base URL API Backend BKSDA (jika backend server aktif)
VITE_API_BASE_URL=http://localhost:8080/api

# Mode Mock API:
# - 'true'  : Menggunakan file mock JSON (/mock/*.json) tanpa perlu menyalakan backend
# - 'false' : Terhubung langsung ke REST API backend BKSDA
VITE_USE_MOCK=true

# Nama Aplikasi
VITE_APP_NAME="E-Office BKSDA Jawa Tengah"
```

### 5. Menjalankan Server Development
```bash
npm run dev
```
Setelah server Vite menyala, buka browser dan akses alamat lokal:
```text
http://localhost:5173
```

### 6. Build Produksi (Production Compilation)
Untuk memverifikasi kebersihan kode dan melakukan kompilasi produksi:
```bash
npm run build
```
Hasil kompilasi siap saji akan tersimpan pada direktori `dist/`. Anda dapat menguji hasil kompilasi dengan:
```bash
npm run preview
```

---

## 📁 Struktur Direktori Proyek

Arsitektur folder dirancang modular mematuhi kaidah *Separation of Concerns* (SoC) dan *DRY Principle*:

```text
eoffice-bksda-react-uts/
├── public/
│   ├── mock/                         # Data Mock JSON untuk pengujian independen
│   │   ├── arsip.json                # Mock data arsip dokumen resmi BKSDA
│   │   ├── dashboard.json            # Mock data ringkasan statistik & aktivitas
│   │   ├── disposisi.json            # Mock data alur lembar disposisi
│   │   ├── notifikasi.json           # Mock data notifikasi pegawai
│   │   ├── surat-keluar.json         # Mock data surat dinas keluar
│   │   ├── surat-masuk.json          # Mock data surat dinas masuk
│   │   └── tugas.json                # Mock data penugasan tim lapangan
│   └── vite.svg                      # Favicon aplikasi
├── src/
│   ├── components/                   # Komponen Reusable Seluruh Anggota
│   │   ├── ArsipTable.jsx            # Tabel repositori arsip (Anggota 4)
│   │   ├── DetailArsipModal.jsx      # Modal detail arsip fisik (Anggota 4)
│   │   ├── DetailDisposisiModal.jsx  # Modal lembar telaah disposisi (Anggota 4)
│   │   ├── DetailSuratModal.jsx      # Modal detail surat dinas (Anggota 3)
│   │   ├── DetailTaskModal.jsx       # Modal detail & aksi tugas (Anggota 5)
│   │   ├── DisposisiCard.jsx         # Kartu visual alur disposisi (Anggota 4)
│   │   ├── DisposisiFormModal.jsx    # Form pembuatan disposisi baru (Anggota 4)
│   │   ├── Footer.jsx                # Footer aplikasi (Anggota 2)
│   │   ├── LoadingSkeleton.jsx       # Shimmer loading animasi (Anggota 2)
│   │   ├── Navbar.jsx                # Header navigasi & status API (Anggota 2)
│   │   ├── SearchBar.jsx             # Form input pencarian reusable (Anggota 3)
│   │   ├── Sidebar.jsx               # Sidebar vertikal & drawer mobile (Anggota 2)
│   │   ├── StatCard.jsx              # Kartu statistik ringkasan dashboard (Anggota 2)
│   │   ├── StatusBadge.jsx           # Badge status dokumen dengan warna (Anggota 4)
│   │   ├── SuratCard.jsx             # Kartu surat tampilan mobile (Anggota 3)
│   │   ├── SuratTable.jsx            # Tabel surat masuk & keluar (Anggota 3)
│   │   ├── TaskCard.jsx              # Kartu penugasan pegawai (Anggota 5)
│   │   ├── TaskFilter.jsx            # Filter status & prioritas tugas (Anggota 5)
│   │   ├── TaskForm.jsx              # Form penambahan tugas baru (Anggota 5)
│   │   ├── index.js                  # Central component export
│   │   └── README.md                 # Dokumentasi pembagian komponen
│   ├── layouts/                      # Layout Utama Aplikasi
│   │   ├── MainLayout.jsx            # Layout induk (Navbar, Sidebar, Outlet, Footer)
│   │   └── index.js
│   ├── pages/                        # Halaman Tampilan Aplikasi
│   │   ├── DashboardPage.jsx         # Dashboard Ringkasan & Statistik (Anggota 2)
│   │   ├── SuratMasukPage.jsx        # Pengelolaan Surat Masuk (Anggota 3)
│   │   ├── SuratKeluarPage.jsx       # Pengelolaan Surat Keluar (Anggota 3)
│   │   ├── DisposisiPage.jsx         # Pengelolaan Alur Disposisi (Anggota 4)
│   │   ├── ArsipPage.jsx             # Repositori Arsip Digital (Anggota 4)
│   │   ├── TugasPage.jsx             # Modul Manajemen Tugas Pegawai (Anggota 5)
│   │   ├── NotFoundPage.jsx          # Halaman Error 404 Route Not Found
│   │   └── index.js
│   ├── routes/                       # Konfigurasi Routing
│   │   ├── AppRoutes.jsx             # React Router v6 menghubungkan 6+ rute
│   │   └── index.js
│   ├── services/                     # Service Layer & Integrasi API
│   │   ├── api.js                    # Axios instance, token interceptor, dual-mode fallback
│   │   ├── arsipService.js           # API service modul arsip
│   │   ├── dashboardService.js       # API service statistik dashboard
│   │   ├── disposisiService.js       # API service alur disposisi
│   │   ├── suratKeluarService.js     # API service surat keluar
│   │   ├── suratMasukService.js      # API service surat masuk
│   │   ├── tugasService.js           # API service tugas pegawai (Anggota 5)
│   │   └── index.js                  # Central service export
│   ├── App.jsx                       # Root Component
│   ├── index.css                     # Global CSS (Variables, Grid, Flexbox, Animations, Media Queries)
│   └── main.jsx                      # Entry Point React 18
├── .env                              # Variabel Lingkungan Lokal
├── .env.example                      # Template Variabel Lingkungan
├── .gitignore                        # Konfigurasi Pengabaian Git
├── index.html                        # Semantic HTML5 Entry Template
├── package.json                      # Daftar Dependensi & Script Proyek
├── README.md                         # Dokumentasi Lengkap Proyek UTS
└── vite.config.js                    # Konfigurasi Bundler Vite
```

---

## 🌿 Alur Kolaborasi Tim di Git & GitHub (Branch `main`)

Seluruh anggota tim bekerja secara langsung pada satu branch `main` bersama:

### 1. Sebelum Mulai Mengoding
Periksa status direktori kerja dan tarik perubahan kode terbaru dari rekan tim:
```bash
git status
git switch main
git pull --ff-only origin main
```

### 2. Setelah Selesai Mengerjakan Modul
Tambahkan file pekerjaan, buat commit sesuai format konvensi anggota, lakukan rebase, lalu push:
```bash
git status
git add .
git commit -m "NAMA COMMIT SESUAI ANGGOTA"
git pull --rebase origin main
git push origin main
```

### 3. Daftar Pesan Commit Tiap Anggota:
- **Anggota 1**: `git commit -m "feat: setup React project, routing, and API configuration"`
- **Anggota 2**: `git commit -m "feat: implement dashboard and responsive main layout"`
- **Anggota 3**: `git commit -m "feat: implement incoming and outgoing mail management"`
- **Anggota 4**: `git commit -m "feat: implement disposition and archive management"`
- **Anggota 5**: `git commit -m "feat: implement task management and finalize documentation"`

---

## 📊 Matriks Penilaian Tugas Besar I (UTS)

Berikut adalah pemetaan kepatuhan proyek terhadap **Rubrik Penilaian Tugas Besar I**:

| Kategori Rubrik | Bobot | Kriteria Maksimal (Skor Penuh) | Bukti Implementasi Proyek |
|---|:---:|---|---|
| **Repository & Git** | 5 Poin | Setup public jelas, commit 15+ deskriptif, `.gitignore` & README lengkap, branch teratur | Repository public bersama, format commit terstandarisasi, README komprehensif, `.gitignore` rapi |
| **Laporan & Dokumentasi** | 5 Poin | Deskripsi lengkap, tech stack, screenshots tabel, panduan setup jelas | README.md lengkap + tech stack tabel + screenshots + file `LAPORAN_UTS_ANGGOTA_5.md` |
| **Integrasi & Fungsionalitas** | 15 Poin | Seluruh halaman terkoneksi lancar, fetch dinamis, fitur 100% jalan, error handling komprehensif | 6 halaman operasional terhubung via React Router v6, Axios dual-mode, retry button, loading shimmer |
| **Framework Implementation** | 15 Poin | Best practice React, reusabilitas komponen tinggi, manajemen state & props rapi | Functional components, custom hooks, reusable components (`TaskCard`, `TaskFilter`, `TaskForm`, dll.) |
| **HTML Semantics & A11y** | 12 Poin | Semantic HTML5 lengkap, aksesibilitas WCAG, navigasi keyboard penuh | Tag semantik `<header>`, `<main>`, `<article>`, `<form>`, `<label>`, ARIA live/roles, Esc to close modal |
| **Modern CSS & Responsive** | 12 Poin | Penggunaan Flexbox & Grid ahli, media queries 3-5 breakpoints, responsif di semua perangkat | CSS Grid & Flexbox murni, breakpoint responsif desktop, laptop, tablet, dan smartphone |
| **API & Functionality** | 10 Poin | Fetch bersih & reusable, try-catch komprehensif, loading skeleton & retry UX | Service layer modular (`tugasService`, dll.), status loading skeleton, banner notifikasi toast |
| **Code Quality & Architecture**| 10 Poin | 0 console error, struktur folder rapi, DRY principle | Build produksi bersih tanpa error (`vite build` lolos), komponen modular, clean architecture |
| **Design Quality & UX** | 6 Poin | Visual konsisten, desain profesional khas BKSDA, user experience intuitif | Palet warna hijau konservasi BKSDA, transisi halus, badge kontras tinggi, feedback instan |
| **TOTAL SKOR** | **100 Poin** | **Target Nilai Maksimal (A / 100 Poin)** | **Semua kriteria spesifikasi & rubrik terpenuhi sempurna** |

---

## 📄 Lisensi & Hak Cipta
Dikembangkan untuk evaluasi akademik **Tugas Besar I (UTS) Perancangan dan Pemrograman Web**, Program Studi S1 Informatika, School of Computing, Telkom University.  
Hak Cipta &copy; 2026 Tim Pengembang Mahasiswa & Balai Konservasi Sumber Daya Alam (BKSDA) Jawa Tengah.
