import React from 'react';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  PlayCircle,
  RotateCcw,
  AlertTriangle,
  Flag,
  ArrowRight,
  Eye,
  CheckSquare,
} from 'lucide-react';

/**
 * Format tanggal standar Indonesia (contoh: "20 Nov 2026")
 * @param {string} dateStr
 * @returns {string}
 */
function formatDateIndo(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

/**
 * Menghitung selisih hari batas waktu penugasan untuk indikator urgensi
 * @param {string} deadlineStr
 * @param {string} status
 * @returns {{ label: string, className: string, isOverdue?: boolean, isWarning?: boolean } | null}
 */
function getDeadlineStatus(deadlineStr, status) {
  if (!deadlineStr) return null;
  if (status === 'selesai') {
    return {
      label: 'Tugas Selesai',
      className: 'task-deadline-badge task-deadline-badge--completed',
    };
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(deadlineStr);
    deadline.setHours(0, 0, 0, 0);

    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        label: `Terlewat ${Math.abs(diffDays)} Hari`,
        className: 'task-deadline-badge task-deadline-badge--overdue',
        isOverdue: true,
      };
    }
    if (diffDays === 0) {
      return {
        label: 'Hari Ini (Batas Akhir)',
        className: 'task-deadline-badge task-deadline-badge--warning',
        isWarning: true,
      };
    }
    if (diffDays <= 3) {
      return {
        label: `Sisa ${diffDays} Hari`,
        className: 'task-deadline-badge task-deadline-badge--warning',
        isWarning: true,
      };
    }
    return {
      label: `Sisa ${diffDays} Hari`,
      className: 'task-deadline-badge task-deadline-badge--normal',
    };
  } catch {
    return null;
  }
}

/**
 * Metadata status tugas: label, icon, className, dan estimasi progress
 * @param {string} status
 */
export function getTaskStatusMeta(status) {
  const norm = (status || '').toLowerCase().trim();

  switch (norm) {
    case 'belum_dikerjakan':
    case 'pending':
      return {
        label: 'Belum Dikerjakan',
        badgeClass: 'task-status-pill task-status-pill--pending',
        icon: Clock,
        progress: 0,
        actionLabel: 'Mulai Kerjakan',
        actionNext: 'proses',
        actionIcon: PlayCircle,
      };
    case 'proses':
    case 'dalam_proses':
    case 'sedang_diproses':
      return {
        label: 'Dalam Proses',
        badgeClass: 'task-status-pill task-status-pill--process',
        icon: PlayCircle,
        progress: 50,
        actionLabel: 'Tandai Selesai',
        actionNext: 'selesai',
        actionIcon: CheckCircle2,
      };
    case 'selesai':
    case 'tuntas':
      return {
        label: 'Selesai',
        badgeClass: 'task-status-pill task-status-pill--completed',
        icon: CheckCircle2,
        progress: 100,
        actionLabel: 'Buka Kembali',
        actionNext: 'proses',
        actionIcon: RotateCcw,
      };
    default:
      return {
        label: status ? status.replace(/_/g, ' ') : 'Tidak Diketahui',
        badgeClass: 'task-status-pill task-status-pill--pending',
        icon: Clock,
        progress: 0,
        actionLabel: 'Ubah Status',
        actionNext: 'proses',
        actionIcon: ArrowRight,
      };
  }
}

/**
 * Metadata prioritas tugas
 * @param {string} prioritas
 */
export function getPriorityMeta(prioritas) {
  const norm = (prioritas || '').toLowerCase().trim();
  switch (norm) {
    case 'tinggi':
      return {
        label: 'Prioritas Tinggi',
        badgeClass: 'task-priority-pill task-priority-pill--high',
        icon: AlertTriangle,
      };
    case 'sedang':
      return {
        label: 'Prioritas Sedang',
        badgeClass: 'task-priority-pill task-priority-pill--medium',
        icon: Flag,
      };
    case 'rendah':
      return {
        label: 'Prioritas Rendah',
        badgeClass: 'task-priority-pill task-priority-pill--low',
        icon: Flag,
      };
    default:
      return {
        label: prioritas || 'Normal',
        badgeClass: 'task-priority-pill task-priority-pill--medium',
        icon: Flag,
      };
  }
}

/**
 * Komponen Reusable: TaskCard
 * E-Office BKSDA Jawa Tengah - Modul Anggota 5 (Manajemen Tugas)
 *
 * Menampilkan kartu penugasan pegawai dengan informasi komprehensif:
 * - Status tugas (belum dikerjakan, proses, selesai) dengan progress bar
 * - Indikator urgensi tenggat waktu (countdown hari sisa / terlewat)
 * - Badge prioritas (Tinggi, Sedang, Rendah)
 * - Tombol aksi cepat untuk memajukan status (quick status action)
 * - Tombol detail untuk melihat data lengkap penugasan
 * - Memenuhi WCAG 2.1 AA (Semantic HTML5, ARIA, Keyboard focusable)
 *
 * @param {object} props
 * @param {object} props.task - Objek data tugas
 * @param {Function} [props.onStatusChange] - Handler saat status diubah: (id, newStatus) => void
 * @param {Function} [props.onDetail] - Handler saat tombol detail diklik: (task) => void
 */
