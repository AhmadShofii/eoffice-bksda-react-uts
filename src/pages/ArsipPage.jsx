import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Archive,
  RefreshCw,
  AlertTriangle,
  Filter,
  Search,
  RotateCcw,
  FolderArchive,
  FileText,
  FileCheck,
  Building,
  MapPin,
  HardDrive,
  Calendar,
  Layers,
} from 'lucide-react';
import { getAllArsip } from '../services/arsipService';
import {
  SearchBar,
  ArsipTable,
  DetailArsipModal,
  LoadingSkeleton,
} from '../components';

/**
 * Halaman: Arsip Dokumen
 * E-Office BKSDA Jawa Tengah
 *
 * Tanggung Jawab: Anggota 4 (Modul Disposisi & Arsip)
 *
 * Fitur Komprehensif:
 * 1. Pengambilan data arsip dinamis menggunakan Axios melalui arsipService (Mock / Backend API).
 * 2. Pencarian arsip real-time berdasarkan kode klasifikasi, judul dokumen, nomor surat, atau lokasi fisik rak.
 * 3. Filter multi-dimensi: Kategori arsip (Regulasi, Laporan Evaluasi, Berita Acara) & Lokasi fisik penyimpanan.
 * 4. Kartu metrik ringkasan repositori dokumen resmi BKSDA Jawa Tengah.
 * 5. Komponen ArsipTable semantik dengan scroll horizontal yang ramah aksesibilitas keyboard (WCAG).
 * 6. Modal dialog rincian dokumen arsip fisik dan pengunduhan berkas digital.
 * 7. Penanganan komprehensif: Loading shimmer skeleton, error handling dengan tombol coba lagi,
 *    serta empty state interaktif saat pencarian nihil.
 * 8. Desain responsif menggunakan CSS Grid & Flexbox untuk desktop, tablet, dan ponsel.
 */
