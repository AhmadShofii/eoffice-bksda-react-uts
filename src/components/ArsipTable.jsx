import React from 'react';
import {
  Calendar,
  FolderArchive,
  FileText,
  MapPin,
  Download,
  Eye,
  FileCheck,
  HardDrive,
  ExternalLink,
} from 'lucide-react';

/**
 * Format tanggal standar Indonesia (contoh: "12 Sep 2026")
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
 * Komponen Reusable: ArsipTable
 * E-Office BKSDA Jawa Tengah - Modul Anggota 4 (Disposisi & Arsip)
 *
 * Menampilkan repositori arsip dokumen resmi dalam format tabel semantik HTML5.
 * Dilengkapi dengan informasi kode klasifikasi arsip, lokasi penyimpanan fisik,
 * berkas digital, dan fitur interaktif detail dokumen.
 *
 * @param {object} props
 * @param {Array} props.data - Daftar dokumen arsip (array of objects)
 * @param {Function} props.onDetail - Callback saat tombol 'Lihat Detail' diklik: (item) => void
 * @param {string} [props.caption] - Caption aksesibel untuk pembaca layar (WCAG)
 */
export default function ArsipTable({
  data = [],
  onDetail,
  caption = 'Daftar Arsip Dokumen Resmi BKSDA Jawa Tengah',
}) {
  return (
    <div
      className="table-responsive-wrapper"
      tabIndex={0}
      role="region"
      aria-label={`${caption} (Gunakan tombol panah untuk menggulir jika layar sempit)`}
    >
      <table className="arsip-data-table">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col" className="th-center" style={{ width: '50px' }}>No.</th>
            <th scope="col" style={{ minWidth: '180px' }}>Kode & Nomor Surat</th>
            <th scope="col" style={{ minWidth: '280px' }}>Judul Dokumen Arsip</th>
            <th scope="col" style={{ minWidth: '150px' }}>Kategori</th>
            <th scope="col" style={{ minWidth: '130px' }}>Tgl. Arsip</th>
            <th scope="col" style={{ minWidth: '200px' }}>Lokasi Fisik (Rak)</th>
            <th scope="col" style={{ minWidth: '110px' }}>Ukuran</th>
            <th scope="col" className="th-center" style={{ width: '120px' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id} className="arsip-table-row">
              {/* Kolom Nomor Urut */}
              <td className="td-center td-index">
                <span className="index-circle">{index + 1}</span>
              </td>

              {/* Kolom Kode Klasifikasi & Nomor Surat Terkait */}
              <td className="td-arsip-kode">
                <div className="arsip-kode-wrap">
                  <code className="arsip-code-badge">{item.kode_klasifikasi}</code>
                  {item.nomor_surat && (
                    <span className="arsip-sub-surat" title="Nomor Surat Referensi">
                      Ref: {item.nomor_surat}
                    </span>
                  )}
                </div>
              </td>

              {/* Kolom Judul Dokumen */}
              <td className="td-arsip-judul">
                <div className="arsip-title-text" title={item.judul}>
                  {item.judul}
                </div>
                <div className="arsip-file-indicator">
                  <FileText size={12} className="arsip-file-icon" aria-hidden="true" />
                  <span>Format: Dokumen PDF Resmi</span>
                </div>
              </td>

              {/* Kolom Kategori */}
              <td className="td-arsip-kategori">
                <span className="badge-kategori badge-kategori--arsip">
                  {item.kategori || 'Umum'}
                </span>
              </td>

              {/* Kolom Tanggal Pengarsipan */}
              <td className="td-arsip-tanggal">
                <div className="arsip-date-cell">
                  <Calendar size={13} className="arsip-date-icon" aria-hidden="true" />
                  <span>{formatDateIndo(item.tanggal_arsip)}</span>
                </div>
              </td>

              {/* Kolom Lokasi Fisik Penyimpanan */}
              <td className="td-arsip-lokasi">
                <div className="arsip-lokasi-badge" title="Lokasi penyimpanan fisik lemari/rak arsip BKSDA">
                  <MapPin size={13} className="arsip-map-icon" aria-hidden="true" />
                  <span>{item.lokasi_fisik || 'Ruang Arsip Pusat'}</span>
                </div>
              </td>

              {/* Kolom Ukuran Berkas */}
              <td className="td-arsip-ukuran">
                <span className="arsip-filesize-pill">
                  <HardDrive size={11} aria-hidden="true" />
                  {item.ukuran_file || 'PDF'}
                </span>
              </td>

              {/* Kolom Aksi */}
              <td className="td-center td-actions">
                <button
                  type="button"
                  className="btn-arsip-action"
                  onClick={() => onDetail && onDetail(item)}
                  aria-label={`Lihat rincian dokumen arsip ${item.kode_klasifikasi}`}
                  title="Lihat rincian lengkap dokumen dan unduh berkas"
                >
                  <Eye size={14} aria-hidden="true" />
                  <span>Detail</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