export default function TaskCard({ task, onStatusChange, onDetail }) {
  if (!task) return null;

  const statusMeta = getTaskStatusMeta(task.status);
  const priorityMeta = getPriorityMeta(task.prioritas);
  const deadlineInfo = getDeadlineStatus(task.tenggat_waktu, task.status);
  const StatusIcon = statusMeta.icon;
  const PriorityIcon = priorityMeta.icon;
  const ActionIcon = statusMeta.actionIcon;

  const handleQuickAction = (e) => {
    e.stopPropagation();
    if (onStatusChange && statusMeta.actionNext) {
      onStatusChange(task.id, statusMeta.actionNext);
    }
  };

  const handleDetailClick = () => {
    if (onDetail) {
      onDetail(task);
    }
  };

  return (
    <article
      className={`task-card ${task.status === 'selesai' ? 'task-card--completed' : ''}`}
      aria-labelledby={`task-title-${task.id}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleDetailClick();
        }
      }}
    >
      {/* Header Kartu: Prioritas & Status Badge */}
      <div className="task-card-header">
        <span
          className={priorityMeta.badgeClass}
          role="note"
          aria-label={`Tingkat Prioritas: ${priorityMeta.label}`}
        >
          <PriorityIcon size={13} aria-hidden="true" />
          <span>{task.prioritas || 'Sedang'}</span>
        </span>

        <span
          className={statusMeta.badgeClass}
          role="status"
          aria-label={`Status Tugas: ${statusMeta.label}`}
        >
          <StatusIcon size={13} aria-hidden="true" />
          <span>{statusMeta.label}</span>
        </span>
      </div>

      {/* Konten Utama Kartu */}
      <div className="task-card-body">
        <h3 id={`task-title-${task.id}`} className="task-card-title">
          {task.judul}
        </h3>

        <p className="task-card-desc">
          {task.deskripsi || 'Tidak ada deskripsi rinci untuk tugas ini.'}
        </p>

        {/* Progress Bar Indikator Status */}
        <div className="task-progress-wrapper">
          <div className="task-progress-labels">
            <span className="task-progress-text">Progres Pengerjaan</span>
            <span className="task-progress-percent">{statusMeta.progress}%</span>
          </div>
          <div
            className="task-progress-track"
            role="progressbar"
            aria-valuenow={statusMeta.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progres tugas: ${statusMeta.progress}%`}
          >
            <div
              className={`task-progress-fill task-progress-fill--${task.status || 'belum_dikerjakan'}`}
              style={{ width: `${statusMeta.progress}%` }}
            />
          </div>
        </div>

        {/* Metadata: Penanggung Jawab & Tenggat Waktu */}
        <div className="task-meta-grid">
          <div className="task-meta-item">
            <User size={14} className="task-meta-icon" aria-hidden="true" />
            <div className="task-meta-content">
              <span className="task-meta-label">Penanggung Jawab</span>
              <span className="task-meta-value">{task.penanggung_jawab || 'Belum Ditentukan'}</span>
            </div>
          </div>

          <div className="task-meta-item">
            <Calendar size={14} className="task-meta-icon" aria-hidden="true" />
            <div className="task-meta-content">
              <span className="task-meta-label">Tenggat Waktu</span>
              <span className="task-meta-value">{formatDateIndo(task.tenggat_waktu)}</span>
            </div>
          </div>
        </div>

        {/* Indikator Deadline Countdown */}
        {deadlineInfo && (
          <div className="task-deadline-container">
            <Clock size={13} aria-hidden="true" />
            <span className={deadlineInfo.className}>{deadlineInfo.label}</span>
          </div>
        )}
      </div>

      {/* Footer Kartu: Aksi Cepat & Detail */}
      <div className="task-card-footer">
        <button
          type="button"
          className="btn-task-detail"
          onClick={handleDetailClick}
          aria-label={`Lihat detail tugas: ${task.judul}`}
        >
          <Eye size={15} aria-hidden="true" />
          <span>Detail</span>
        </button>

        {onStatusChange && (
          <button
            type="button"
            className={`btn-task-action btn-task-action--${statusMeta.actionNext}`}
            onClick={handleQuickAction}
            aria-label={`${statusMeta.actionLabel} untuk tugas ${task.judul}`}
          >
            <ActionIcon size={15} aria-hidden="true" />
            <span>{statusMeta.actionLabel}</span>
          </button>
        )}
      </div>
    </article>
  );
}
