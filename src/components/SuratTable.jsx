import React from 'react';
import {
  Calendar,
  Building2,
  Send,
  Eye,
  FileText,
  FileCheck,
  Paperclip,
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
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

/**
 * Komponen Reusable: SuratTable
 * E-Office BKSDA Jawa Tengah - Modul Anggota 3
 *
 * Menampilkan data surat masuk atau keluar dalam bentuk tabel semantik HTML5.
 * Dilengkapi dengan scroll horizontal responsif, keyboard accessibility,
 * dan formatting status/sifat visual.
 *
 * @param {object} props
 * @param {Array} props.data - Daftar surat (array of objects)
 * @param {'masuk'|'keluar'} [props.type='masuk'] - Tipe modul surat
 * @param {Function} props.onDetail - Callback saat tombol 'Lihat Detail' diklik: (item) => void
 * @param {string} [props.caption] - Teks caption tabel untuk pembaca layar (a11y)
 */
export default function SuratTable({
  data = [],
  type = 'masuk',
  onDetail,
  caption,
}) {
  const isMasuk = type === 'masuk';
  const pihakColumnTitle = isMasuk ? 'Pengirim' : 'Tujuan';
  const tableCaption = caption || (isMasuk ? 'Daftar Surat Masuk BKSDA Jawa Tengah' : 'Daftar Surat Keluar BKSDA Jawa Tengah');

  return (
    <div
      className="table-responsive-wrapper"
      tabIndex={0}
      role="region"
      aria-label={`${tableCaption} (Gunakan tombol panah untuk menggulir jika layar sempit)`}
    >
      <table className="surat-data-table">
        <caption className="sr-only">{tableCaption}</caption>
        <thead>
          <tr>
            <th scope="col" className="th-center" style={{ width: '56px' }}>No.</th>
            <th scope="col" style={{ minWidth: '190px' }}>Nomor & Tanggal</th>
            <th scope="col" style={{ minWidth: '220px' }}>{pihakColumnTitle}</th>
            <th scope="col" style={{ minWidth: '280px' }}>Perihal</th>
            <th scope="col" style={{ minWidth: '120px' }}>Sifat</th>
            <th scope="col" style={{ minWidth: '160px' }}>Status</th>
            <th scope="col" className="th-center" style={{ width: '120px' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const statusMeta = getStatusBadge(item.status);
            const sifatMeta = getSifatBadge(item.sifat);
            const StatusIcon = statusMeta.icon;
            const pihakValue = isMasuk ? item.pengirim : item.tujuan;

            return (
              <tr key={item.id} className="surat-table-row">
                {/* Kolom Nomor Urut */}
                <td className="td-center td-index">
                  <span className="index-circle">{index + 1}</span>
                </td>

                {/* Kolom Nomor Surat & Tanggal */}
                <td className="td-nomor-tanggal">
                  <div className="table-nomor-surat">
                    <code>{item.nomor_surat}</code>
                    {item.file_url && (
                      <span className="file-badge" title="Tersedia dokumen lampiran">
                        <Paperclip size={11} aria-hidden="true" /> PDF
                      </span>
                    )}
                  </div>
                  <div className="table-tanggal-row">
                    <Calendar size={13} aria-hidden="true" className="date-icon" />
                    <span>{formatDateIndo(item.tanggal_surat)}</span>
                    {isMasuk && item.tanggal_terima && (
                      <span className="text-terima-date">
                        (Diterima: {formatDateIndo(item.tanggal_terima)})
                      </span>
                    )}
                  </div>
                </td>

                {/* Kolom Pengirim / Tujuan */}
                <td className="td-pihak">
                  <div className="pihak-wrapper">
                    {isMasuk ? (
                      <Building2 size={15} aria-hidden="true" className="pihak-icon" />
                    ) : (
                      <Send size={15} aria-hidden="true" className="pihak-icon" />
                    )}
                    <span className="pihak-name">{pihakValue || '-'}</span>
                  </div>
                </td>

                {/* Kolom Perihal & Kategori */}
                <td className="td-perihal">
                  <div className="perihal-title">{item.perihal}</div>
                  <div className="perihal-tags">
                    {item.kategori && (
                      <span className="badge-kategori">{item.kategori}</span>
                    )}
                    {item.ringkasan && (
                      <span className="table-summary-preview" title={item.ringkasan}>
                        {item.ringkasan.length > 70
                          ? `${item.ringkasan.substring(0, 70)}...`
                          : item.ringkasan}
                      </span>
                    )}
                  </div>
                </td>

                {/* Kolom Sifat */}
                <td className="td-sifat">
                  <span className={sifatMeta.className}>{sifatMeta.label}</span>
                </td>

                {/* Kolom Status */}
                <td className="td-status">
                  <span className={statusMeta.className}>
                    <StatusIcon size={12} aria-hidden="true" />
                    <span>{statusMeta.label}</span>
                  </span>
                </td>

                {/* Kolom Aksi */}
                <td className="td-center td-actions">
                  <button
                    type="button"
                    className="btn-table-action"
                    onClick={() => onDetail && onDetail(item)}
                    aria-label={`Lihat rincian lengkap surat nomor ${item.nomor_surat}`}
                    title="Lihat Rincian Lengkap"
                  >
                    <Eye size={15} aria-hidden="true" />
                    <span>Detail</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
