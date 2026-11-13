import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  Send,
  Share2,
  Archive,
  CheckSquare,
  ShieldAlert,
  Menu,
  X,
  Building2,
  Database,
  ExternalLink,
} from 'lucide-react';
import { USE_MOCK } from '../services/api';

/**
 * MainLayout
 * Fondasi layout aplikasi dengan Semantic HTML5 & Aksesibilitas (WCAG).
 *
 * Catatan Pembagian Tugas:
 * - Struktur fondasi dan integrasi Outlet React Router disiapkan oleh Anggota 1.
 * - Komponen detail Navbar, Sidebar responsif, Footer, dan User Profile
 *   akan diperkaya dan disempurnakan tampilannya oleh Anggota 2.
 */
export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/surat-masuk', label: 'Surat Masuk', icon: Inbox },
    { to: '/surat-keluar', label: 'Surat Keluar', icon: Send },
    { to: '/disposisi', label: 'Disposisi', icon: Share2 },
    { to: '/arsip', label: 'Arsip Dokumen', icon: Archive },
    { to: '/tugas', label: 'Manajemen Tugas', icon: CheckSquare },
  ];

  return (
    <div className="app-shell">
      {/* Top Navbar Header */}
      <header className="app-navbar" role="banner">
        <div className="navbar-container">
          <div className="navbar-brand">
            <button
              type="button"
              className="mobile-toggle"
              aria-label={mobileMenuOpen ? 'Tutup navigasi menu' : 'Buka navigasi menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="brand-logo" aria-hidden="true">
              <Building2 size={24} />
            </div>
            <div className="brand-title-wrap">
              <span className="brand-title">E-Office BKSDA Jateng</span>
              <span className="brand-tagline">Balai Konservasi Sumber Daya Alam Jawa Tengah</span>
            </div>
          </div>

          <div className="navbar-meta">
            {/* Indikator Status Sumber Data (Mock vs Backend) */}
            <div
              className={`api-status-pill ${USE_MOCK ? 'status-mock' : 'status-live'}`}
              title={USE_MOCK ? 'Mode Mock API aktif (/mock/*.json)' : 'Mode Backend API aktif'}
              role="status"
            >
              <Database size={14} />
              <span>{USE_MOCK ? 'Mock API Mode' : 'Live Backend API'}</span>
            </div>

            <div className="user-profile-badge" aria-label="Informasi Pengguna">
              <div className="user-avatar" aria-hidden="true">BK</div>
              <div className="user-info">
                <span className="user-name">Pegawai BKSDA</span>
                <span className="user-role">Seksi Wilayah II</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="app-body">
        {/* Sidebar Navigasi Utama */}
        <aside
          id="main-sidebar"
          className={`app-sidebar ${mobileMenuOpen ? 'is-open' : ''}`}
          role="navigation"
          aria-label="Navigasi Utama"
        >
          <div className="sidebar-section-title">Menu Utama</div>
          <nav className="sidebar-nav">
            <ul className="nav-list">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.to} className="nav-item">
                    <NavLink
                      to={item.to}
                      end={item.exact}
                      className={({ isActive }) =>
                        `nav-link ${isActive ? 'active' : ''}`
                      }
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <IconComponent size={20} className="nav-icon" aria-hidden="true" />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="sidebar-footer-note">
            <div className="note-card">
              <span className="note-title">E-Office BKSDA Jateng</span>
              <span className="note-text">UTS Pemrograman Web 2026</span>
              <span className="note-team">Kelompok 5 Anggota</span>
            </div>
          </div>
        </aside>

        {/* Konten Halaman Utama melalui React Router Outlet */}
        <main id="main-content" className="app-main" tabIndex="-1">
          <Outlet />
        </main>
      </div>

      {/* Footer Aplikasi */}
      <footer className="app-footer" role="contentinfo">
        <div className="footer-container">
          <p>
            &copy; {new Date().getFullYear()} Balai Konservasi Sumber Daya Alam (BKSDA) Jawa Tengah.
            Sistem Tata Persuratan & E-Office Elektronik.
          </p>
          <p className="footer-subtext">
            Perancangan &amp; Pemrograman Web &bull; Fondasi Proyek oleh Anggota 1 &bull; Branch <code>main</code>
          </p>
        </div>
      </footer>
    </div>
  );
}
