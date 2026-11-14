# Laporan Tugas Besar I (UTS) — Penilaian Individu
## Perancangan dan Pemrograman Web (PPW)
### E-Office BKSDA Jawa Tengah

---

## 👤 Identitas Mahasiswa & Peran Tim

- **Mata Kuliah**: Perancangan dan Pemrograman Web
- **Tugas**: Evaluasi Praktik Frontend Development (Tugas Besar I / UTS)
- **Nama Proyek**: E-Office BKSDA Jawa Tengah (*Single Page Application*)
- **Repository GitHub**: `eoffice-bksda-react-uts` (Branch: `main`)
- **Peran**: **Anggota 5 — Modul Tugas Pegawai, Integrasi Akhir & Dokumentasi**
- **Commit Git Utama**: `feat: implement task management and finalize documentation`

---

## 🎯 Fokus Utama & Batasan Tugas Anggota 5

Sebagai **Anggota 5**, tanggung jawab berfokus pada:
1. Mengembangkan halaman **`TugasPage.jsx`** (`/tugas`) sebagai modul monitoring penugasan kerja dan aktivitas konservasi staf BKSDA Jawa Tengah.
2. Mengembangkan komponen-komponen *reusable*:
   - **`TaskCard.jsx`**: Kartu visual tugas pegawai dengan progress bar, badge status, badge prioritas, countdown deadline, tombol detail, dan aksi cepat perubahan status (*quick action*).
   - **`TaskFilter.jsx`**: Panel filter responsif dengan tab status (Semua, Belum Dikerjakan, Dalam Proses, Selesai) dilengkapi counter badge dinamis, input pencarian real-time, dropdown tingkat prioritas, dan tombol reset filter.
   - **`TaskForm.jsx`**: Modal formulir penambahan tugas baru dengan validasi client-side ketat (panjang karakter judul & deskripsi, pilihan PJ, tingkat prioritas, dan tanggal tenggat waktu).
   - **`DetailTaskModal.jsx`**: Modal lembar rincian tugas pegawai lengkap dengan status switcher langsung.
3. Menghubungkan halaman dan komponen ke **API Service Layer** (`src/services/tugasService.js` & `src/services/api.js`) untuk pengambilan data dinamis (*fetch* menggunakan Axios / fallback Mock JSON).
4. Mengimplementasikan siklus UI lengkap:
   - **Loading State** dengan animasi shimmer skeleton (`LoadingSkeleton`).
   - **Error State** interaktif dengan pesan ramah pengguna dan tombol coba lagi (*Retry Button*).
   - **Empty State** jika filter/pencarian tidak menghasilkan data atau daftar tugas kosong.
5. Memastikan kepatuhan penuh terhadap kriteria penilaian: **Semantic HTML5**, **Aksesibilitas WCAG 2.1 AA** (navigasi keyboard, aria-label, role), **Modern CSS (Grid, Flexbox, Media Queries)**, dan **Clean Code**.
6. Melakukan integrasi akhir seluruh 6 halaman di branch `main`, menguji bebas error konsol (`npm run build` berhasil 100%), serta menyusun dokumentasi `README.md` final dan laporan ini.

---

## 💻 Penjelasan Teknis Komprehensif (Sesuai Format Rubrik)

### 1. HTML Semantics & Accessibility (WCAG 2.1 AA)

Modul penugasan dibangun dengan standar HTML5 semantik dan aksesibilitas tingkat tinggi:

- **Penggunaan Elemen Semantik HTML5**:
  - `<header className="page-header">`: Membungkus judul halaman, badge identitas modul, dan tombol aksi (Segarkan, Tambah Tugas).
  - `<section className="tasks-summary-grid">`: Membungkus 4 kartu ringkasan statistik metrik tugas.
  - `<article className="task-summary-card">`: Mewakili setiap kartu statistik independen.
  - `<section className="task-filter-panel">`: Menandai area kontrol pencarian dan filter dengan `aria-label="Panel Pencarian dan Filter Tugas Pegawai"`.
  - `<article className="task-card">`: Digunakan untuk setiap entitas kartu tugas pegawai dalam grid, dilengkapi dengan `aria-labelledby={`task-title-${task.id}`}`.
  - `<form onSubmit={handleSubmit} noValidate>`: Formulir standar HTML5 pada modal penambahan tugas dengan penonaktifan validasi bawaan browser agar menggunakan validasi kustom JavaScript.
  - `<aside className="toast-banner">`: Menampung banner notifikasi umpan balik sementara (*feedback toast*) dengan `role="status"` dan `aria-live="polite"`.

