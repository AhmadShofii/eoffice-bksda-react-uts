import React from 'react';
import {
  Calendar,
  Building2,
  Send,
  FileText,
  Eye,
  Paperclip,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

/**
 * Format tanggal standar Indonesia (contoh: "16 Okt 2026")
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
 * Helper untuk mendapatkan badge status persuratan
 */
export function getStatusBadge(status) {
  switch (status) {
    case 'menunggu_disposisi':
      return {
        label: 'Menunggu Disposisi',
        className: 'badge-status badge-status--amber',
        icon: Clock,
      };
    case 'proses':
      return {
        label: 'Dalam Proses',
        className: 'badge-status badge-status--blue',
        icon: AlertCircle,
      };
    case 'sudah_disposisi':
      return {
        label: 'Sudah Disposisi',
        className: 'badge-status badge-status--emerald',
        icon: CheckCircle2,
      };
    case 'draft':
      return {
        label: 'Draf Surat',
        className: 'badge-status badge-status--slate',
        icon: Clock,
      };
    case 'diverifikasi':
      return {
        label: 'Diverifikasi',
        className: 'badge-status badge-status--blue',
        icon: FileCheck,
      };
    case 'terkirim':
      return {
        label: 'Sudah Terkirim',
        className: 'badge-status badge-status--emerald',
        icon: CheckCircle2,
      };
    default:
      return {
        label: status || 'Status',
        className: 'badge-status badge-status--slate',
        icon: Clock,
      };
  }
}

/**
 * Helper untuk mendapatkan badge sifat surat
 */
export function getSifatBadge(sifat) {
  const norm = (sifat || '').toLowerCase();
  if (norm.includes('sangat')) {
    return { label: sifat, className: 'badge-sifat badge-sifat--rose' };
  }
  if (norm.includes('segera')) {
    return { label: sifat, className: 'badge-sifat badge-sifat--amber' };
  }
  if (norm.includes('penting')) {
    return { label: sifat, className: 'badge-sifat badge-sifat--purple' };
  }
  return { label: sifat || 'Biasa', className: 'badge-sifat badge-sifat--neutral' };
}

/**
 * Komponen Reusable: SuratCard
 * E-Office BKSDA Jawa Tengah - Modul Anggota 3
 *
 * Menampilkan data surat secara ringkas dalam format kartu responsif.
 * Sangat optimal untuk tampilan mobile (< 768px) atau mode tampilan grid.
 *
 * @param {object} props
 * @param {object} props.surat - Objek data surat (surat masuk atau surat keluar)
 * @param {'masuk'|'keluar'} [props.type='masuk'] - Tipe surat
 * @param {Function} props.onDetail - Callback saat tombol detail diklik: (surat) => void
 */
export default function SuratCard({
  surat,
  type = 'masuk',
  onDetail,
}) {
  if (!surat) return null;

  const isMasuk = type === 'masuk';
  const pihakLabel = isMasuk ? 'Pengirim' : 'Tujuan';
  const pihakValue = isMasuk ? surat.pengirim : surat.tujuan;
  const statusMeta = getStatusBadge(surat.status);
  const sifatMeta = getSifatBadge(surat.sifat);
  const StatusIcon = statusMeta.icon;

  return (
    <article
      className="surat-card-item"
      aria-labelledby={`surat-card-title-${surat.id}`}
    >
      {/* Header Kartu: Kategori & Status Badges */}
      <header className="surat-card-header">
        <div className="surat-card-tags">
          {surat.kategori && (
            <span className="badge-kategori">{surat.kategori}</span>
          )}
          <span className={sifatMeta.className}>{sifatMeta.label}</span>
        </div>
        <span className={statusMeta.className}>
          <StatusIcon size={12} aria-hidden="true" />
          <span>{statusMeta.label}</span>
        </span>
      </header>

      {/* Konten Utama Kartu */}
      <div className="surat-card-body">
        <h3
          id={`surat-card-title-${surat.id}`}
          className="surat-card-title"
          title={surat.perihal}
        >
          {surat.perihal}
        </h3>

        <div className="surat-card-nomor">
          <span className="surat-card-nomor-label">No. Surat:</span>
          <code className="surat-card-nomor-code">{surat.nomor_surat}</code>
        </div>

        {/* Info Meta Pihak & Tanggal */}
        <div className="surat-card-meta-list">
          <div className="surat-card-meta-item">
            {isMasuk ? (
              <Building2 size={15} className="meta-icon" aria-hidden="true" />
            ) : (
              <Send size={15} className="meta-icon" aria-hidden="true" />
            )}
            <div className="meta-text">
              <span className="meta-label">{pihakLabel}:</span>
              <strong className="meta-val">{pihakValue || '-'}</strong>
            </div>
          </div>

          <div className="surat-card-meta-item">
            <Calendar size={15} className="meta-icon" aria-hidden="true" />
            <div className="meta-text">
              <span className="meta-label">Tgl Surat:</span>
              <span className="meta-val">{formatDateIndo(surat.tanggal_surat)}</span>
              {isMasuk && surat.tanggal_terima && (
                <span className="meta-received">
                  (Diterima: {formatDateIndo(surat.tanggal_terima)})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Cuplikan Ringkasan Surat */}
        {surat.ringkasan && (
          <p className="surat-card-summary">
            {surat.ringkasan}
          </p>
        )}
      </div>

      {/* Footer Kartu & Aksi */}
      <footer className="surat-card-footer">
        {surat.file_url ? (
          <span className="surat-card-attachment-indicator" title="Dokumen lampiran tersedia">
            <Paperclip size={13} aria-hidden="true" /> PDF Tersedia
          </span>
        ) : (
          <span className="surat-card-attachment-indicator text-muted">
            Tanpa Lampiran
          </span>
        )}

        <button
          type="button"
          className="btn-card-detail"
          onClick={() => onDetail && onDetail(surat)}
          aria-label={`Buka detail surat nomor ${surat.nomor_surat}`}
        >
          <Eye size={15} aria-hidden="true" />
          <span>Lihat Detail</span>
        </button>
      </footer>
    </article>
  );
}
