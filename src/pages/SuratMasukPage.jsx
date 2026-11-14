import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Inbox,
  RefreshCw,
  AlertTriangle,
  Filter,
  LayoutGrid,
  Table as TableIcon,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Users,
} from 'lucide-react';
import { getAllSuratMasuk } from '../services/suratMasukService';
import {
  SearchBar,
  SuratTable,
  SuratCard,
  DetailSuratModal,
  LoadingSkeleton,
} from '../components';

/**
 * Halaman: Surat Masuk
 * E-Office BKSDA Jawa Tengah
 *
 * Tanggung Jawab: Anggota 3 (Modul Surat Masuk & Surat Keluar)
 *
 * Fitur Lengkap:
 * 1. Pengambilan data dinamis menggunakan Axios melalui suratMasukService.
 * 2. Pencarian real-time berdasarkan nomor surat, perihal, atau instansi pengirim.
 * 3. Filter multi-dimensi: Kategori (Undangan, Permohonan, dll), Status alur, dan Sifat urgensi.
 * 4. Mode tampilan ganda yang fleksibel: Tabel Semantik Responsif & Kartu Grid (SuratCard).
 * 5. Kartu metrik ringkasan status surat masuk harian.
 * 6. Modal detail surat yang aksesibel (WCAG, keyboard ESC listener, trap scroll).
 * 7. State UI komprehensif: Loading shimmer skeleton, error handling dengan tombol coba lagi,
 *    dan empty state interaktif saat pencarian nihil.
 */
