import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts';
import {
  DashboardPage,
  SuratMasukPage,
  SuratKeluarPage,
  DisposisiPage,
  ArsipPage,
  TugasPage,
  NotFoundPage,
} from '../pages';

/**
 * Konfigurasi Utama React Router
 * E-Office BKSDA Jawa Tengah
 *
 * Mengkoneksikan seluruh 6 halaman utama:
 * 1. /              -> Dashboard (Anggota 2)
 * 2. /surat-masuk   -> Surat Masuk (Anggota 3)
 * 3. /surat-keluar  -> Surat Keluar (Anggota 3)
 * 4. /disposisi     -> Disposisi Surat (Anggota 4)
 * 5. /arsip         -> Arsip Dokumen (Anggota 4)
 * 6. /tugas         -> Manajemen Tugas (Anggota 5)
 * *. *              -> 404 Not Found
 */
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Index Route: Dashboard */}
          <Route index element={<DashboardPage />} />

          {/* Modul Surat Masuk & Keluar */}
          <Route path="surat-masuk" element={<SuratMasukPage />} />
          <Route path="surat-keluar" element={<SuratKeluarPage />} />

          {/* Modul Disposisi & Arsip */}
          <Route path="disposisi" element={<DisposisiPage />} />
          <Route path="arsip" element={<ArsipPage />} />

          {/* Modul Tugas */}
          <Route path="tugas" element={<TugasPage />} />

          {/* Fallback 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