export default function ArsipPage() {
  // State Utama Data & API
  const [arsipList, setArsipList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // State Filter & Pencarian
  const [searchQuery, setSearchQuery] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('all');
  const [lokasiFilter, setLokasiFilter] = useState('all');

  // State Modal Detail Arsip
  const [selectedArsip, setSelectedArsip] = useState(null);

  // Fetch Data Arsip dari Service API
  const fetchArsipData = useCallback(async (isManual = false) => {
    if (isManual) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await getAllArsip();
      setArsipList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error saat mengambil data arsip dokumen:', err);
      const friendlyMsg =
        err?.userFriendlyMessage ||
        err?.message ||
        'Gagal memuat repositori arsip dokumen dari server. Silakan periksa koneksi Anda.';
      setError(friendlyMsg);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchArsipData();
  }, [fetchArsipData]);

  // Ekstraksi kategori unik secara dinamis dari data arsip
  const availableCategories = useMemo(() => {
    const set = new Set();
    arsipList.forEach((item) => {
      if (item.kategori) set.add(item.kategori);
    });
    return Array.from(set);
  }, [arsipList]);

  // Ekstraksi lokasi fisik unik untuk filter rak
  const availableLocations = useMemo(() => {
    const set = new Set();
    arsipList.forEach((item) => {
      if (item.lokasi_fisik) set.add(item.lokasi_fisik);
    });
    return Array.from(set);
  }, [arsipList]);

  // Filter & Pencarian Data Arsip Real-Time (Client-Side Filtering)
  const filteredArsip = useMemo(() => {
    return arsipList.filter((item) => {
      // 1. Pencarian teks: kode_klasifikasi, judul, nomor_surat, atau lokasi_fisik
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchKode = item.kode_klasifikasi?.toLowerCase().includes(q);
        const matchJudul = item.judul?.toLowerCase().includes(q);
        const matchNomor = item.nomor_surat?.toLowerCase().includes(q);
        const matchLokasi = item.lokasi_fisik?.toLowerCase().includes(q);
        if (!matchKode && !matchJudul && !matchNomor && !matchLokasi) {
          return false;
        }
      }

      // 2. Filter Kategori
      if (kategoriFilter !== 'all' && item.kategori !== kategoriFilter) {
        return false;
      }

      // 3. Filter Lokasi Fisik
      if (lokasiFilter !== 'all' && item.lokasi_fisik !== lokasiFilter) {
        return false;
      }

      return true;
    });
  }, [arsipList, searchQuery, kategoriFilter, lokasiFilter]);

  // Statistik Ringkasan Repositori Arsip
  const stats = useMemo(() => {
    const total = arsipList.length;
    const regulasi = arsipList.filter((a) => (a.kategori || '').toLowerCase().includes('regulasi') || (a.kategori || '').toLowerCase().includes('keputusan')).length;
    const evaluasi = arsipList.filter((a) => (a.kategori || '').toLowerCase().includes('laporan')).length;
    const beritaAcara = arsipList.filter((a) => (a.kategori || '').toLowerCase().includes('berita')).length;
    return { total, regulasi, evaluasi, beritaAcara };
  }, [arsipList]);

  // Handler Reset Filter & Pencarian
  const handleResetFilters = () => {
    setSearchQuery('');
    setKategoriFilter('all');
    setLokasiFilter('all');
  };

  const isFilterActive =
    Boolean(searchQuery.trim()) ||
    kategoriFilter !== 'all' ||
    lokasiFilter !== 'all';

  return (
    <div className="page-container">
      {/* Header Halaman Semantik */}
      <header className="page-header">
        <div className="page-header-text">
          <div className="page-header-pretitle">
            <Archive size={16} aria-hidden="true" />
            <span>Pusat Repositori Digital & Manajemen Berkas Fisik</span>
          </div>
          <h1 className="page-title">Arsip Dokumen</h1>
          <p className="page-subtitle">
            Pusat penyimpanan, pengklasifikasian kode arsip nasional,
            dan pelacakan lokasi fisik berkas resmi Balai Konservasi Sumber Daya Alam Jawa Tengah.
          </p>
        </div>

        <div className="page-header-actions">
          <button
            type="button"
            className="btn btn-refresh"
            onClick={() => fetchArsipData(true)}
            disabled={loading || isRefreshing}
            aria-label="Segarkan repositori arsip dari server"
          >
            <RefreshCw
              size={16}
              className={isRefreshing ? 'spin-animation' : ''}
              aria-hidden="true"
            />
            <span>{isRefreshing ? 'Menyegarkan...' : 'Segarkan Arsip'}</span>
          </button>
        </div>
      </header>

      {/* Kartu Metrik Ringkasan Repositori Arsip */}
      <section className="surat-metrics-grid" aria-label="Ringkasan Repositori Arsip">
        <div
          className={`surat-metric-card surat-metric--total ${kategoriFilter === 'all' ? 'active-metric' : ''}`}
          onClick={() => setKategoriFilter('all')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setKategoriFilter('all')}
          aria-label="Tampilkan seluruh dokumen arsip"
        >
          <div className="metric-icon">
            <FolderArchive size={24} aria-hidden="true" />
          </div>
          <div className="metric-body">
            <span className="metric-label">Total Arsip Dokumen</span>
            <span className="metric-value">{stats.total}</span>
          </div>
        </div>

        <div
          className={`surat-metric-card surat-metric--menunggu ${kategoriFilter.toLowerCase().includes('regulasi') ? 'active-metric' : ''}`}
          onClick={() => setKategoriFilter('Keputusan / Regulasi')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setKategoriFilter('Keputusan / Regulasi')}
          aria-label="Filter arsip kategori regulasi dan SK"
        >
          <div className="metric-icon">
            <FileText size={24} aria-hidden="true" />
          </div>
          <div className="metric-body">
            <span className="metric-label">Regulasi & SK</span>
            <span className="metric-value">{stats.regulasi}</span>
          </div>
        </div>

        <div
          className={`surat-metric-card surat-metric--proses ${kategoriFilter.toLowerCase().includes('laporan') ? 'active-metric' : ''}`}
          onClick={() => setKategoriFilter('Laporan Evaluasi')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setKategoriFilter('Laporan Evaluasi')}
          aria-label="Filter arsip kategori laporan evaluasi"
        >
          <div className="metric-icon">
            <FileCheck size={24} aria-hidden="true" />
          </div>
          <div className="metric-body">
            <span className="metric-label">Laporan Evaluasi</span>
            <span className="metric-value">{stats.evaluasi}</span>
          </div>
        </div>

        <div
          className={`surat-metric-card surat-metric--selesai ${kategoriFilter.toLowerCase().includes('berita') ? 'active-metric' : ''}`}
          onClick={() => setKategoriFilter('Berita Acara')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setKategoriFilter('Berita Acara')}
          aria-label="Filter arsip kategori berita acara"
        >
          <div className="metric-icon">
            <Layers size={24} aria-hidden="true" />
          </div>
          <div className="metric-body">
            <span className="metric-label">Berita Acara</span>
            <span className="metric-value">{stats.beritaAcara}</span>
          </div>
        </div>
      </section>

      {/* Kontrol Pencarian & Filter Arsip */}
      <section className="surat-control-card" aria-label="Kontrol Pencarian dan Filter Arsip">
        <div className="control-row-primary">
          <div className="surat-search-stretch">
            <SearchBar
              id="search-arsip"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Cari kode klasifikasi, judul dokumen, nomor surat, atau lokasi rak..."
              label="Pencarian Dokumen Arsip"
              resultCount={filteredArsip.length}
            />
          </div>
        </div>

        {/* Baris Filter Kategori & Lokasi Fisik Rak */}
        <div className="control-row-filters">
          <div className="filter-group">
            <label htmlFor="filter-arsip-kategori" className="filter-label">
              <Filter size={14} aria-hidden="true" /> Kategori Arsip:
            </label>
            <select
              id="filter-arsip-kategori"
              value={kategoriFilter}
              onChange={(e) => setKategoriFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Semua Kategori ({arsipList.length})</option>
              {availableCategories.map((kat) => (
                <option key={kat} value={kat}>
                  {kat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-arsip-lokasi" className="filter-label">
              <MapPin size={14} aria-hidden="true" /> Lokasi Rak Fisik:
            </label>
            <select
              id="filter-arsip-lokasi"
              value={lokasiFilter}
              onChange={(e) => setLokasiFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Semua Lemari / Rak</option>
              {availableLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {isFilterActive && (
            <button
              type="button"
              className="btn-reset-filters"
              onClick={handleResetFilters}
              aria-label="Atur ulang filter arsip"
            >
              <RotateCcw size={13} aria-hidden="true" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </section>

      {/* Konten Utama Tabel Semantik */}
      <main id="main-content" aria-live="polite">
        {loading ? (
          <div className="arsip-loading-wrapper" aria-label="Memuat repositori arsip...">
            <div className="stats-grid">
              <LoadingSkeleton type="stat-card" count={4} />
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <LoadingSkeleton type="block" height="280px" count={1} />
            </div>
          </div>
        ) : error ? (
          <div className="error-state-card" role="alert">
            <div className="error-icon-wrapper">
              <AlertTriangle size={28} aria-hidden="true" />
            </div>
            <div className="error-content">
              <h2 className="error-title">Gagal Mengakses Repositori Arsip</h2>
              <p className="error-message">{error}</p>
              <div className="error-actions">
                <button
                  type="button"
                  className="btn btn-retry"
                  onClick={() => fetchArsipData(false)}
                >
                  <RefreshCw size={14} aria-hidden="true" />
                  <span>Coba Muat Ulang</span>
                </button>
              </div>
            </div>
          </div>
        ) : filteredArsip.length === 0 ? (
          <div className="empty-state-card" role="region" aria-label="Dokumen arsip tidak ditemukan">
            <div className="empty-state-icon">
              <Search size={36} aria-hidden="true" />
            </div>
            <h2 className="empty-state-title">
              {isFilterActive
                ? 'Tidak Ada Dokumen yang Cocok'
                : 'Repositori Arsip Kosong'}
            </h2>
            <p className="empty-state-desc">
              {isFilterActive
                ? 'Tidak ditemukan arsip dokumen yang sesuai dengan kata kunci atau filter kategori yang dipilih.'
                : 'Belum ada dokumen yang diarsipkan dalam repositori sistem e-office.'}
            </p>
            {isFilterActive && (
              <button
                type="button"
                className="btn-empty-reset"
                onClick={handleResetFilters}
              >
                <RotateCcw size={14} aria-hidden="true" />
                <span>Atur Ulang Pencarian & Filter</span>
              </button>
            )}
          </div>
        ) : (
          <section className="surat-table-outer" aria-label="Tabel Repositori Arsip Dokumen">
            <ArsipTable
              data={filteredArsip}
              onDetail={(item) => setSelectedArsip(item)}
            />
          </section>
        )}
      </main>

      {/* Modal Detail Arsip Dokumen */}
      <DetailArsipModal
        arsip={selectedArsip}
        onClose={() => setSelectedArsip(null)}
      />
    </div>
  );
}
