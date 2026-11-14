import React from 'react';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  FileCheck,
  Send,
  FileText,
  HelpCircle,
} from 'lucide-react';

/**
 * Helper: Pemetaan status disposisi dan dokumen resmi BKSDA Jawa Tengah
 * Menghasilkan metadata label, ikon, dan class CSS warna.
 *
 * @param {string} status - Nilai status (contoh: 'menunggu', 'dalam_proses', 'selesai')
 * @returns {{ label: string, className: string, icon: React.ElementType, description: string }}
 */
export function getStatusMeta(status) {
  const norm = (status || '').toLowerCase().trim();

  switch (norm) {
    // Status Modul Disposisi (Anggota 4)
    case 'menunggu':
    case 'menunggu_tindak_lanjut':
      return {
        label: 'Menunggu Tindak Lanjut',
        className: 'badge-status badge-status--amber',
        icon: Clock,
        description: 'Disposisi telah diterbitkan dan menunggu respons awal dari pejabat penerima.',
      };

    case 'dalam_proses':
    case 'proses':
    case 'sedang_diproses':
      return {
        label: 'Dalam Proses',
        className: 'badge-status badge-status--blue',
        icon: AlertCircle,
        description: 'Tindak lanjut disposisi sedang dilaksanakan oleh regu atau staf terkait.',
      };

    case 'selesai':
    case 'tuntas':
      return {
        label: 'Selesai',
        className: 'badge-status badge-status--emerald',
        icon: CheckCircle2,
        description: 'Seluruh instruksi disposisi telah diselesaikan dan dilaporkan.',
      };

    case 'dikembalikan':
    case 'ditolak':
      return {
        label: 'Dikembalikan',
        className: 'badge-status badge-status--rose',
        icon: AlertTriangle,
        description: 'Disposisi dikembalikan kepada pimpinan untuk perbaikan atau revisi instruksi.',
      };

    // Status Persuratan (Sinkronisasi dengan Modul Anggota 3)
    case 'menunggu_disposisi':
      return {
        label: 'Menunggu Disposisi',
        className: 'badge-status badge-status--amber',
        icon: Clock,
        description: 'Surat masuk siap ditelaah pimpinan untuk diterbitkan lembar disposisi.',
      };

    case 'sudah_disposisi':
      return {
        label: 'Sudah Disposisi',
        className: 'badge-status badge-status--emerald',
        icon: CheckCircle2,
        description: 'Lembar disposisi telah berhasil dibuat dan diteruskan ke bawahan.',
      };

    case 'draft':
      return {
        label: 'Draf Surat',
        className: 'badge-status badge-status--slate',
        icon: FileText,
        description: 'Konsep surat dalam penyusunan draf awal.',
      };

    case 'diverifikasi':
      return {
        label: 'Diverifikasi',
        className: 'badge-status badge-status--blue',
        icon: FileCheck,
        description: 'Dokumen persuratan telah disetujui verifikator.',
      };

    case 'terkirim':
      return {
        label: 'Sudah Terkirim',
        className: 'badge-status badge-status--emerald',
        icon: Send,
        description: 'Surat resmi telah dikirim ke instansi tujuan.',
      };

    default:
      return {
        label: status ? status.replace(/_/g, ' ') : 'Tidak Diketahui',
        className: 'badge-status badge-status--slate',
        icon: HelpCircle,
        description: 'Status persuratan atau dokumen.',
      };
  }
}

/**
 * Komponen Reusable: StatusBadge
 * E-Office BKSDA Jawa Tengah - Modul Anggota 4 (Disposisi & Arsip)
 *
 * Menampilkan label status dinamis dengan ikon dan palet warna semantik.
 * Memenuhi kriteria aksesibilitas WCAG:
 * - Menggunakan role="status" dan aria-label informatif
 * - Kontras warna tinggi dan tipografi jelas
 *
 * @param {object} props
 * @param {string} props.status - Kode status (menunggu, dalam_proses, selesai, dikembalikan, dll.)
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Ukuran badge
 * @param {boolean} [props.showIcon=true] - Menampilkan ikon di sebelah kiri teks
 * @param {string} [props.customLabel] - Teks pengganti label default jika diinginkan
 * @param {string} [props.className=''] - Class CSS tambahan
 */
export default function StatusBadge({
  status,
  size = 'md',
  showIcon = true,
  customLabel,
  className = '',
}) {
  const meta = getStatusMeta(status);
  const IconComponent = meta.icon;
  const label = customLabel || meta.label;

  // Ukuran ikon berdasarkan prop size
  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;
  const sizeClass = size === 'sm' ? 'badge-status--sm' : size === 'lg' ? 'badge-status--lg' : '';

  return (
    <span
      className={`${meta.className} ${sizeClass} ${className}`.trim()}
      role="status"
      aria-label={`Status: ${label}`}
      title={meta.description}
    >
      {showIcon && (
        <IconComponent
          size={iconSize}
          className="badge-status-icon"
          aria-hidden="true"
        />
      )}
      <span className="badge-status-text">{label}</span>
    </span>
  );
}
