import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

/**
 * Layout: MainLayout
 * E-Office BKSDA Jawa Tengah
 *
 * Menggabungkan Navbar, Sidebar, Content Outlet, dan Footer ke dalam
 * satu kerangka aplikasi responsif dan berstandar aksesibilitas (WCAG).
 *
 * Tanggung Jawab: Anggota 2
 */
export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Menutup drawer mobile secara otomatis setiap kali rute berpindah
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleToggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleCloseMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="app-shell">
      {/* Header Navbar */}
      <Navbar
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={handleToggleMobileMenu}
      />

      <div className="app-body">
        {/* Navigasi Sidebar Responsif & Keyboard-friendly */}
        <Sidebar
          isOpen={mobileMenuOpen}
          onClose={handleCloseMobileMenu}
        />

        {/* Konten Halaman Utama melalui React Router Outlet */}
        <main
          id="main-content"
          className="app-main"
          tabIndex="-1"
          role="main"
          aria-label="Konten Utama Halaman"
        >
          <Outlet />
        </main>
      </div>

      {/* Footer Aplikasi */}
      <Footer />
    </div>
  );
}