export default function SuratMasukPage() {
  // State Utama Data & Integrasi API
  const [suratList, setSuratList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // State Filter & Pencarian
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sifatFilter, setSifatFilter] = useState('all');
  const [kategoriFilter, setKategoriFilter] = useState('all');

  // State Tampilan & Detail Modal
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [selectedSurat, setSelectedSurat] = useState(null);

  // Fungsi Fetch Data Surat Masuk dari API / Mock Service
  const fetchSuratMasuk = useCallback(async (isManual = false) => {
    if (isManual) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await getAllSuratMasuk();
      setSuratList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error saat mengambil data surat masuk:', err);
      const friendlyMsg =
        err?.userFriendlyMessage ||
        err?.message ||
        'Gagal memuat data surat masuk dari server. Silakan periksa koneksi Anda.';
      setError(friendlyMsg);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Fetch pertama saat komponen dimuat
  useEffect(() => {
    fetchSuratMasuk();
  }, [fetchSuratMasuk]);

  // Ekstraksi kategori unik secara dinamis dari data
  const availableCategories = useMemo(() => {
    const set = new Set();
    suratList.forEach((item) => {
      if (item.kategori) set.add(item.kategori);
    });
    return Array.from(set);
  }, [suratList]);

  // Filter & Pencarian Data Surat Masuk (Client-Side Filtering Realtime)
  const filteredSurat = useMemo(() => {
    return suratList.filter((item) => {
      // 1. Pencarian teks: nomor_surat, perihal, atau pengirim
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchNomor = item.nomor_surat?.toLowerCase().includes(q);
        const matchPerihal = item.perihal?.toLowerCase().includes(q);
        const matchPengirim = item.pengirim?.toLowerCase().includes(q);
        if (!matchNomor && !matchPerihal && !matchPengirim) {
          return false;
        }
      }

      // 2. Filter Status
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }

      // 3. Filter Sifat Surat
      if (sifatFilter !== 'all' && item.sifat !== sifatFilter) {
        return false;
      }

      // 4. Filter Kategori
      if (kategoriFilter !== 'all' && item.kategori !== kategoriFilter) {
        return false;
      }

      return true;
    });
  }, [suratList, searchQuery, statusFilter, sifatFilter, kategoriFilter]);

  // Statistik Ringkasan untuk Header Modul
  const stats = useMemo(() => {
    const total = suratList.length;
    const menunggu = suratList.filter((s) => s.status === 'menunggu_disposisi').length;
    const proses = suratList.filter((s) => s.status === 'proses').length;
    const sudah = suratList.filter((s) => s.status === 'sudah_disposisi').length;
    return { total, menunggu, proses, sudah };
  }, [suratList]);

  // Handler Reset Filter & Pencarian
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSifatFilter('all');
    setKategoriFilter('all');
  };

  const isFilterActive =
    Boolean(searchQuery.trim()) ||
    statusFilter !== 'all' ||
    sifatFilter !== 'all' ||
    kategoriFilter !== 'all';

  return (
    <div className="page-container">
      {/* Header Halaman */}
      <header className="page-header">
        <div>
          <div className="page-header-pretitle">
            <Inbox size={18} className="text-primary" aria-hidden="true" />
            <span>Tata Kelola Persuratan</span>
          </div>
          <h1 className="page-title">Surat Masuk</h1>
          <p className="page-subtitle">
            Pencatatan, monitoring penerimaan, dan koordinasi disposisi surat masuk BKSDA Jawa Tengah.
          </p>
        </div>

        <div className="page-header-actions">
          <span className="badge-author" title="Bagian modul yang dikerjakan oleh Anggota 3">
            <Users size={14} aria-hidden="true" /> Modul Anggota 3
          </span>

          <button
            type="button"
            className="btn-refresh"
            onClick={() => fetchSuratMasuk(true)}
            disabled={loading || isRefreshing}
            aria-label="Segarkan data surat masuk"
            title="Muat ulang data dari API"
          >
            <RefreshCw
              size={16}
              className={isRefreshing ? 'spin-animation' : ''}
              aria-hidden="true"
            />
            <span>{isRefreshing ? 'Memperbarui...' : 'Segarkan Data'}</span>
          </button>
        </div>
      </header>

      {/* Kartu Ringkasan Metrik Surat Masuk */}
      <section className="surat-metrics-grid" aria-label="Ringkasan Status Surat Masuk">
        <div className="surat-metric-card surat-metric--total">
          <div className="metric-icon">
            <FileText size={20} aria-hidden="true" />
          </div>
          <div className="metric-body">
            <span className="metric-label">Total Surat Masuk</span>
            <strong className="metric-value">{loading ? '...' : stats.total}</strong>
          </div>
        </div>

        <div className="surat-metric-card surat-metric--menunggu">
          <div className="metric-icon">
            <Clock size={20} aria-hidden="true" />
          </div>
          <div className="metric-body">
            <span className="metric-label">Menunggu Disposisi</span>
            <strong className="metric-value">{loading ? '...' : stats.menunggu}</strong>
          </div>
        </div>

        <div className="surat-metric-card surat-metric--proses">
          <div className="metric-icon">
            <AlertCircle size={20} aria-hidden="true" />
          </div>
          <div className="metric-body">
            <span className="metric-label">Dalam Proses</span>
            <strong className="metric-value">{loading ? '...' : stats.proses}</strong>
          </div>
        </div>

        <div className="surat-metric-card surat-metric--selesai">
          <div className="metric-icon">
            <CheckCircle2 size={20} aria-hidden="true" />
          </div>
          <div className="metric-body">
            <span className="metric-label">Sudah Disposisi</span>
            <strong className="metric-value">{loading ? '...' : stats.sudah}</strong>
          </div>
        </div>
      </section>

      {/* Panel Kontrol Pencarian, Filter, dan Mode Tampilan */}
      <section className="surat-control-card" aria-label="Kontrol Pencarian dan Penyaringan">
        <div className="control-row-primary">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            placeholder="Cari nomor surat, perihal, atau instansi pengirim..."
            label="Pencarian Surat Masuk"
            id="search-surat-masuk"
            resultCount={!loading && !error ? filteredSurat.length : undefined}
            className="surat-search-stretch"
          />

          <div className="view-mode-toggle" role="group" aria-label="Pilihan mode tampilan">
            <button
              type="button"
              className={`btn-toggle-view ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              aria-pressed={viewMode === 'table'}
              title="Tampilkan dalam bentuk Tabel"
            >
              <TableIcon size={16} aria-hidden="true" />
              <span className="toggle-label">Tabel</span>
            </button>
            <button
              type="button"
              className={`btn-toggle-view ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              aria-pressed={viewMode === 'cards'}
              title="Tampilkan dalam bentuk Kartu"
            >
              <LayoutGrid size={16} aria-hidden="true" />
              <span className="toggle-label">Kartu</span>
            </button>
          </div>
        </div>

        {/* Baris Filter Dropdown */}
        <div className="control-row-filters">
          <div className="filter-group">
            <label htmlFor="filter-status-masuk" className="filter-label">
              <Filter size={14} aria-hidden="true" /> Status:
            </label>
            <select
              id="filter-status-masuk"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Semua Status</option>
              <option value="menunggu_disposisi">Menunggu Disposisi</option>
              <option value="proses">Dalam Proses</option>
              <option value="sudah_disposisi">Sudah Disposisi</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-sifat-masuk" className="filter-label">
              Sifat Urgensi:
            </label>
            <select
              id="filter-sifat-masuk"
              value={sifatFilter}
              onChange={(e) => setSifatFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Semua Sifat</option>
              <option value="Biasa">Biasa</option>
              <option value="Penting">Penting</option>
              <option value="Segera">Segera</option>
              <option value="Sangat Segera">Sangat Segera</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-kategori-masuk" className="filter-label">
              Kategori:
            </label>
            <select
              id="filter-kategori-masuk"
              value={kategoriFilter}
              onChange={(e) => setKategoriFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Semua Kategori</option>
              {availableCategories.map((kat) => (
                <option key={kat} value={kat}>
                  {kat}
                </option>
              ))}
            </select>
          </div>

          {isFilterActive && (
            <button
              type="button"
              className="btn-reset-filters"
              onClick={handleResetFilters}
              title="Kembalikan semua filter ke kondisi semula"
            >
              <RotateCcw size={14} aria-hidden="true" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </section>

      {/* Konten Utama Data: Loading, Error, Empty State, atau List Surat */}
      <section className="surat-content-area" aria-label="Daftar Surat Masuk">
        {/* State 1: Loading Skeleton */}
        {loading && (
          <div className="surat-loading-container" role="status" aria-live="polite">
            <div className="skeleton-table-card">
              <LoadingSkeleton type="block" count={5} height="52px" className="mb-2" />
            </div>
          </div>
        )}

        {/* State 2: Error UI dengan Tombol Coba Lagi */}
        {!loading && error && (
          <div className="error-state-card" role="alert">
            <div className="error-icon-wrapper">
              <AlertTriangle size={24} aria-hidden="true" />
            </div>
            <div className="error-content">
              <h2 className="error-title">Gagal Mengambil Data Surat Masuk</h2>
              <p className="error-message">{error}</p>
              <div className="error-actions">
                <button
                  type="button"
                  className="btn-retry"
                  onClick={() => fetchSuratMasuk(false)}
                >
                  <RefreshCw size={15} aria-hidden="true" />
                  <span>Coba Lagi</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* State 3: Empty State (Data Kosong atau Hasil Pencarian Tidak Ditemukan) */}
        {!loading && !error && filteredSurat.length === 0 && (
          <div className="empty-state-card" role="status">
            <div className="empty-state-icon">
              <Inbox size={42} aria-hidden="true" />
            </div>
            <h2 className="empty-state-title">
              {isFilterActive
                ? 'Tidak Ada Surat Masuk yang Sesuai'
                : 'Belum Ada Surat Masuk'}
            </h2>
            <p className="empty-state-desc">
              {isFilterActive
                ? 'Tidak ditemukan data surat masuk dengan kata kunci atau filter yang Anda terapkan. Silakan coba sesuaikan kata kunci atau bersihkan filter.'
                : 'Saat ini belum ada data surat masuk yang terdaftar di sistem E-Office BKSDA.'}
            </p>
            {isFilterActive && (
              <button
                type="button"
                className="btn-empty-reset"
                onClick={handleResetFilters}
              >
                <RotateCcw size={15} aria-hidden="true" />
                <span>Reset Pencarian & Filter</span>
              </button>
            )}
          </div>
        )}

        {/* State 4: Data Berhasil Ditampilkan */}
        {!loading && !error && filteredSurat.length > 0 && (
          <>
            {viewMode === 'table' ? (
              <div className="surat-table-outer">
                <SuratTable
                  data={filteredSurat}
                  type="masuk"
                  onDetail={(item) => setSelectedSurat(item)}
                  caption="Tabel Registrasi Surat Masuk BKSDA Jawa Tengah"
                />
              </div>
            ) : (
              <div className="surat-cards-grid">
                {filteredSurat.map((item) => (
                  <SuratCard
                    key={item.id}
                    surat={item}
                    type="masuk"
                    onDetail={(surat) => setSelectedSurat(surat)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* Modal Detail Surat Masuk */}
      <DetailSuratModal
        surat={selectedSurat}
        type="masuk"
        onClose={() => setSelectedSurat(null)}
      />
    </div>
  );
}