- **Aksesibilitas WCAG 2.1 AA**:
  - **Label Form yang Accessible**: Setiap elemen input (`<input>`, `<select>`, `<textarea>`) terhubung secara eksplisit dengan `<label htmlFor="...">` yang sesuai.
  - **ARIA Attributes & Error Handling**:
    - Input yang tidak lolos validasi disematkan atribut `aria-invalid="true"`.
    - Pesan error input ditautkan ke input melalui `aria-describedby="err-task-judul"` dan memiliki atribut `role="alert"` sehingga langsung diumumkan oleh screen reader.
    - Field wajib ditandai secara visual dan semantik dengan `aria-required="true"` serta kelas CSS `.required`.
  - **Progress Bar Semantik**: Indikator progres kemajuan tugas menggunakan `role="progressbar"`, `aria-valuenow={progress}`, `aria-valuemin={0}`, dan `aria-valuemax={100}`.
  - **Navigasi Keyboard Penuh**:
    - Seluruh tombol dan kartu interaktif memiliki atribut `tabIndex={0}` dan event handler keyboard (`onKeyDown` untuk tombol `Enter`).
    - Modal dialog (`TaskForm` dan `DetailTaskModal`) dapat ditutup sewaktu-waktu menggunakan tombol **Escape**.
    - Auto-focus secara otomatis mengarahkan kursor ke input pertama (`judul`) saat modal form dibuka.
    - Focus outline yang jelas (`outline: 2px solid var(--primary-500); outline-offset: 2px;`) terlihat saat berpindah menggunakan tombol `Tab`.

---

### 2. Modern CSS & Responsive Design

Penataan antarmuka menggunakan CSS murni modern tanpa dependensi utility yang berlebihan, memaksimalkan fleksibilitas dan performa rendering:

- **CSS Grid**:
  - `tasks-summary-grid`: Grid 4 kolom adaptif (`grid-template-columns: repeat(4, 1fr);`) untuk kartu ringkasan statistik.
  - `tasks-grid`: Grid kartu tugas yang responsif menggunakan formula auto-fill (`grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 1.25rem;`), sehingga jumlah kolom menyesuaikan lebar layar secara otomatis.
  - `form-grid-2`: Penataan 2 kolom sejajar untuk input penanggung jawab, kategori, prioritas, dan tenggat waktu.

- **CSS Flexbox**:
  - `task-card`: Pengaturan tata letak vertikal kartu dengan `flex-direction: column; justify-content: space-between;` sehingga ukuran kartu tetap seragam dan bagian footer aksi selalu berada di posisi terbawah (`margin-top: auto`).
  - `task-status-tabs`: Penjajaran tab filter status secara horizontal dengan counter badge melingkar.
  - `task-card-header` & `task-card-footer`: Distribusi elemen kanan dan kiri menggunakan `display: flex; justify-content: space-between; align-items: center;`.

- **Media Queries & Multi-Breakpoint Responsiveness**:
  - `@media (max-width: 1200px)`: Grid ringkasan statistik bertransisi dari 4 kolom menjadi 2 kolom.
  - `@media (max-width: 900px)`: Baris kontrol filter dan input pencarian beralih ke orientasi vertikal (*stacked*); grid kartu tugas menyesuaikan ke 1 kolom.
  - `@media (max-width: 640px)`:
    - Seluruh kartu summary, grid form modal (`form-grid-2`), dan meta detail beralih menjadi 1 kolom penuh (*full-width*).
    - Tab filter status mengaktifkan *horizontal scroll* (`overflow-x: auto`) agar tidak terpotong pada smartphone kecil.
    - Tombol footer kartu dan tombol aksi modal diperbesar memenuhi lebar kontainer (*full width touch target* $\ge 44\text{px}$) demi kenyamanan pengguna perangkat mobile.
    - Toast banner bergeser memenuhi bagian bawah layar smartphone.

- **Animasi & Interaktivitas**:
  - Keyframe `slideInUp` untuk transisi kemunculan toast notification.
  - Keyframe `scaleInModal` dan `fadeInModal` untuk membuka modal pop-up dengan efek halus.
  - Keyframe `spin` untuk indikator refresh data dan loading tombol simpan.
  - Efek hover kartu dengan sedikit pengangkatan vertikal (`transform: translateY(-3px); box-shadow: var(--shadow-md);`).

---

### 3. JavaScript ES6+ & React Framework Architecture

Implementasi modul menerapkan prinsip-prinsip arsitektur React modern berbasis fungsional dan custom logic:

