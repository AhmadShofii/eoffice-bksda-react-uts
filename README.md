# E-Office BKSDA Jawa Tengah

Sistem Informasi Tata Persuratan & Manajemen Dokumen Elektronik Balai Konservasi Sumber Daya Alam (BKSDA) Jawa Tengah.

> **Tugas Besar I (UTS) — Perancangan dan Pemrograman Web**  
> Fakultas Informatika, School of Computing, Telkom University

---

## 📌 Gambaran Umum Proyek

Aplikasi **E-Office BKSDA Jawa Tengah** adalah antarmuka web modern (*Single Page Application*) yang dibangun untuk mempermudah tata kelola administrasi surat masuk, surat keluar, disposisi pejabat, pengelolaan arsip digital, dan penugasan staf konservasi di lingkungan Balai Konservasi Sumber Daya Alam Jawa Tengah.

Aplikasi ini memenuhi ketentuan teknis:
- Dibangun menggunakan framework modern **React.js** dengan bundler **Vite**.
- Terdiri dari **6 halaman terhubung** menggunakan **React Router**.
- Mengkonsumsi data dinamis melalui **Axios** dengan arsitektur *dual-mode* (Koneksi Backend REST API BKSDA & Fallback Mock API terstruktur).
- Menerapkan desain antarmuka responsif (**CSS Grid, Flexbox, Media Queries**) dengan identitas visual BKSDA.
- Mengedepankan **Semantics HTML5** & dasar-dasar **Accessibility (WCAG)** seperti label yang jelas dan navigasi keyboard.

---

## 🛠️ Tech Stack & Dependensi

