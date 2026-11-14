import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Send,
  RefreshCw,
  AlertTriangle,
  Filter,
  LayoutGrid,
  Table as TableIcon,
  RotateCcw,
  CheckCircle2,
  Clock,
  FileCheck,
  FileText,
  Users,
} from 'lucide-react';
import { getAllSuratKeluar } from '../services/suratKeluarService';
import {
  SearchBar,
  SuratTable,
  SuratCard,
  DetailSuratModal,
  LoadingSkeleton,
} from '../components';

/**
 * Halaman: Surat Keluar
 * E-Office BKSDA Jawa Tengah
 *
 * Tanggung Jawab: Anggota 3 (Modul Surat Masuk & Surat Keluar)
 *
 * Fitur Lengkap:
 * 1. Fetching data dinamis menggunakan Axios melalui suratKeluarService.
 * 2. Pencarian real-time berdasarkan nomor surat, perihal, atau instansi tujuan.
 * 3. Filter multi-dimensi: Status (Draf, Diverifikasi, Terkirim), Sifat urgensi, dan Kategori surat.
 * 4. Dual View Mode: Tabel Data Semantik & Tampilan Kartu Responsif (SuratCard).
 * 5. Kartu metrik status surat keluar instansi.
 * 6. Modal detail surat yang interaktif & aksesibel dengan opsi cetak dan unduh dokumen.
 * 7. State UI menyeluruh: Loading shimmer skeleton, penanganan error dengan retry, dan empty state.
 */