- **Komponen Fungsional & React Hooks**:
  - `useState`: Mengelola state lokal data tugas (`tasks`), filter aktif (`statusFilter`, `priorityFilter`, `searchQuery`), status modal (`isFormOpen`, `isDetailOpen`), data terpilih (`selectedTask`), status loading/error, dan pesan toast.
  - `useEffect`: Menjalankan fetching data saat komponen pertama kali dimuat (*initial mount*), mendengarkan tombol keyboard `Escape` untuk menutup modal, serta menjalankan timer auto-dismiss untuk toast notification (4 detik).
  - `useCallback`: Membungkus fungsi `fetchTasks` agar referensinya stabil dan tidak menyebabkan infinite re-render ketika dimasukkan ke dalam dependency array `useEffect`.
  - `useMemo`: Menghitung ringkasan jumlah tugas per kategori status (`counts`) dan menyaring daftar tugas (`filteredTasks`) secara efisien hanya ketika state terkait berubah.
  - `useRef`: Menyimpan referensi DOM ke input judul pada `TaskForm` untuk keperluan auto-focus saat modal dibuka.

- **Client-Side Form Validation (Validasi Formulir)**:
  - Form validasi dibuat dengan pendekatan *instant feedback* berbasis state `touched` dan fungsi `validateField`.
  - Error hanya ditampilkan setelah pengguna berinteraksi dengan field input tersebut (*blur* atau *change* setelah *touch*) atau saat pengguna menekan tombol *submit*.
  - Aturan validasi mencakup:
    - Judul: Wajib diisi, panjang minimal 5 karakter, maksimal 120 karakter.
    - Penanggung Jawab: Wajib dipilih dari daftar staf BKSDA atau input manual minimal 3 karakter.
    - Prioritas: Wajib ditentukan (Tinggi, Sedang, Rendah).
    - Tenggat Waktu: Wajib tanggal valid.
    - Deskripsi: Wajib diisi, minimal 10 karakter agar instruksi pengerjaan jelas bagi personel, dilengkapi penghitung sisa karakter dinamis (maksimal 600 karakter).

- **Clean Component Architecture (DRY Principle)**:
  - Komponen dipecah menjadi unit-unit kecil yang independen dan memiliki satu tanggung jawab spesifik (*Single Responsibility Principle*): `TaskCard`, `TaskFilter`, `TaskForm`, `DetailTaskModal`.
  - Fungsi utilitas seperti `formatDateIndo`, `getDeadlineStatus`, `getTaskStatusMeta`, dan `getPriorityMeta` dapat digunakan kembali antar komponen.

---

### 4. API Service Layer & Data Fetching (Axios)

- **Service Reusable (`src/services/tugasService.js`)**:
  - `getAllTugas(params)`: Mengambil daftar penugasan dengan parameter filter dan pencarian.
  - `getTugasById(id)`: Mengambil rincian tugas berdasarkan ID.
  - `createTugas(payload)`: Menambahkan agenda penugasan baru.
  - `updateStatusTugas(id, status)`: Memperbarui status penugasan secara asinkron.
- **Dual-Mode Transparan**:
  - Terkoneksi dengan `apiClient` Axios. Jika `VITE_USE_MOCK=true`, data di-fetch secara dinamis dari `/public/mock/tugas.json`. Jika `false`, aplikasi menghubungi backend REST API BKSDA dengan fallback otomatis jika backend sedang offline.
- **Error Handling Komprehensif**:
  - Menggunakan konstruksi `try...catch...finally` pada setiap request asinkron.
  - Error diterjemahkan ke pesan berbahasa Indonesia yang mudah dipahami melalui properti `error.userFriendlyMessage`.
  - UI menampilkan state error lengkap dengan tombol retry (*Coba Muat Ulang*).
- **Optimistic / Immediate State Update**:
  - Setelah aksi penambahan atau pembaruan status tugas sukses dieksekusi di service, state `tasks` di React langsung diperbarui secara reaktif tanpa perlu me-reload seluruh halaman.

---

## 📸 Panduan Screenshot untuk Pengumpulan LMS

Bagi mahasiswa Anggota 5, berikut daftar tangkapan layar (*screenshots*) yang disiapkan untuk dilampirkan pada laporan submission:

