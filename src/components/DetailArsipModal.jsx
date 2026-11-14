import React, { useEffect, useRef } from 'react';
import {
  X,
  Calendar,
  FolderArchive,
  FileText,
  MapPin,
  Download,
  Printer,
  ShieldCheck,
  Building,
  HardDrive,
  Hash,
  ExternalLink,
} from 'lucide-react';

/**
 * Format tanggal standar Indonesia (contoh: "Selasa, 12 September 2026")
 * @param {string} dateStr
 */
function formatDateIndo(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

/**
 * Komponen Reusable: DetailArsipModal
 * E-Office BKSDA Jawa Tengah - Modul Anggota 4
 *
 * Modal dialog aksesibel untuk menampilkan informasi detail dokumen arsip resmi:
 * - Kode klasifikasi & nomor surat referensi
 * - Judul dokumen lengkap & kategori arsip
 * - Lokasi fisik penyimpanan berkas (Rak, Boks, Ruang Arsip)
 * - Metadata berkas digital (format, ukuran, simulasi pengunduhan)
 * - Kepatuhan WCAG (Esc listener, trap scroll, ARIA dialog)
 *
 * @param {object} props
 * @param {object|null} props.arsip - Data dokumen arsip terpilih
 * @param {Function} props.onClose - Callback saat modal ditutup: () => void
 */
export default function DetailArsipModal({
  arsip,
  onClose,
}) {
  const closeButtonRef = useRef(null);
  const isOpen = Boolean(arsip);

  // Aksesibilitas keyboard (ESC) & Kunci scroll latar belakang
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !arsip) return null;

  const handleDownload = () => {
    alert(`Mengunduh berkas digital resmi: ${arsip.judul}\nUkuran: ${arsip.ukuran_file || '4.8 MB'}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="modal-dialog modal-dialog--arsip"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-arsip-title"
        aria-describedby="detail-arsip-desc"
      >
        {/* Header Modal */}
        <header className="modal-header">
          <div className="modal-header-info">
            <span className="modal-type-chip">
              Repositori Dokumen Resmi BKSDA Jawa Tengah
            </span>
            <h2 id="detail-arsip-title" className="modal-title">
              Rincian Dokumen Arsip
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="modal-btn-close"
            onClick={onClose}
            aria-label="Tutup jendela rincian arsip"
            title="Tutup (Esc)"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        {/* Konten Rincian Arsip */}
        <div className="modal-body" id="detail-arsip-desc">
          {/* Banner Kode Klasifikasi */}
          <div className="modal-banner modal-banner--arsip">
            <div className="modal-banner-nomor">
              <span className="banner-label">Kode Klasifikasi Arsip:</span>
              <code className="banner-code">{arsip.kode_klasifikasi}</code>
            </div>
            <span className="badge-kategori badge-kategori--arsip-lg">
              {arsip.kategori || 'Dokumen Resmi'}
            </span>
          </div>

          {/* Judul Lengkap Arsip */}
          <section className="modal-section" aria-label="Judul Dokumen">
            <span className="section-label">Judul Dokumen Resmi:</span>
            <h3 className="modal-perihal-text">{arsip.judul}</h3>
          </section>

          {/* Grid Informasi Metadata & Fisik (CSS Grid) */}
          <div className="modal-info-grid">
            <div className="modal-info-item">
              <div className="info-icon-wrapper">
                <Hash size={18} aria-hidden="true" />
              </div>
              <div className="info-details">
                <span className="info-label">Nomor Surat Referensi</span>
                <strong className="info-value">{arsip.nomor_surat || '-'}</strong>
              </div>
            </div>

            <div className="modal-info-item">
              <div className="info-icon-wrapper">
                <Calendar size={18} aria-hidden="true" />
              </div>
              <div className="info-details">
                <span className="info-label">Tanggal Pengarsipan</span>
                <strong className="info-value">{formatDateIndo(arsip.tanggal_arsip)}</strong>
              </div>
            </div>

            <div className="modal-info-item modal-info-item--highlight">
              <div className="info-icon-wrapper info-icon-wrapper--green">
                <MapPin size={18} aria-hidden="true" />
              </div>
              <div className="info-details">
                <span className="info-label">Lokasi Penyimpanan Fisik</span>
                <strong className="info-value text-primary-dark">
                  {arsip.lokasi_fisik || 'Ruang Arsip Pusat BKSDA Jateng'}
                </strong>
                <span className="info-subtext">Berkas fisik tersimpan dalam lemari arsip berstandar ANRI</span>
              </div>
            </div>

            <div className="modal-info-item">
              <div className="info-icon-wrapper">
                <Building size={18} aria-hidden="true" />
              </div>
              <div className="info-details">
                <span className="info-label">Unit Pengelola Arsip</span>
                <strong className="info-value">Subbagian Tata Usaha / Seksi Wilayah II</strong>
              </div>
            </div>
          </div>

          {/* Berkas Digital & Pratinjau Lampiran */}
          <section className="modal-section" aria-label="Berkas Digital">
            <span className="section-label">Berkas Digital Resmi:</span>
            <div className="modal-attachment-card">
              <div className="attachment-left">
                <div className="file-icon-box" aria-hidden="true">
                  <FileText size={22} />
                </div>
                <div className="attachment-meta">
                  <div className="attachment-filename">
                    {arsip.judul.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 35)}.pdf
                  </div>
                  <div className="attachment-size">
                    Ukuran Berkas: <strong>{arsip.ukuran_file || '4.8 MB'}</strong> • Format PDF/A Standar Arsip
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn-download-attachment"
                onClick={handleDownload}
                aria-label={`Unduh berkas digital ${arsip.judul}`}
              >
                <Download size={15} aria-hidden="true" />
                <span>Unduh Dokumen</span>
              </button>
            </div>
          </section>

          {/* Lembar Kendali & Keamanan */}
          <div className="arsip-security-note">
            <ShieldCheck size={16} className="security-icon" aria-hidden="true" />
            <p>
              Dokumen ini merupakan arsip dinamis/statis terotentikasi milik Balai Konservasi Sumber Daya Alam Jawa Tengah. Hak akses dibatasi bagi pejabat berwenang.
            </p>
          </div>
        </div>

        {/* Footer Modal */}
        <footer className="modal-footer">
          <div className="modal-footer-left">
            <button
              type="button"
              className="btn-footer-secondary"
              onClick={handlePrint}
              title="Cetak lembar kendali arsip"
            >
              <Printer size={15} aria-hidden="true" />
              <span>Cetak Lembar Kendali</span>
            </button>
          </div>

          <button
            type="button"
            className="btn-footer-primary"
            onClick={onClose}
          >
            Tutup Rincian
          </button>
        </footer>
      </div>
    </div>
  );
}