| Kategori | Teknologi | Deskripsi / Versi |
|---|---|---|
| **Framework** | [React.js](https://react.dev/) | React 18 (SPA berbasis komponen fungsional dan Hooks) |
| **Build Tool** | [Vite](https://vitejs.dev/) | Next-generation frontend tooling dengan Hot Module Replacement (HMR) cepat |
| **Routing** | [React Router](https://reactrouter.com/) | `react-router-dom` v6 untuk navigasi multi-halaman client-side |
| **HTTP Client** | [Axios](https://axios-http.com/) | Axios v1 dengan interseptor Bearer token dan standardisasi pesan error |
| **Icon Library** | [Lucide React](https://lucide.dev/) | Kumpulan ikon modern, ringan, dan accessible |
| **Styling** | Modern CSS | CSS Custom Properties (Variables), Flexbox, Grid, Responsive Media Queries |
| **Data Source** | REST API & Mock JSON | REST API CodeIgniter 4 / Fallback Mock API di `/public/mock/*.json` |

---

## 👥 Tim Pengembang & Pembagian Tugas

Seluruh anggota berkolaborasi dalam satu repository bersama pada branch `main`:

| No | Anggota | Peran & Tanggung Jawab | Halaman / Fokus |
|:---:|---|---|---|
| **1** | **Anggota 1** | **Setup Proyek, GitHub & Konfigurasi API**<br>Inisialisasi Vite React, struktur folder, routing utama, Axios client, service layer API, fallback mock data, `.env.example`, `.gitignore`, dan README awal. | **Fondasi Proyek & Service Layer** |
| **2** | **Anggota 2** | **Dashboard & Layout Utama**<br>Komponen Navbar, Sidebar responsif, Footer, MainLayout, halaman Dashboard, StatCard, LoadingSkeleton, state management, tombol retry, dan navigasi keyboard. | `DashboardPage.jsx` (`/`) |
| **3** | **Anggota 3** | **Modul Surat Masuk & Surat Keluar**<br>Tabel surat responsif (SuratTable), kartu surat mobile (SuratCard), form pencarian (SearchBar), filter kategori/status, modal detail surat, empty state, loading & error state. | `SuratMasukPage.jsx` (`/surat-masuk`)<br>`SuratKeluarPage.jsx` (`/surat-keluar`) |
| **4** | **Anggota 4** | **Modul Disposisi & Arsip**<br>DisposisiCard, ArsipTable, StatusBadge, alur pembuatan lembar disposisi dengan validasi client-side, pencarian arsip, informasi fisik dokumen, responsive CSS Grid & Flexbox. | `DisposisiPage.jsx` (`/disposisi`)<br>`ArsipPage.jsx` (`/arsip`) |
| **5** | **Anggota 5** | **Modul Tugas, Integrasi Akhir & Dokumentasi**<br>TaskCard, TaskFilter, form penambahan tugas dengan validasi form, integrasi seluruh rute, pengujian browser lintas modul, penyusunan screenshot, dan laporan akhir UTS. | `TugasPage.jsx` (`/tugas`)<br>**Integrasi & Dokumentasi Final** |

---

## 📁 Struktur Direktori Proyek

Arsitektur folder dirancang rapi, modular, dan mematuhi prinsip *Separation of Concerns* (SoC) serta *DRY (Don't Repeat Yourself)*:

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
│   ├── components/                   # Komponen Reusable (StatCard, SuratTable, dsb.)
│   │   └── README.md                 # Panduan penempatan komponen tiap anggota
│   ├── layouts/                      # Layout Aplikasi Utama
│   │   ├── MainLayout.jsx            # Layout dengan Navbar, Sidebar Navigasi, Outlet, & Footer
│   │   └── index.js
│   ├── pages/                        # Halaman Tampilan Aplikasi
│   │   ├── DashboardPage.jsx         # Halaman Ringkasan Eksekutif & Statistik (Anggota 2)
│   │   ├── SuratMasukPage.jsx        # Halaman Pengelolaan Surat Masuk (Anggota 3)
│   │   ├── SuratKeluarPage.jsx       # Halaman Pengelolaan Surat Keluar (Anggota 3)
│   │   ├── DisposisiPage.jsx         # Halaman Lembar Alur Disposisi (Anggota 4)
│   │   ├── ArsipPage.jsx             # Halaman Repositori Arsip Digital (Anggota 4)
│   │   ├── TugasPage.jsx             # Halaman Manajemen Penugasan Pegawai (Anggota 5)
│   │   ├── NotFoundPage.jsx          # Halaman Error 404 Route Not Found
│   │   └── index.js
│   ├── routes/                       # Konfigurasi Routing
│   │   ├── AppRoutes.jsx             # Pemetaan seluruh rute menggunakan React Router v6
│   │   └── index.js
│   ├── services/                     # Service Layer & Integrasi API
│   │   ├── api.js                    # Konfigurasi Axios, Interceptor Token & Error, fetchWithFallback
│   │   ├── dashboardService.js       # Service data statistik dashboard
│   │   ├── suratMasukService.js      # Service CRUD surat masuk
│   │   ├── suratKeluarService.js     # Service CRUD surat keluar
│   │   ├── disposisiService.js       # Service CRUD & alur disposisi
│   │   ├── arsipService.js           # Service repositori arsip
│   │   ├── tugasService.js           # Service pengelolaan tugas pegawai
│   │   └── index.js                  # Central service export
│   ├── App.jsx                       # Root Component
│   ├── index.css                     # Global CSS (Variables, Resets, Grid, Flexbox, Media Queries)
│   └── main.jsx                      # Entry Point React 18 createRoot
├── .env                              # Variabel Lingkungan Lokal
├── .env.example                      # Contoh template environment variables
├── .gitignore                        # Konfigurasi pengabaian file Git
├── index.html                        # HTML5 Semantic Template
├── package.json                      # Dependensi npm & script proyek
├── README.md                         # Dokumentasi lengkap proyek
└── vite.config.js                    # Konfigurasi Vite & Alias path (@)
```

---

## 🚀 Panduan Instalasi & Menjalankan Aplikasi

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di komputer lokal:

### 1. Prasyarat Sistem
- **Node.js**: Versi LTS 18.x atau 20.x atau lebih baru ([Download Node.js](https://nodejs.org/))
- **npm** (bawaan Node.js) atau **pnpm** / **yarn**
- **Git** ([Download Git](https://git-scm.com/))

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
cp .env.example .env
```
Isi konfigurasi dalam file `.env`:
```ini
# Base URL API Backend BKSDA (jika server CodeIgniter 4 menyala)
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
Buka browser dan akses alamat:
```text
http://localhost:5173
```

### 6. Build Produksi
Untuk memeriksa kebersihan kode dan melakukan kompilasi produksi:
```bash
npm run build
```
Hasil build akan tersimpan pada folder `dist/`.

---

## 🌐 Arsitektur Data Source & API Service Layer

Sesuai instruksi Tugas Besar, data dapat dikonsumsi baik dari **Mock API** maupun **Backend API Nyata**:

1. **Dual-Mode Transparan (`src/services/api.js`)**:
   - Fungsi `fetchWithFallback(apiEndpoint, mockPath)` akan mendeteksi pengaturan `VITE_USE_MOCK`.
   - Jika `VITE_USE_MOCK=true`, data otomatis di-fetch dari file JSON lokal di `public/mock/` melalui Axios (sehingga tetap memenuhi kriteria penilaian *Data Fetching*).
   - Jika `VITE_USE_MOCK=false`, Axios akan menghubungi backend `http://localhost:8080/api`. Apabila backend sedang offline, sistem secara cerdas melakukan *fallback* ke mock JSON agar antarmuka tidak rusak (*graceful degradation*).

2. **Request Interceptor**:
   - Menyematkan `Authorization: Bearer <token>` secara otomatis pada setiap request jika token tersimpan di `localStorage`.

3. **Response Interceptor & Error Handling**:
   - Menerjemahkan status error HTTP (400, 401, 403, 404, 422, 500) menjadi pesan berbahasa Indonesia yang ramah pengguna (`error.userFriendlyMessage`).

---

## 🌿 Alur Kolaborasi GitHub Bersama (Branch `main`)

Seluruh anggota bekerja langsung pada satu branch `main` tanpa pull request:

### 1. Sebelum Mulai Coding
Selalu periksa status dan tarik perubahan terbaru dari anggota lain:
```bash
git status
git switch main
git pull --ff-only origin main
```

### 2. Setelah Selesai Mengerjakan Modul
Tambahkan file, buat commit dengan format pesan yang telah disepakati, lalu lakukan push:
```bash
git status
git add .
git commit -m "NAMA COMMIT SESUAI ANGGOTA"
git pull --rebase origin main
git push origin main
```

### 3. Konvensi Commit Tiap Anggota:
- **Anggota 1**: `git commit -m "feat: setup React project, routing, and API configuration"`
- **Anggota 2**: `git commit -m "feat: implement dashboard and responsive main layout"`
- **Anggota 3**: `git commit -m "feat: implement incoming and outgoing mail management"`
- **Anggota 4**: `git commit -m "feat: implement disposition and archive management"`
- **Anggota 5**: `git commit -m "feat: implement task management and finalize documentation"`

---

## 📄 Lisensi & Hak Cipta
Dikembangkan untuk keperluan evaluasi akademik **Tugas Besar I (UTS) Perancangan dan Pemrograman Web**, Telkom University.  
Hak Cipta &copy; 2026 Tim Pengembang Mahasiswa & Balai Konservasi Sumber Daya Alam (BKSDA) Jawa Tengah.
