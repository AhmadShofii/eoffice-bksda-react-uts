import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Calendar,
  Building2,
  Send,
  FileText,
  FileCheck,
  Download,
  Share2,
  Clock,
  Printer,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { getStatusBadge, getSifatBadge } from './SuratCard';

/**
 * Format tanggal standar Indonesia
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
 * Komponen Reusable: DetailSuratModal
 * E-Office BKSDA Jawa Tengah - Modul Anggota 3
 *
 * Modal dialog aksesibel untuk menampilkan rincian komprehensif data surat.
 * Memenuhi kriteria WCAG:
 * - Menangani tombol Escape keyboard
 * - Menjebak scrolling body saat modal terbuka
 * - role="dialog" & aria-modal="true"
 * - Tombol tutup ramah screen-reader
 *
 * @param {object} props
 * @param {object|null} props.surat - Objek data surat yang akan ditampilkan
 * @param {'masuk'|'keluar'} [props.type='masuk'] - Tipe surat
 * @param {Function} props.onClose - Callback menutup modal: () => void
 */
export default function DetailSuratModal({
  surat,
  type = 'masuk',
  onClose,
}) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  const isOpen = Boolean(surat);
  const isMasuk = type === 'masuk';

  // Listener tombol Escape & Kunci scroll latar belakang
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    // Mencegah scroll body saat modal aktif
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);

    // Otomatis fokus ke tombol tutup untuk keyboard user
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !surat) return null;

  const statusMeta = getStatusBadge(surat.status);
  const sifatMeta = getSifatBadge(surat.sifat);
  const StatusIcon = statusMeta.icon;
  const pihakTitle = isMasuk ? 'Pengirim Surat' : 'Tujuan Surat';
  const pihakValue = isMasuk ? surat.pengirim : surat.tujuan;

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(e) => {
        // Klik di luar konten modal untuk menutup
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-modal-title"
        aria-describedby="detail-modal-desc"
      >
        {/* Header Modal */}
        <header className="modal-header">
          <div className="modal-header-info">
            <span className="modal-type-chip">
              {isMasuk ? 'Surat Masuk BKSDA' : 'Surat Keluar BKSDA'}
            </span>
            <h2 id="detail-modal-title" className="modal-title">
              Rincian Dokumen Persuratan
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="modal-btn-close"
            onClick={onClose}
            aria-label="Tutup jendela rincian surat"
            title="Tutup (Esc)"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        {/* Konten Rincian Modal */}
        <div className="modal-body" id="detail-modal-desc">
          {/* Banner Status & Nomor Surat */}
          <div className="modal-banner">
            <div className="modal-banner-nomor">
              <span className="banner-label">Nomor Registrasi:</span>
              <code className="banner-code">{surat.nomor_surat}</code>
            </div>
            <div className="modal-banner-badges">
              {surat.kategori && (
                <span className="badge-kategori">{surat.kategori}</span>
              )}
              <span className={sifatMeta.className}>{sifatMeta.label}</span>
              <span className={statusMeta.className}>
                <StatusIcon size={12} aria-hidden="true" />
                <span>{statusMeta.label}</span>
              </span>
            </div>
          </div>

          {/* Perihal Surat */}
          <div className="modal-section">
            <h3 className="section-label">Perihal:</h3>
            <p className="modal-perihal-text">{surat.perihal}</p>
          </div>

          {/* Grid Informasi Metadata */}
          <div className="modal-info-grid">
            <div className="modal-info-item">
              <div className="info-icon-wrapper">
                {isMasuk ? (
                  <Building2 size={18} aria-hidden="true" />
                ) : (
                  <Send size={18} aria-hidden="true" />
                )}
              </div>
              <div className="info-details">
                <span className="info-label">{pihakTitle}</span>
                <strong className="info-value">{pihakValue || '-'}</strong>
              </div>
            </div>

            <div className="modal-info-item">
              <div className="info-icon-wrapper">
                <Calendar size={18} aria-hidden="true" />
              </div>
              <div className="info-details">
                <span className="info-label">Tanggal Surat</span>
                <span className="info-value">{formatDateIndo(surat.tanggal_surat)}</span>
              </div>
            </div>

            {isMasuk && surat.tanggal_terima && (
              <div className="modal-info-item">
                <div className="info-icon-wrapper">
                  <Clock size={18} aria-hidden="true" />
                </div>
                <div className="info-details">
                  <span className="info-label">Tanggal Diterima</span>
                  <span className="info-value">{formatDateIndo(surat.tanggal_terima)}</span>
                </div>
              </div>
            )}

            <div className="modal-info-item">
              <div className="info-icon-wrapper">
                <FileCheck size={18} aria-hidden="true" />
              </div>
              <div className="info-details">
                <span className="info-label">Tingkat Urgensi / Sifat</span>
                <span className="info-value">{surat.sifat || 'Biasa'}</span>
              </div>
            </div>
          </div>

          {/* Ringkasan Isi Surat */}
          <div className="modal-section modal-summary-box">
            <div className="summary-header">
              <FileText size={16} aria-hidden="true" />
              <h3 className="section-label">Ringkasan Isi Surat:</h3>
            </div>
            <p className="summary-content">
              {surat.ringkasan || 'Tidak ada keterangan ringkasan untuk surat ini.'}
            </p>
          </div>

          {/* Berkas Lampiran / File Dokumen */}
          {surat.file_url ? (
            <div className="modal-attachment-card">
              <div className="attachment-left">
                <div className="file-icon-box">
                  <FileText size={24} aria-hidden="true" />
                </div>
                <div>
                  <h4 className="attachment-filename">
                    {surat.file_url.split('/').pop() || 'surat-dokumen.pdf'}
                  </h4>
                  <span className="attachment-size">Dokumen PDF Resmi • Terarsip Digital</span>
                </div>
              </div>
              <a
                href={surat.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-download-attachment"
              >
                <Download size={15} aria-hidden="true" />
                <span>Unduh / Buka</span>
              </a>
            </div>
          ) : (
            <div className="modal-attachment-empty">
              <span>Tidak ada berkas digital lampiran yang terunggah.</span>
            </div>
          )}
        </div>

        {/* Footer Modal Aksi */}
        <footer className="modal-footer">
          <div className="modal-footer-left">
            {isMasuk && (
              <Link
                to="/disposisi"
                className="btn-footer-link"
                title="Lanjutkan disposisi pejabat untuk surat ini"
              >
                <Share2 size={15} aria-hidden="true" />
                <span>Proses Disposisi</span>
              </Link>
            )}
            <button
              type="button"
              className="btn-footer-secondary"
              onClick={() => window.print()}
              title="Cetak lembar rincian surat"
            >
              <Printer size={15} aria-hidden="true" />
              <span>Cetak Ringkasan</span>
            </button>
          </div>

          <button
            type="button"
            className="btn-footer-primary"
            onClick={onClose}
          >
            Tutup
          </button>
        </footer>
      </div>
    </div>
  );
}
