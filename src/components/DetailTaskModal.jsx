import React, { useEffect } from 'react';
import {
  X,
  CheckSquare,
  Calendar,
  Clock,
  User,
  AlertTriangle,
  Flag,
  FileText,
  PlayCircle,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Layers,
} from 'lucide-react';
import { getTaskStatusMeta, getPriorityMeta } from './TaskCard';

/**
 * Format tanggal standar Indonesia
 * @param {string} dateStr
 */
function formatDateIndo(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

/**
 * Komponen Reusable: DetailTaskModal
 * E-Office BKSDA Jawa Tengah - Modul Anggota 5 (Manajemen Tugas)
 *
 * Menampilkan lembar rincian tugas pegawai secara lengkap:
 * - Informasi judul, deskripsi instruksi, penanggung jawab, dan prioritas
 * - Progress bar dan alur status
 * - Pembaruan status langsung dari modal (belum dikerjakan, proses, selesai)
 * - Dukungan aksesibilitas keyboard (Escape to close, aria-modal, role="dialog")
 *
 * @param {object} props
 * @param {object|null} props.task - Data tugas yang dipilih
 * @param {boolean} props.isOpen - Status visibilitas modal
 * @param {Function} props.onClose - Callback saat modal ditutup: () => void
 * @param {Function} [props.onUpdateStatus] - Callback ubah status: (id, newStatus) => void
 */
export default function DetailTaskModal({
  task,
  isOpen,
  onClose,
  onUpdateStatus,
}) {
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  const statusMeta = getTaskStatusMeta(task.status);
  const priorityMeta = getPriorityMeta(task.prioritas);
  const StatusIcon = statusMeta.icon;
  const PriorityIcon = priorityMeta.icon;

  const handleStatusClick = (newStatus) => {
    if (onUpdateStatus) {
      onUpdateStatus(task.id, newStatus);
    }
  };

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="modal-dialog modal-dialog--md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-task-title"
      >
        {/* Header Modal */}
        <header className="modal-header">
          <div className="modal-header-icon-box">
            <CheckSquare size={22} className="modal-icon-brand" aria-hidden="true" />
          </div>
          <div className="modal-header-text">
            <h2 id="detail-task-title" className="modal-title">
              Rincian Penugasan Pegawai
            </h2>
            <p className="modal-subtitle">
              ID Tugas: #{task.id} &bull; Balai Konservasi Sumber Daya Alam Jawa Tengah
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Tutup rincian tugas"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        {/* Konten Modal */}
        <div className="modal-body-detail">
          {/* Status & Priority Ribbon */}
          <div className="detail-tags-ribbon">
            <span className={statusMeta.badgeClass} role="status">
              <StatusIcon size={14} aria-hidden="true" />
              <span>{statusMeta.label}</span>
            </span>

            <span className={priorityMeta.badgeClass}>
              <PriorityIcon size={14} aria-hidden="true" />
              <span>{priorityMeta.label}</span>
            </span>

            {task.kategori && (
              <span className="task-category-pill">
                <Layers size={13} aria-hidden="true" />
                <span>{task.kategori}</span>
              </span>
            )}
          </div>

          {/* Judul Tugas */}
          <h3 className="detail-task-heading">{task.judul}</h3>

          {/* Progress Section */}
          <div className="detail-progress-section">
            <div className="detail-progress-label-row">
              <span className="detail-progress-label">Tingkat Kemajuan (Progress)</span>
              <span className="detail-progress-value">{statusMeta.progress}%</span>
            </div>
            <div
              className="task-progress-track"
              role="progressbar"
              aria-valuenow={statusMeta.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={`task-progress-fill task-progress-fill--${task.status || 'belum_dikerjakan'}`}
                style={{ width: `${statusMeta.progress}%` }}
              />
            </div>
          </div>

          {/* Deskripsi Instruksi */}
          <div className="detail-info-block">
            <h4 className="detail-block-title">
              <FileText size={15} aria-hidden="true" />
              <span>Rincian Instruksi & Sasaran Tugas</span>
            </h4>
            <p className="detail-block-text">
              {task.deskripsi || 'Tidak ada deskripsi rinci untuk tugas ini.'}
            </p>
          </div>

          {/* Grid Informasi Metadata */}
          <div className="detail-meta-grid">
            <div className="detail-meta-card">
              <span className="detail-meta-sub">Penanggung Jawab</span>
              <div className="detail-meta-main">
                <User size={15} className="detail-meta-ico" aria-hidden="true" />
                <span className="detail-meta-strong">{task.penanggung_jawab || '-'}</span>
              </div>
            </div>

            <div className="detail-meta-card">
              <span className="detail-meta-sub">Tenggat Waktu</span>
              <div className="detail-meta-main">
                <Calendar size={15} className="detail-meta-ico" aria-hidden="true" />
                <span className="detail-meta-strong">{formatDateIndo(task.tenggat_waktu)}</span>
              </div>
            </div>
          </div>

          {/* Aksi Cepat Perubahan Status */}
          <div className="detail-status-switch">
            <h4 className="detail-block-title">
              <Sparkles size={15} aria-hidden="true" />
              <span>Perbarui Status Pengerjaan:</span>
            </h4>
            <div className="status-button-group">
              <button
                type="button"
                className={`btn-status-choice ${task.status === 'belum_dikerjakan' ? 'is-active' : ''}`}
                onClick={() => handleStatusClick('belum_dikerjakan')}
              >
                <Clock size={14} aria-hidden="true" />
                <span>Belum Dikerjakan</span>
              </button>

              <button
                type="button"
                className={`btn-status-choice btn-status-choice--process ${
                  task.status === 'proses' ? 'is-active' : ''
                }`}
                onClick={() => handleStatusClick('proses')}
              >
                <PlayCircle size={14} aria-hidden="true" />
                <span>Dalam Proses</span>
              </button>

              <button
                type="button"
                className={`btn-status-choice btn-status-choice--completed ${
                  task.status === 'selesai' ? 'is-active' : ''
                }`}
                onClick={() => handleStatusClick('selesai')}
              >
                <CheckCircle2 size={14} aria-hidden="true" />
                <span>Tandai Selesai</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <footer className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Tutup
          </button>
        </footer>
      </div>
    </div>
  );
}
