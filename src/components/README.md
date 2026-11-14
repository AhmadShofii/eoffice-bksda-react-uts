# Panduan Struktur Komponen (src/components)
E-Office BKSDA Jawa Tengah

Folder ini disiapkan oleh **Anggota 1** sebagai wadah komponen reusable bagi seluruh anggota tim:

## Pembagian Komponen:
1. **Anggota 2 (Dashboard & Layout Utama)**
   - `Sidebar.jsx`, `Navbar.jsx`, `Footer.jsx`
   - `StatCard.jsx` (kartu ringkasan surat masuk, keluar, disposisi, tugas)
   - `LoadingSkeleton.jsx` (animasi skeleton loading saat fetching API)

2. **Anggota 3 (Modul Surat Masuk & Keluar)**
   - `SuratTable.jsx` (tabel daftar surat yang responsif)
   - `SuratCard.jsx` (tampilan kartu untuk perangkat layar kecil/mobile)
   - `SearchBar.jsx` (input pencarian debounce/realtime)
   - `DetailSuratModal.jsx` (modal ringkasan surat)

3. **Anggota 4 (Modul Disposisi & Arsip)**
   - `DisposisiCard.jsx` (kartu alur disposisi)
   - `ArsipTable.jsx` (tabel data arsip dokumen)
   - `StatusBadge.jsx` (badge status warna: menunggu, proses, selesai)

4. **Anggota 5 (Modul Tugas Pegawai)**
   - `TaskCard.jsx` (kartu tugas dengan progress & deadline)
   - `TaskFilter.jsx` (filter status & prioritas tugas)
   - `TaskForm.jsx` (form penambahan tugas dengan validasi)
   - `DetailTaskModal.jsx` (modal lembar rincian tugas & pembaruan status)
