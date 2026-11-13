import React from 'react';
import { Share2, Users, CheckCircle2 } from 'lucide-react';

/**
 * Halaman: Disposisi Surat
 * Tanggung Jawab: Anggota 4 (Modul Disposisi & Arsip)
 *
 * Fondasi routing dan service disiapkan oleh Anggota 1.
 * Anggota 4 akan mengimplementasikan:
 * - Komponen DisposisiCard & StatusBadge
 * - Filter status disposisi (menunggu, dalam_proses, selesai)
 * - Form pembuatan / penerusan disposisi dengan validasi client-side
 * - Loading, error, dan empty state
 */
export default function DisposisiPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Disposisi Surat</h1>
          <p className="page-subtitle">
            Alur Instruksi dan Penugasan Tindak Lanjut Surat Masuk
          </p>
        </div>
        <span className="badge-author">
          <Users size={14} /> Modul Anggota 4
        </span>
      </header>

      <section className="placeholder-card" aria-labelledby="disposisi-heading">
        <div className="placeholder-icon">
          <Share2 size={40} />
        </div>
        <h2 id="disposisi-heading" className="placeholder-title">
          Fondasi Halaman Disposisi Terhubung
        </h2>
        <p className="placeholder-desc">
          Rute <code>/disposisi</code> aktif pada React Router.
          Service data tersedia di <code>src/services/disposisiService.js</code>.
        </p>

        <div className="checklist-box">
          <h3 className="checklist-title">Spesifikasi Modul Anggota 4:</h3>
          <ul className="checklist-list">
            <li><CheckCircle2 size={16} /> Komponen DisposisiCard dan StatusBadge</li>
            <li><CheckCircle2 size={16} /> Form disposisi baru dengan validasi client-side (required fields, batas waktu)</li>
            <li><CheckCircle2 size={16} /> Filter status (menunggu, proses, selesai) dan pencarian</li>
            <li><CheckCircle2 size={16} /> Semantic HTML5 dan label form yang accessible (WCAG)</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
