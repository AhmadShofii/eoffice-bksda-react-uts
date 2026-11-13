import React from 'react';
import { Archive, Users, CheckCircle2 } from 'lucide-react';

/**
 * Halaman: Arsip Dokumen
 * Tanggung Jawab: Anggota 4 (Modul Disposisi & Arsip)
 *
 * Fondasi routing dan service disiapkan oleh Anggota 1.
 * Anggota 4 akan mengimplementasikan:
 * - Komponen ArsipTable dan detail dokumen
 * - Pencarian arsip berdasarkan kode klasifikasi atau judul
 * - Filter kategori arsip & tahun
 * - Informasi fisik penyimpanan dokumen
 */
export default function ArsipPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Arsip Dokumen</h1>
          <p className="page-subtitle">
            Pusat Repositori Digital & Manajemen Arsip Surat BKSDA Jawa Tengah
          </p>
        </div>
        <span className="badge-author">
          <Users size={14} /> Modul Anggota 4
        </span>
      </header>

      <section className="placeholder-card" aria-labelledby="arsip-heading">
        <div className="placeholder-icon">
          <Archive size={40} />
        </div>
        <h2 id="arsip-heading" className="placeholder-title">
          Fondasi Halaman Arsip Terhubung
        </h2>
        <p className="placeholder-desc">
          Rute <code>/arsip</code> aktif pada React Router.
          Service data tersedia di <code>src/services/arsipService.js</code>.
        </p>

        <div className="checklist-box">
          <h3 className="checklist-title">Spesifikasi Modul Anggota 4:</h3>
          <ul className="checklist-list">
            <li><CheckCircle2 size={16} /> Komponen ArsipTable dengan kolom kode, judul, tanggal, dan lokasi fisik</li>
            <li><CheckCircle2 size={16} /> Modal / panel detail arsip dan informasi dokumen pendukung</li>
            <li><CheckCircle2 size={16} /> Penanganan loading, error, dan empty state</li>
            <li><CheckCircle2 size={16} /> Tata letak responsif menggunakan CSS Grid & Flexbox</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
