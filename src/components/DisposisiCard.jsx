import React from 'react';
import {
  Calendar,
  Clock,
  UserCheck,
  Users,
  FileText,
  AlertCircle,
  Eye,
  CheckCircle2,
  Share2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * Format tanggal standar Indonesia (contoh: "25 Okt 2026")
 * @param {string} dateStr
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
 * Menghitung selisih hari batas waktu disposisi untuk indikator urgensi
 * @param {string} deadlineStr
 * @param {string} status
 */
function getDeadlineStatus(deadlineStr, status) {
  if (!deadlineStr) return null;
  if (status === 'selesai') {
    return { label: 'Tuntas', className: 'deadline-badge deadline-badge--completed' };
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
        className: 'deadline-badge deadline-badge--overdue',
        isOverdue: true,
      };
    }
    if (diffDays === 0) {
      return {
        label: 'Hari Ini (Batas Akhir)',
        className: 'deadline-badge deadline-badge--warning',
        isWarning: true,
      };
    }
    if (diffDays <= 3) {
      return {
        label: `Sisa ${diffDays} Hari`,
        className: 'deadline-badge deadline-badge--warning',
        isWarning: true,
      };
    }
    return {
      label: `Sisa ${diffDays} Hari`,
      className: 'deadline-badge deadline-badge--normal',
    };
  } catch {
    return null;
  }
}

/**
 * Komponen Reusable: DisposisiCard
 * E-Office BKSDA Jawa Tengah - Modul Anggota 4
 *
 * Menampilkan lembar disposisi surat dalam format kartu visual responsif.
 * Dilengkapi dengan alur instruksi pimpinan, batas waktu penyelesaian,
 * dan tombol aksi untuk melihat detail atau mengubah status.
 *
 * @param {object} props
 * @param {object} props.disposisi - Objek data disposisi
 * @param {Function} props.onDetail - Callback saat tombol 'Lihat Detail' diklik: (item) => void
 * @param {Function} [props.onUpdateStatus] - Callback saat status diubah langsung dari kartu: (id, newStatus) => void
 */
export default function DisposisiCard({
  disposisi,
  onDetail,
  onUpdateStatus,
}) {
  if (!disposisi) return null;

  const deadlineMeta = getDeadlineStatus(disposisi.batas_waktu, disposisi.status);

  return (
    <article
      className="disposisi-card-item"
      aria-labelledby={`disposisi-title-${disposisi.id}`}
    >
      {/* Header Kartu: Status Badge & Nomor Surat */}
      <header className="disposisi-card-header">
        <div className="disposisi-card-nomor">
          <Share2 size={15} className="disposisi-share-icon" aria-hidden="true" />
          <code className="disposisi-code">{disposisi.nomor_surat}</code>
        </div>
        <StatusBadge status={disposisi.status} size="sm" />
      </header>

      {/* Konten Utama */}
      <div className="disposisi-card-body">
        {/* Judul Perihal Surat Terkait */}
        <h3
          id={`disposisi-title-${disposisi.id}`}
          className="disposisi-card-perihal"
          title={disposisi.perihal}
        >
          {disposisi.perihal}
        </h3>

        {/* Alur Pemberi & Penerima Disposisi (Flexbox Alur Penugasan) */}
        <div className="disposisi-flow-box">
          <div className="disposisi-flow-node">
            <div className="flow-icon flow-icon--pemberi" title="Pemberi Disposisi">
              <UserCheck size={14} aria-hidden="true" />
            </div>
            <div className="flow-text">
              <span className="flow-label">Dari:</span>
              <strong className="flow-val">{disposisi.pemberi_disposisi || 'Pimpinan Balai'}</strong>
            </div>
          </div>

          <ChevronRight size={16} className="flow-separator-icon" aria-hidden="true" />

          <div className="disposisi-flow-node">
            <div className="flow-icon flow-icon--penerima" title="Penerima Disposisi">
              <Users size={14} aria-hidden="true" />
            </div>
            <div className="flow-text">
              <span className="flow-label">Tujuan Disposisi:</span>
              <strong className="flow-val">{disposisi.penerima_disposisi || '-'}</strong>
            </div>
          </div>
        </div>

        {/* Kotak Instruksi Pimpinan */}
        <div className="disposisi-instruksi-box">
          <div className="instruksi-header">
            <FileText size={14} className="instruksi-icon" aria-hidden="true" />
            <span className="instruksi-title">Instruksi Tindak Lanjut:</span>
          </div>
          <p className="instruksi-content">
            {disposisi.instruksi || 'Belum ada instruksi tertulis.'}
          </p>
          {disposisi.catatan && (
            <div className="instruksi-note">
              <strong>Catatan:</strong> {disposisi.catatan}
            </div>
          )}
        </div>

        {/* Metadata Batas Waktu */}
        <div className="disposisi-meta-row">
          <div className="disposisi-deadline-info">
            <Calendar size={14} className="meta-icon" aria-hidden="true" />
            <span className="deadline-label">Batas Waktu:</span>
            <span className="deadline-date">{formatDateIndo(disposisi.batas_waktu)}</span>
          </div>
          {deadlineMeta && (
            <span className={deadlineMeta.className} aria-label={`Status tenggat: ${deadlineMeta.label}`}>
              {deadlineMeta.isOverdue && <ShieldAlert size={12} aria-hidden="true" />}
              {deadlineMeta.label}
            </span>
          )}
        </div>
      </div>

      {/* Footer Kartu & Aksi Cepat */}
      <footer className="disposisi-card-footer">
        {onUpdateStatus && disposisi.status !== 'selesai' && (
          <div className="disposisi-quick-actions">
            {disposisi.status === 'menunggu' && (
              <button
                type="button"
                className="btn-quick-status btn-quick-status--process"
                onClick={() => onUpdateStatus(disposisi.id, 'dalam_proses')}
                title="Tandai sedang diproses"
              >
                <Clock size={13} aria-hidden="true" />
                <span>Proses</span>
              </button>
            )}
            <button
              type="button"
              className="btn-quick-status btn-quick-status--finish"
              onClick={() => onUpdateStatus(disposisi.id, 'selesai')}
              title="Tandai disposisi telah selesai dilaksanakan"
            >
              <CheckCircle2 size={13} aria-hidden="true" />
              <span>Selesai</span>
            </button>
          </div>
        )}

        <button
          type="button"
          className="btn-disposisi-detail"
          onClick={() => onDetail && onDetail(disposisi)}
          aria-label={`Buka detail lembar disposisi ${disposisi.nomor_surat}`}
        >
          <Eye size={15} aria-hidden="true" />
          <span>Detail Lembar</span>
        </button>
      </footer>
    </article>
  );
}
