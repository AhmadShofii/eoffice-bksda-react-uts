import React from 'react';
import { LayoutDashboard, Users, CheckCircle2 } from 'lucide-react';

/**
 * Halaman: Dashboard Utama
 * Tanggung Jawab: Anggota 2 (Dashboard & Layout Utama)
 *
 * Fondasi routing dan service disiapkan oleh Anggota 1.
 * Anggota 2 akan mengimplementasikan:
 * - StatCard (Surat Masuk, Surat Keluar, Disposisi, Tugas)
 * - LoadingSkeleton, Error state & Retry button
 * - Data fetching via dashboardService / Axios
 * - Responsive layout & keyboard navigation
 */
export default function DashboardPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Dashboard E-Office</h1>
          <p className="page-subtitle">
            Balai Konservasi Sumber Daya Alam (BKSDA) Jawa Tengah
          </p>
        </div>
        <span className="badge-author">
          <Users size={14} /> Modul Anggota 2
        </span>
      </header>

      <section className="placeholder-card" aria-labelledby="dashboard-overview-heading">
        <div className="placeholder-icon">
          <LayoutDashboard size={40} />
        </div>
        <h2 id="dashboard-overview-heading" className="placeholder-title">
          Fondasi Dashboard Terhubung
        </h2>
        <p className="placeholder-desc">
          Rute <code>/</code> telah terkonfigurasi pada React Router dan siap diisi oleh <strong>Anggota 2</strong>.
          Service untuk mengambil data statistik telah disediakan di <code>src/services/dashboardService.js</code>.
        </p>

        <div className="checklist-box">
          <h3 className="checklist-title">Spesifikasi Modul Anggota 2:</h3>
          <ul className="checklist-list">
            <li><CheckCircle2 size={16} /> Komponen Sidebar, Navbar, Footer, dan MainLayout responsif</li>
            <li><CheckCircle2 size={16} /> Kartu statistik jumlah surat masuk, keluar, disposisi, dan tugas</li>
            <li><CheckCircle2 size={16} /> Komponen reusable StatCard dan LoadingSkeleton</li>
            <li><CheckCircle2 size={16} /> Pengelolaan state (useState, useEffect) & error handling dengan tombol retry</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
