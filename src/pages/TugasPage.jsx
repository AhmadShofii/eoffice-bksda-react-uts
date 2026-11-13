import React from 'react';
import { CheckSquare, Users, CheckCircle2 } from 'lucide-react';

/**
 * Halaman: Modul Tugas Pegawai
 * Tanggung Jawab: Anggota 5 (Modul Tugas, Integrasi Akhir & Dokumentasi)
 *
 * Fondasi routing dan service disiapkan oleh Anggota 1.
 * Anggota 5 akan mengimplementasikan:
 * - Komponen TaskCard, TaskFilter, dan TaskForm
 * - Filter status tugas: belum dikerjakan, proses, dan selesai
 * - Form penambahan tugas baru dengan validasi client-side
 * - Loading, error, dan empty state
 * - Integrasi pengujian akhir dan dokumentasi README / laporan
 */
export default function TugasPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Manajemen Tugas</h1>
          <p className="page-subtitle">
            Pelacakan Tugas Pegawai & Aktivitas Lapangan Konservasi
          </p>
        </div>
        <span className="badge-author">
          <Users size={14} /> Modul Anggota 5
        </span>
      </header>

      <section className="placeholder-card" aria-labelledby="tugas-heading">
        <div className="placeholder-icon">
          <CheckSquare size={40} />
        </div>
        <h2 id="tugas-heading" className="placeholder-title">
          Fondasi Halaman Tugas Terhubung
        </h2>
        <p className="placeholder-desc">
          Rute <code>/tugas</code> aktif pada React Router.
          Service data tersedia di <code>src/services/tugasService.js</code>.
        </p>

        <div className="checklist-box">
          <h3 className="checklist-title">Spesifikasi Modul Anggota 5:</h3>
          <ul className="checklist-list">
            <li><CheckCircle2 size={16} /> Komponen TaskCard, TaskFilter, dan TaskForm</li>
            <li><CheckCircle2 size={16} /> Filter status tugas (belum dikerjakan, proses, selesai)</li>
            <li><CheckCircle2 size={16} /> Form penambahan tugas baru dengan validasi client-side</li>
            <li><CheckCircle2 size={16} /> Integrasi pengujian akhir seluruh rute & dokumentasi submission UTS</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
