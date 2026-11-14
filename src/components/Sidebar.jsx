import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  Send,
  Share2,
  Archive,
  CheckSquare,
  X,
  Sparkles,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

/**
 * Komponen: Sidebar
 * E-Office BKSDA Jawa Tengah
 *
 * Navigasi samping vertikal dengan dukungan penuh keyboard accessibility (WCAG),
 * responsive mobile drawer, dan active state indicator.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Status buka drawer mobile
 * @param {Function} props.onClose - Fungsi menutup drawer mobile
 */
export default function Sidebar({ isOpen, onClose }) {
  const sidebarRef = useRef(null);

  // Daftar menu navigasi utama aplikasi
  const navigationItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      exact: true,
      badge: 'Utama',
    },
    {
      to: '/surat-masuk',
      label: 'Surat Masuk',
      icon: Inbox,
      badge: null,
    },
    {
      to: '/surat-keluar',
      label: 'Surat Keluar',
      icon: Send,
      badge: null,
    },
    {
      to: '/disposisi',
      label: 'Disposisi',
      icon: Share2,
      badge: null,
    },
    {
      to: '/arsip',
      label: 'Arsip Dokumen',
      icon: Archive,
      badge: null,
    },
    {
      to: '/tugas',
      label: 'Manajemen Tugas',
      icon: CheckSquare,
      badge: null,
    },
  ];

  // Aksesibilitas Keyboard: Menutup drawer saat tombol Escape ditekan
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop overlay saat drawer terbuka di tampilan mobile */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="main-sidebar"
        ref={sidebarRef}
        className={`app-sidebar ${isOpen ? 'is-open' : ''}`}
        role="navigation"
        aria-label="Navigasi Utama Aplikasi"
      >
        {/* Header Sidebar Mobile: Tombol Tutup */}
        <div className="sidebar-mobile-header">
          <span className="sidebar-mobile-title">Menu Navigasi</span>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Tutup navigasi sidebar"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Section: Menu Utama */}
        <div className="sidebar-section-title" id="nav-section-main">
          Menu Utama
        </div>

        <nav className="sidebar-nav" aria-labelledby="nav-section-main">
          <ul className="nav-list" role="list">
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
                    onClick={() => {
                      if (isOpen) onClose();
                    }}
                  >
                    <IconComponent
                      size={19}
                      className="nav-icon"
                      aria-hidden="true"
                    />
                    <span className="nav-label">{item.label}</span>
                    {item.badge && (
                      <span className="nav-badge" aria-hidden="true">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Kartu Informasi BKSDA di bagian bawah sidebar */}
        <div className="sidebar-footer-note">
          <div className="note-card" role="note" aria-label="Informasi Wilayah Kerja">
            <div className="note-header">
              <ShieldCheck size={16} className="note-icon" aria-hidden="true" />
              <span className="note-title">BKSDA Jawa Tengah</span>
            </div>
            <p className="note-text">
              Wilayah Konservasi &amp; Cagar Alam Jateng
            </p>
            <div className="note-footer">
              <span className="note-version">v1.0.0 (UTS 2026)</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