export default function SuratKeluarPage() {
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

  // Fungsi Fetch Data Surat Keluar dari API / Mock Service
  const fetchSuratKeluar = useCallback(async (isManual = false) => {
    if (isManual) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await getAllSuratKeluar();
      setSuratList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error saat mengambil data surat keluar:', err);
      const friendlyMsg =
        err?.userFriendlyMessage ||
        err?.message ||
        'Gagal memuat data surat keluar dari server. Silakan periksa koneksi Anda.';
      setError(friendlyMsg);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Fetch pertama saat halaman dimuat
  useEffect(() => {
    fetchSuratKeluar();
  }, [fetchSuratKeluar]);

  // Ekstraksi kategori unik secara dinamis dari data
  const availableCategories = useMemo(() => {
    const set = new Set();
    suratList.forEach((item) => {
      if (item.kategori) set.add(item.kategori);
    });
    return Array.from(set);
  }, [suratList]);

  // Filter & Pencarian Data Surat Keluar (Client-Side Filtering Realtime)
  const filteredSurat = useMemo(() => {
    return suratList.filter((item) => {
      // 1. Pencarian teks: nomor_surat, perihal, atau tujuan
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchNomor = item.nomor_surat?.toLowerCase().includes(q);
        const matchPerihal = item.perihal?.toLowerCase().includes(q);
        const matchTujuan = item.tujuan?.toLowerCase().includes(q);
        if (!matchNomor && !matchPerihal && !matchTujuan) {
          return false;
        }
      }

      // 2. Filter Status (draft, diverifikasi, terkirim)
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

  // Statistik Ringkasan Status Surat Keluar
  const stats = useMemo(() => {
    const total = suratList.length;
    const draft = suratList.filter((s) => s.status === 'draft').length;
    const diverifikasi = suratList.filter((s) => s.status === 'diverifikasi').length;
    const terkirim = suratList.filter((s) => s.status === 'terkirim').length;
    return { total, draft, diverifikasi, terkirim };
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
            <Send size={18} className="text-primary" aria-hidden="true" />
            <span>Tata Kelola Persuratan</span>
          </div>
          <h1 className="page-title">Surat Keluar</h1>
          <p className="page-subtitle">
            Pencatatan, verifikasi naskah dinas, dan pemantauan pengiriman surat dinas BKSDA Jawa Tengah.
          </p>
        </div>

        <div className="page-header-actions">
          <span className="badge-author" title="Bagian modul yang dikerjakan oleh Anggota 3">
            <Users size={14} aria-hidden="true" /> Modul Anggota 3
          </span>

          <button
            type="button"
            className="btn-refresh"
            onClick={() => fetchSuratKeluar(true)}
            disabled={loading || isRefreshing}
            aria-label="Segarkan data surat keluar"
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

      {/* Kartu Ringkasan Metrik Surat Keluar */}
      <section className="surat-metrics-grid" aria-label="Ringkasan Status Surat Keluar">
        <div className="surat-metric-card surat-metric--total">
          <div className="metric-icon">
            <FileText size={20} aria-hidden="true" />
          </div>
          <div className="metric-body">
            <span className="metric-label">Total Surat Keluar</span>
            <strong className="metric-value">{loading ? '...' : stats.total}</strong>
          </div>
        </div>

        <div className="surat-metric-card surat-metric--draft">
          <div className="metric-icon">
            <Clock size={20} aria-hidden="true" />
          </div>
          <div className="metric-body">
            <span className="metric-label">Draf Surat</span>
            <strong className="metric-value">{loading ? '...' : stats.draft}</strong>
          </div>
        </div>

        <div className="surat-metric-card surat-metric--verifikasi">
          <div className="metric-icon">
            <FileCheck size={20} aria-hidden="true" />
          </div>
          <div className="metric-body">
            <span className="metric-label">Diverifikasi</span>
            <strong className="metric-value">{loading ? '...' : stats.diverifikasi}</strong>
          </div>
        </div>

        <div className="surat-metric-card surat-metric--terkirim">
          <div className="metric-icon">
            <CheckCircle2 size={20} aria-hidden="true" />
          </div>
          <div className="metric-body">
            <span className="metric-label">Sudah Terkirim</span>
            <strong className="metric-value">{loading ? '...' : stats.terkirim}</strong>
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
            placeholder="Cari nomor surat, perihal, atau instansi tujuan..."
            label="Pencarian Surat Keluar"
            id="search-surat-keluar"
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
            <label htmlFor="filter-status-keluar" className="filter-label">
              <Filter size={14} aria-hidden="true" /> Status:
            </label>
            <select
              id="filter-status-keluar"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Semua Status</option>
              <option value="draft">Draf Surat</option>
              <option value="diverifikasi">Diverifikasi</option>
              <option value="terkirim">Sudah Terkirim</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-sifat-keluar" className="filter-label">
              Sifat Urgensi:
            </label>
            <select
              id="filter-sifat-keluar"
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
            <label htmlFor="filter-kategori-keluar" className="filter-label">
              Kategori:
            </label>
            <select
              id="filter-kategori-keluar"
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
      <section className="surat-content-area" aria-label="Daftar Surat Keluar">
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
              <h2 className="error-title">Gagal Mengambil Data Surat Keluar</h2>
              <p className="error-message">{error}</p>
              <div className="error-actions">
                <button
                  type="button"
                  className="btn-retry"
                  onClick={() => fetchSuratKeluar(false)}
                >
                  <RefreshCw size={15} aria-hidden="true" />
                  <span>Coba Lagi</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* State 3: Empty State (Data Kosong atau Hasil Pencarian Nihil) */}
        {!loading && !error && filteredSurat.length === 0 && (
          <div className="empty-state-card" role="status">
            <div className="empty-state-icon">
              <Send size={42} aria-hidden="true" />
            </div>
            <h2 className="empty-state-title">
              {isFilterActive
                ? 'Tidak Ada Surat Keluar yang Sesuai'
                : 'Belum Ada Surat Keluar'}
            </h2>
            <p className="empty-state-desc">
              {isFilterActive
                ? 'Tidak ditemukan data surat keluar dengan kata kunci atau filter yang Anda terapkan. Silakan sesuaikan kata kunci atau bersihkan filter.'
                : 'Saat ini belum ada naskah surat keluar yang terdaftar di sistem E-Office BKSDA.'}
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
                  type="keluar"
                  onDetail={(item) => setSelectedSurat(item)}
                  caption="Tabel Registrasi Surat Keluar BKSDA Jawa Tengah"
                />
              </div>
            ) : (
              <div className="surat-cards-grid">
                {filteredSurat.map((item) => (
                  <SuratCard
                    key={item.id}
                    surat={item}
                    type="keluar"
                    onDetail={(surat) => setSelectedSurat(surat)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* Modal Detail Surat Keluar */}
      <DetailSuratModal
        surat={selectedSurat}
        type="keluar"
        onClose={() => setSelectedSurat(null)}
      />
    </div>
  );
}
