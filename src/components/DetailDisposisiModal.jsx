import React, { useEffect, useRef } from 'react';
import {
  X,
  Calendar,
  Share2,
  UserCheck,
  Users,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Printer,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * Format tanggal standar Indonesia (contoh: "Kamis, 25 Oktober 2026")
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
 * Komponen Reusable: DetailDisposisiModal
 * E-Office BKSDA Jawa Tengah - Modul Anggota 4
 *
 * Modal dialog untuk menampilkan lembar resmi disposisi pimpinan secara menyeluruh.
 * Dilengkapi dengan tombol pengubahan status tindak lanjut dan cetak lembar disposisi.
 *
 * @param {object} props
 * @param {object|null} props.disposisi - Data disposisi terpilih
 * @param {Function} props.onClose - Callback menutup modal: () => void
 * @param {Function} [props.onUpdateStatus] - Callback saat status diperbarui: (id, newStatus) => void
 */
export default function DetailDisposisiModal({
  disposisi,
  onClose,
  onUpdateStatus,
}) {
  const closeButtonRef = useRef(null);
  const isOpen = Boolean(disposisi);

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

  if (!isOpen || !disposisi) return null;

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
        className="modal-dialog modal-dialog--disposisi"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-disposisi-title"
        aria-describedby="detail-disposisi-desc"
      >
        {/* Header Modal */}
        <header className="modal-header">
          <div className="modal-header-info">
            <span className="modal-type-chip">
              Lembar Disposisi Resmi BKSDA Jawa Tengah
            </span>
            <h2 id="detail-disposisi-title" className="modal-title">
              Instruksi Tindak Lanjut Pimpinan
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="modal-btn-close"
            onClick={onClose}
            aria-label="Tutup lembar disposisi"
            title="Tutup (Esc)"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        {/* Konten Rincian Lembar Disposisi */}
        <div className="modal-body" id="detail-disposisi-desc">
          {/* Banner Surat & Status */}
          <div className="modal-banner">
            <div className="modal-banner-nomor">
              <span className="banner-label">Nomor Surat Masuk:</span>
              <code className="banner-code">{disposisi.nomor_surat}</code>
            </div>
            <StatusBadge status={disposisi.status} size="md" />
          </div>

          {/* Perihal Surat */}
          <section className="modal-section" aria-label="Perihal Surat">
            <span className="section-label">Perihal Dokumen:</span>
            <h3 className="modal-perihal-text">{disposisi.perihal}</h3>
          </section>

          {/* Alur Penugasan (Grid / Flex) */}
          <div className="disposisi-flow-banner">
            <div className="flow-step">
              <div className="flow-step-icon flow-step-icon--from">
                <UserCheck size={18} aria-hidden="true" />
              </div>
              <div className="flow-step-info">
                <span className="flow-step-label">Diterbitkan Oleh (Pimpinan)</span>
                <strong className="flow-step-val">{disposisi.pemberi_disposisi || 'Kepala Balai'}</strong>
              </div>
            </div>

            <ChevronRight size={22} className="flow-step-arrow" aria-hidden="true" />

            <div className="flow-step">
              <div className="flow-step-icon flow-step-icon--to">
                <Users size={18} aria-hidden="true" />
              </div>
              <div className="flow-step-info">
                <span className="flow-step-label">Diteruskan Kepada (Pelaksana)</span>
                <strong className="flow-step-val">{disposisi.penerima_disposisi || '-'}</strong>
              </div>
            </div>
          </div>

          {/* Kotak Instruksi Pimpinan */}
          <div className="modal-summary-box modal-summary-box--disposisi">
            <div className="summary-header">
              <FileText size={18} aria-hidden="true" />
              <strong>Instruksi & Arahan Khusus Pimpinan:</strong>
            </div>
            <div className="summary-content">
              {disposisi.instruksi || 'Tidak ada instruksi tertulis.'}
            </div>
            {disposisi.catatan && (
              <div className="disposisi-catatan-callout">
                <strong>Catatan Tambahan:</strong> {disposisi.catatan}
              </div>
            )}
          </div>

          {/* Grid Informasi Waktu & Batas Akhir */}
          <div className="modal-info-grid">
            <div className="modal-info-item">
              <div className="info-icon-wrapper">
                <Calendar size={18} aria-hidden="true" />
              </div>
              <div className="info-details">
                <span className="info-label">Batas Waktu Pelaksanaan</span>
                <strong className="info-value">{formatDateIndo(disposisi.batas_waktu)}</strong>
              </div>
            </div>

            <div className="modal-info-item">
              <div className="info-icon-wrapper">
                <Clock size={18} aria-hidden="true" />
              </div>
              <div className="info-details">
                <span className="info-label">Status Penanganan Saat Ini</span>
                <span className="info-value" style={{ textTransform: 'capitalize' }}>
                  {disposisi.status ? disposisi.status.replace(/_/g, ' ') : '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Aksi Ubah Status di dalam Modal */}
          {onUpdateStatus && (
            <div className="modal-status-update-section">
              <span className="section-label">Perbarui Status Pelaksanaan:</span>
              <div className="status-update-button-group">
                <button
                  type="button"
                  className={`btn-status-choice ${disposisi.status === 'menunggu' ? 'active' : ''}`}
                  onClick={() => onUpdateStatus(disposisi.id, 'menunggu')}
                >
                  <Clock size={14} aria-hidden="true" />
                  <span>Menunggu</span>
                </button>
                <button
                  type="button"
                  className={`btn-status-choice ${disposisi.status === 'dalam_proses' ? 'active' : ''}`}
                  onClick={() => onUpdateStatus(disposisi.id, 'dalam_proses')}
                >
                  <AlertCircle size={14} aria-hidden="true" />
                  <span>Dalam Proses</span>
                </button>
                <button
                  type="button"
                  className={`btn-status-choice ${disposisi.status === 'selesai' ? 'active' : ''}`}
                  onClick={() => onUpdateStatus(disposisi.id, 'selesai')}
                >
                  <CheckCircle2 size={14} aria-hidden="true" />
                  <span>Selesai</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <footer className="modal-footer">
          <div className="modal-footer-left">
            <button
              type="button"
              className="btn-footer-secondary"
              onClick={handlePrint}
              title="Cetak lembar disposisi resmi"
            >
              <Printer size={15} aria-hidden="true" />
              <span>Cetak Lembar Disposisi</span>
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
