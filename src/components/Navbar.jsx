import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Trees,
  Database,
  Calendar,
  Bell,
  CheckCircle,
} from 'lucide-react';
import { USE_MOCK } from '../services/api';

/**
 * Komponen: Navbar
 * E-Office BKSDA Jawa Tengah
 *
 * Header navigasi utama dengan identitas instansi, indikator data real-time,
 * penampil tanggal dinamis, skip-link aksesibilitas, dan profil pegawai.
 *
 * @param {object} props
 * @param {boolean} props.mobileMenuOpen - Status buka/tutup menu mobile
 * @param {Function} props.onToggleMobileMenu - Fungsi toggle menu mobile
 */
export default function Navbar({ mobileMenuOpen, onToggleMobileMenu }) {
  const [currentDateString, setCurrentDateString] = useState('');

  useEffect(() => {
    // Format tanggal Indonesia: contoh "Kamis, 14 November 2026"
    try {
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      setCurrentDateString(new Intl.DateTimeFormat('id-ID', options).format(new Date()));
    } catch {
      setCurrentDateString('14 November 2026');
    }
  }, []);

  return (
    <header className="app-navbar" role="banner">
      {/* Skip to Main Content Link untuk Navigasi Keyboard (WCAG Accessibility) */}
      <a href="#main-content" className="skip-link">
        Lewati ke Konten Utama
      </a>

      <div className="navbar-container">
        {/* Brand Identitas BKSDA Jateng */}
        <div className="navbar-brand">
          <button
            type="button"
            className="mobile-toggle"
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileMenuOpen}
            aria-controls="main-sidebar"
            onClick={onToggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>

          <div className="brand-logo" aria-hidden="true">
            <Trees size={24} />
          </div>

          <div className="brand-title-wrap">
            <span className="brand-title">E-Office BKSDA Jateng</span>
            <span className="brand-tagline">Balai Konservasi Sumber Daya Alam Jawa Tengah</span>
          </div>
        </div>

        {/* Info & Meta Pengguna */}
        <div className="navbar-meta">
          {/* Tanggal Dinamis */}
          <div className="navbar-date-chip" title="Tanggal Hari Ini">
            <Calendar size={14} aria-hidden="true" />
            <time dateTime={new Date().toISOString().split('T')[0]}>
              {currentDateString}
            </time>
          </div>

          {/* Indikator Status Sumber Data (Mock vs Live API) */}
          <div
            className={`api-status-pill ${USE_MOCK ? 'status-mock' : 'status-live'}`}
            title={USE_MOCK ? 'Sumber data: Mock API lokal (/mock/*.json)' : 'Sumber data: Backend API Aktif'}
            role="status"
            aria-label={USE_MOCK ? 'Mode Mock API aktif' : 'Mode Live API aktif'}
          >
            <Database size={13} aria-hidden="true" />
            <span>{USE_MOCK ? 'Mock API' : 'Live API'}</span>
          </div>

          {/* Profil Singkat Pegawai */}
          <div
            className="user-profile-badge"
            role="region"
            aria-label="Profil Pegawai Masuk"
          >
            <div className="user-avatar" aria-hidden="true">
              BK
            </div>
            <div className="user-info">
              <span className="user-name">Pegawai BKSDA</span>
              <span className="user-role">Seksi Wilayah II</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