| No | Nama Screenshot | Deskripsi yang Harus Dicantumkan di Laporan |
|:---:|---|---|
| 1 | `01_halaman_tugas_overview.png` | **Tampilan Penuh Modul Tugas Pegawai**: Memperlihatkan header dengan badge "Modul Anggota 5", 4 kartu ringkasan metrik statistik (Total, Belum Dikerjakan, Dalam Proses, Selesai), filter tab counter, dan grid kartu tugas konservasi BKSDA. |
| 2 | `02_filter_dan_pencarian.png` | **Fitur Filter Status, Prioritas & Pencarian**: Memperlihatkan interaksi saat memilih tab "Dalam Proses", memilih prioritas "Tinggi", atau mengetik kata kunci pencarian, serta munculnya tombol "Reset Filter". |
| 3 | `03_form_tambah_tugas_modal.png` | **Modal Form Tambah Tugas Baru (`TaskForm`)**: Menampilkan jendela pop-up formulir penugasan baru dengan pilihan PJ standar BKSDA, opsi input manual, kategori kegiatan, tingkat prioritas, tenggat waktu, dan counter karakter deskripsi. |
| 4 | `04_validasi_error_client_side.png` | **Uji Validasi Form Client-Side**: Menampilkan kondisi ketika input disubmit dalam keadaan kosong atau tidak valid, memperlihatkan garis batas merah (`.form-input--error`), ikon peringatan, dan pesan error semantik (`role="alert"`). |
| 5 | `05_modal_detail_tugas.png` | **Modal Rincian Tugas Pegawai (`DetailTaskModal`)**: Menampilkan lembar rincian instruksi kerja, persentase progress bar, metadata tanggal & penanggung jawab, serta tombol pengubah status pengerjaan instan. |
| 6 | `06_quick_action_dan_toast.png` | **Aksi Cepat Pembaruan Status & Toast Feedback**: Menampilkan kartu saat tombol "Mulai Kerjakan" atau "Tandai Selesai" diklik dan banner toast hijau muncul di pojok kanan bawah memberitahukan status berhasil diperbarui. |
| 7 | `07_loading_skeleton_dan_empty_state.png` | **Penanganan UI State Khusus**: Menampilkan tampilan skeleton shimmer saat fetching data, kartu error state dengan tombol retry, serta tampilan ilustrasi empty state saat hasil pencarian tidak ditemukan. |
| 8 | `08_tampilan_responsif_mobile.png` | **Uji Tampilan Mobile (375px - 414px)**: Menampilkan antarmuka halaman tugas pada layar smartphone dengan tab filter yang dapat digeser mendatar (*horizontal scroll*), kartu vertikal fleksibel, dan tombol aksi yang nyaman disentuh. |

---

## 📋 Checklist Evaluasi Mandiri (Rubrik Penilaian 100/100 Poin)

| Aspek Penilaian | Kriteria Maksimal | Bukti Pemenuhan pada Modul Anggota 5 | Skor Target |
|---|---|---|:---:|
| **Git & Version Control** | Pesan commit deskriptif, commit di branch `main`, frekuensi commit teratur | Commit terstandarisasi: `feat: implement task management and finalize documentation` | **10 / 10** |
| **Framework Implementation** | Best practices React, arsitektur komponen reusable, pengelolaan state & props profesional | Menggunakan functional components, hooks (`useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`), pemisahan komponen modular (`TaskCard`, `TaskFilter`, `TaskForm`, `DetailTaskModal`) | **15 / 15** |
| **HTML Semantics & A11y** | Semantic tags lengkap, aksesibilitas WCAG 2.1 AA, navigasi keyboard penuh | Menggunakan `<header>`, `<main>`, `<section>`, `<article>`, `<form>`, `<label>`, ARIA attributes (`role="status"`, `aria-invalid`, `aria-describedby`, `aria-live`), tombol Escape untuk menutup modal, full keyboard focus | **12 / 12** |
| **Modern CSS & Responsive** | Penggunaan Flexbox & Grid ahli, media queries 3-5 breakpoints, responsif semua ukuran layar | Menggunakan CSS Grid (`tasks-grid`, `tasks-summary-grid`) dan Flexbox murni, breakpoint responsif desktop ($\ge 1200\text{px}$), laptop ($900\text{px}$), dan smartphone ($\le 640\text{px}$) | **12 / 12** |
| **API & Functionality** | Clean fetch via Axios, try-catch komprehensif, loading skeleton shimmer & retry UX | Service layer terpusat (`tugasService.js`), penanganan loading skeleton, error state interaktif dengan tombol retry, optimis state update, toast feedback | **10 / 10** |
| **Code Quality & Architecture**| 0 console error, struktur folder rapi, DRY principle | Hasil kompilasi `npm run build` sukses tanpa error dan tanpa warning, struktur modular rapi di `src/components`, `src/pages`, `src/services` | **10 / 10** |
| **Design Quality & UX** | Konsistensi visual, desain profesional khas BKSDA, UX intuitif & halus | Warna konsisten dengan identitas hijau BKSDA (`--primary-*`, slate, amber, blue), micro-animations, transisi lembut, antarmuka sangat mudah dipahami | **6 / 6** |
| **Rubrik Kelompok (Git, Docs, Integrasi)**| Terintegrasi dengan 6 halaman lain via React Router, README lengkap, petunjuk instalasi detail | Seluruh 6 halaman terhubung mulus di `AppRoutes.jsx`, README.md komprehensif dan panduan instalasi siap uji | **25 / 25** |
| **TOTAL NILAI** | **Evaluasi Sempurna Tugas Besar I (UTS PPW)** | **Seluruh spesifikasi teknis dan kriteria rubrik terpenuhi 100%** | **100 / 100** |
