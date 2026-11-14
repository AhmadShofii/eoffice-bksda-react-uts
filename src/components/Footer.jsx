import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

/**
 * Komponen: Footer
 * E-Office BKSDA Jawa Tengah
 *
 * Catatan hak cipta, informasi instansi pemerintah, dan status operasional sistem.
 * Memenuhi spesifikasi Semantic HTML5 (<footer role="contentinfo">).
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-content-left">
          <p className="footer-copyright">
            &copy; {currentYear}{' '}
            <strong>Balai Konservasi Sumber Daya Alam (BKSDA) Jawa Tengah</strong>.
            Hak Cipta Dilindungi.
          </p>
          <p className="footer-subtext">
            Sistem Informasi Tata Persuratan &amp; Administrasi Perkantoran Elektronik.
          </p>
        </div>

        <div className="footer-content-right">
          <span className="footer-status-pill">
            <span className="status-dot-pulse" aria-hidden="true" />
            Sistem Aktif &bull; Wilayah Jateng
          </span>
          <span className="footer-meta-text">
            UTS Perancangan &amp; Pemrograman Web
          </span>
        </div>
      </div>
    </footer>
  );
}
