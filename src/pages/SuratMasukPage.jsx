import React from 'react';
import { Mail, Users, CheckCircle2 } from 'lucide-react';

/**
 * Halaman: Surat Masuk
 * Tanggung Jawab: Anggota 3 (Modul Surat Masuk & Surat Keluar)
 *
 * Fondasi routing dan service disiapkan oleh Anggota 1.
 * Anggota 3 akan mengimplementasikan:
 * - SuratTable, SuratCard, SearchBar
 * - Fitur pencarian nomor surat, perihal, atau pengirim
 * - Filter kategori / sifat surat
 * - Modal detail surat, empty state, loading & error state
 */
export default function SuratMasukPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Surat Masuk</h1>
          <p className="page-subtitle">
            Pencatatan dan Pengelolaan Surat Masuk BKSDA Jawa Tengah
          </p>
        </div>
        <span className="badge-author">
          <Users size={14} /> Modul Anggota 3
        </span>
      </header>

      <section className="placeholder-card" aria-labelledby="surat-masuk-heading">
        <div className="placeholder-icon">
          <Mail size={40} />
        </div>
        <h2 id="surat-masuk-heading" className="placeholder-title">
          Fondasi Halaman Surat Masuk Terhubung
        </h2>
        <p className="placeholder-desc">
          Rute <code>/surat-masuk</code> aktif pada React Router.
          Service pengambilan data tersedia di <code>src/services/suratMasukService.js</code> (mendukung pencarian, filter, dan detail ID).
        </p>

        <div className="checklist-box">
          <h3 className="checklist-title">Spesifikasi Modul Anggota 3:</h3>
          <ul className="checklist-list">
            <li><CheckCircle2 size={16} /> Komponen reusable SuratTable, SuratCard, dan SearchBar</li>
            <li><CheckCircle2 size={16} /> Fitur pencarian berdasarkan nomor surat, perihal, atau pengirim</li>
            <li><CheckCircle2 size={16} /> Filter kategori dan status surat</li>
            <li><CheckCircle2 size={16} /> Halaman / modal detail surat & empty state jika data tidak ditemukan</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
