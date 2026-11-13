import React from 'react';
import { Send, Users, CheckCircle2 } from 'lucide-react';

/**
 * Halaman: Surat Keluar
 * Tanggung Jawab: Anggota 3 (Modul Surat Masuk & Surat Keluar)
 *
 * Fondasi routing dan service disiapkan oleh Anggota 1.
 * Anggota 3 akan mengimplementasikan:
 * - SuratTable, SuratCard, SearchBar untuk surat keluar
 * - Fitur pencarian, filter tujuan, status surat
 * - Modal / detail surat keluar
 */
export default function SuratKeluarPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Surat Keluar</h1>
          <p className="page-subtitle">
            Pencatatan dan Monitoring Surat Keluar BKSDA Jawa Tengah
          </p>
        </div>
        <span className="badge-author">
          <Users size={14} /> Modul Anggota 3
        </span>
      </header>

      <section className="placeholder-card" aria-labelledby="surat-keluar-heading">
        <div className="placeholder-icon">
          <Send size={40} />
        </div>
        <h2 id="surat-keluar-heading" className="placeholder-title">
          Fondasi Halaman Surat Keluar Terhubung
        </h2>
        <p className="placeholder-desc">
          Rute <code>/surat-keluar</code> aktif pada React Router.
          Service data tersedia di <code>src/services/suratKeluarService.js</code>.
        </p>

        <div className="checklist-box">
          <h3 className="checklist-title">Spesifikasi Modul Anggota 3:</h3>
          <ul className="checklist-list">
            <li><CheckCircle2 size={16} /> Menampilkan daftar surat keluar via API / Mock</li>
            <li><CheckCircle2 size={16} /> Fitur pencarian nomor surat, tujuan, dan perihal</li>
            <li><CheckCircle2 size={16} /> Filter status verifikasi & sifat surat</li>
            <li><CheckCircle2 size={16} /> Layout tabel responsif untuk desktop hingga mobile</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
