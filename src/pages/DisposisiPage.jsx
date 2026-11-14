import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Share2,
  RefreshCw,
  AlertTriangle,
  Filter,
  PlusCircle,
  Clock,
  AlertCircle,
  CheckCircle2,
  Users,
  Search,
  RotateCcw,
  LayoutGrid,
  Table as TableIcon,
  ChevronRight,
  Send,
  FileCheck,
} from 'lucide-react';
import { getAllDisposisi, updateStatusDisposisi } from '../services/disposisiService';
import { getAllSuratMasuk } from '../services/suratMasukService';
import {
  SearchBar,
  StatusBadge,
  DisposisiCard,
  DisposisiFormModal,
  DetailDisposisiModal,
  LoadingSkeleton,
} from '../components';

/**
 * Halaman: Disposisi Surat
 * E-Office BKSDA Jawa Tengah
 *
 * Tanggung Jawab: Anggota 4 (Modul Disposisi & Arsip)
 *
 * Fitur Komprehensif:
 * 1. Pengambilan data dinamis menggunakan Axios melalui disposisiService (Mock / Backend).
 * 2. Pencarian disposisi real-time berdasarkan nomor surat, perihal, pejabat penerima, atau instruksi.
 * 3. Filter status disposisi (Semua, Menunggu, Dalam Proses, Selesai) & Filter unit pelaksana.
 * 4. Formulir pembuatan disposisi baru dengan validasi client-side komprehensif.
 * 5. Kartu metrik ringkasan alur tindak lanjut disposisi.
 * 6. Pembaruan status cepat (quick status action) langsung dari kartu disposisi atau modal.
 * 7. Modal detail lembar disposisi pimpinan dengan opsi cetak.
 * 8. Penanganan loading skeleton, error state dengan tombol retry, dan empty state.
 * 9. Tata letak responsif menggunakan CSS Grid & Flexbox, mematuhi WCAG 2.1 AA.
 */
export default function DisposisiPage() {
  // State Utama Data & API
  const [disposisiList, setDisposisiList] = useState([]);
  const [suratOptions, setSuratOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // State Filter & Pencarian
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [penerimaFilter, setPenerimaFilter] = useState('all');

  // State Modal Form & Detail
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDisposisi, setSelectedDisposisi] = useState(null);
  const [successNotification, setSuccessNotification] = useState(null);

  // Fetch Data Disposisi & Referensi Surat
  const fetchDisposisiData = useCallback(async (isManual = false) => {
    if (isManual) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const [disposisiData, suratData] = await Promise.all([
        getAllDisposisi(),
        getAllSuratMasuk().catch(() => []),
      ]);

      setDisposisiList(Array.isArray(disposisiData) ? disposisiData : []);

      if (Array.isArray(suratData) && suratData.length > 0) {
        setSuratOptions(
          suratData.map((s) => ({
            surat_id: s.id,
            nomor_surat: s.nomor_surat,
            perihal: s.perihal,
          }))
        );
      }
    } catch (err) {
      console.error('Error saat mengambil data disposisi:', err);
      const friendlyMsg =
        err?.userFriendlyMessage ||
        err?.message ||
        'Gagal memuat data disposisi surat dari server. Silakan periksa koneksi Anda.';
      setError(friendlyMsg);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDisposisiData();
  }, [fetchDisposisiData]);

  // Ekstraksi daftar unik pejabat / unit penerima disposisi untuk filter dropdown
  const availableRecipients = useMemo(() => {
    const set = new Set();
    disposisiList.forEach((item) => {
      if (item.penerima_disposisi) set.add(item.penerima_disposisi);
    });
    return Array.from(set);
  }, [disposisiList]);

  // Filter & Pencarian Real-Time Data Disposisi (Client-Side Filtering)
  const filteredDisposisi = useMemo(() => {
    return disposisiList.filter((item) => {
      // 1. Pencarian teks: nomor surat, perihal, penerima, atau instruksi
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchNomor = item.nomor_surat?.toLowerCase().includes(q);
        const matchPerihal = item.perihal?.toLowerCase().includes(q);
        const matchPenerima = item.penerima_disposisi?.toLowerCase().includes(q);
        const matchInstruksi = item.instruksi?.toLowerCase().includes(q);
        if (!matchNomor && !matchPerihal && !matchPenerima && !matchInstruksi) {
          return false;
        }
      }

      // 2. Filter Status Disposisi
      if (statusFilter !== 'all') {
        if (statusFilter === 'proses' || statusFilter === 'dalam_proses') {
          if (item.status !== 'proses' && item.status !== 'dalam_proses') {
            return false;
          }
        } else if (item.status !== statusFilter) {
          return false;
        }
      }

      // 3. Filter Unit Penerima
      if (penerimaFilter !== 'all' && item.penerima_disposisi !== penerimaFilter) {
        return false;
      }

      return true;
    });
  }, [disposisiList, searchQuery, statusFilter, penerimaFilter]);

  // Hitung Statistik Alur Disposisi
  const stats = useMemo(() => {
    const total = disposisiList.length;
    const menunggu = disposisiList.filter((d) => d.status === 'menunggu').length;
    const proses = disposisiList.filter((d) => d.status === 'dalam_proses' || d.status === 'proses').length;
    const selesai = disposisiList.filter((d) => d.status === 'selesai').length;
    return { total, menunggu, proses, selesai };
  }, [disposisiList]);

  // Handler Reset Filter & Pencarian
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPenerimaFilter('all');
  };

  const isFilterActive =
    Boolean(searchQuery.trim()) ||
    statusFilter !== 'all' ||
    penerimaFilter !== 'all';

  // Handler Sukses Membuat Disposisi Baru
  const handleDisposisiCreated = (newItem) => {
    setDisposisiList((prev) => [newItem, ...prev]);
    setSuccessNotification(`Lembar disposisi untuk surat "${newItem.nomor_surat}" berhasil diteruskan!`);
    setTimeout(() => {
      setSuccessNotification(null);
    }, 4500);
  };

  // Handler Perbarui Status Disposisi (misal: Menunggu -> Dalam Proses -> Selesai)
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateStatusDisposisi(id, newStatus);
      setDisposisiList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );

      // Sinkronkan juga objek terpilih jika modal detail sedang aktif
      if (selectedDisposisi && selectedDisposisi.id === id) {
        setSelectedDisposisi((prev) => ({ ...prev, status: newStatus }));
      }

      setSuccessNotification(`Status disposisi #${id} diperbarui menjadi: ${newStatus.replace(/_/g, ' ')}`);
      setTimeout(() => {
        setSuccessNotification(null);
      }, 4000);
    } catch (err) {
      console.error('Gagal memperbarui status disposisi:', err);
      alert('Gagal memperbarui status disposisi. Silakan coba kembali.');
    }
  };

  return (
    <div className="page-container">
      {/* Header Halaman Semantik */}
      <header className="page-header">
        <div className="page-header-text">
          <div className="page-header-pretitle">
            <Share2 size={16} aria-hidden="true" />
            <span>Manajemen Alur Penugasan & Lembar Instruksi</span>
          </div>
          <h1 className="page-title">Disposisi Surat</h1>
          <p className="page-subtitle">
            Alur instruksi pimpinan, penerusan tugas tindak lanjut surat masuk,
            dan pemantauan status penyelesaian oleh jajaran BKSDA Jawa Tengah.
          </p>
        </div>

        <div className="page-header-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsFormOpen(true)}
            aria-label="Buka formulir pembuatan disposisi baru"
          >
            <PlusCircle size={17} aria-hidden="true" />
            <span>Buat Disposisi Baru</span>
          </button>

          <button
            type="button"
            className="btn btn-refresh"
            onClick={() => fetchDisposisiData(true)}
            disabled={loading || isRefreshing}
            aria-label="Segarkan data disposisi dari server"
          >
            <RefreshCw
              size={16}
              className={isRefreshing ? 'spin-animation' : ''}
              aria-hidden="true"
            />
            <span>{isRefreshing ? 'Menyegarkan...' : 'Segarkan Data'}</span>
          </button>
        </div>
      </header>

      {/* Banner Notifikasi Sukses */}
      {successNotification && (
        <div className="alert-banner-success" role="status" aria-live="polite">
          <CheckCircle2 size={18} aria-hidden="true" />
          <span>{successNotification}</span>
        </div>
      )}

      {/* Metrik Ringkasan Status Disposisi (Modern Grid) */}
      <section className="surat-metrics-grid" aria-label="Ringkasan Status Disposisi">
        <div
          className={`surat-metric-card surat-metric--total ${statusFilter === 'all' ? 'active-metric' : ''}`}
          onClick={() => setStatusFilter('all')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setStatusFilter('all')}
          aria-label="Filter seluruh lembar disposisi"
        >
          <div className="metric-icon">
            <Share2 size={24} aria-hidden="true" />
          </div>
          <div className="metric-body">
            <span className="metric-label">Total Disposisi</span>
            <span className="metric-value">{stats.total}</span>
          </div>
        </div>

        <div
          className={`surat-metric-card surat-metric--menunggu ${statusFilter === 'menunggu' ? 'active-metric' : ''}`}
          onClick={() => setStatusFilter('menunggu')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setStatusFilter('menunggu')}
          aria-label="Filter disposisi status menunggu tindak lanjut"
        >
          <div className="metric-icon">
            <Clock size={24} aria-hidden="true" />
          </div>
          <div className="metric-body">
            <span className="metric-label">Menunggu Tindak Lanjut</span>
            <span className="metric-value">{stats.menunggu}</span>
          </div>
        </div>

        <div
          className={`surat-metric-card surat-metric--proses ${statusFilter === 'dalam_proses' ? 'active-metric' : ''}`}
          onClick={() => setStatusFilter('dalam_proses')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setStatusFilter('dalam_proses')}
          aria-label="Filter disposisi status dalam proses"
        >
          <div className="metric-icon">
            <AlertCircle size={24} aria-hidden="true" />
          </div>
          <div className="metric-body">
            <span className="metric-label">Sedang Diproses</span>
            <span className="metric-value">{stats.proses}</span>
          </div>
        </div>

        <div
          className={`surat-metric-card surat-metric--selesai ${statusFilter === 'selesai' ? 'active-metric' : ''}`}
          onClick={() => setStatusFilter('selesai')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setStatusFilter('selesai')}
          aria-label="Filter disposisi status selesai"
        >
          <div className="metric-icon">
            <CheckCircle2 size={24} aria-hidden="true" />
          </div>
          <div className="metric-body">
            <span className="metric-label">Selesai Tuntas</span>
            <span className="metric-value">{stats.selesai}</span>
          </div>
        </div>
      </section>

      {/* Kontrol Pencarian & Filter Multi-Dimensi */}
      <section className="surat-control-card" aria-label="Kontrol Pencarian dan Filter Disposisi">
        <div className="control-row-primary">
          <div className="surat-search-stretch">
            <SearchBar
              id="search-disposisi"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Cari nomor surat, perihal, penerima disposisi, atau instruksi..."
              label="Pencarian Disposisi Surat"
              resultCount={filteredDisposisi.length}
            />
          </div>
        </div>

        {/* Baris Filter Status & Unit Penerima */}
        <div className="control-row-filters">
          <div className="filter-group">
            <label htmlFor="filter-disposisi-status" className="filter-label">
              <Filter size={14} aria-hidden="true" /> Status:
            </label>
            <select
              id="filter-disposisi-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Semua Status ({disposisiList.length})</option>
              <option value="menunggu">Menunggu Tindak Lanjut</option>
              <option value="dalam_proses">Dalam Proses</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-disposisi-penerima" className="filter-label">
              <Users size={14} aria-hidden="true" /> Tujuan Disposisi:
            </label>
            <select
              id="filter-disposisi-penerima"
              value={penerimaFilter}
              onChange={(e) => setPenerimaFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Semua Pejabat / Unit</option>
              {availableRecipients.map((rec) => (
                <option key={rec} value={rec}>
                  {rec}
                </option>
              ))}
            </select>
          </div>

          {isFilterActive && (
            <button
              type="button"
              className="btn-reset-filters"
              onClick={handleResetFilters}
              aria-label="Atur ulang seluruh filter dan kata kunci pencarian"
            >
              <RotateCcw size={13} aria-hidden="true" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </section>

      {/* Konten Utama: Loading, Error, Empty State, atau Grid DisposisiCard */}
      <main id="main-content" aria-live="polite">
        {loading ? (
          <div className="disposisi-loading-wrap" aria-label="Memuat daftar disposisi...">
            <div className="stats-grid">
              <LoadingSkeleton type="stat-card" count={4} />
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <LoadingSkeleton type="block" height="140px" count={3} />
            </div>
          </div>
        ) : error ? (
          <div className="error-state-card" role="alert">
            <div className="error-icon-wrapper">
              <AlertTriangle size={28} aria-hidden="true" />
            </div>
            <div className="error-content">
              <h2 className="error-title">Gagal Mengambil Data Disposisi</h2>
              <p className="error-message">{error}</p>
              <div className="error-actions">
                <button
                  type="button"
                  className="btn btn-retry"
                  onClick={() => fetchDisposisiData(false)}
                >
                  <RefreshCw size={14} aria-hidden="true" />
                  <span>Coba Muat Ulang</span>
                </button>
              </div>
            </div>
          </div>
        ) : filteredDisposisi.length === 0 ? (
          <div className="empty-state-card" role="region" aria-label="Data disposisi tidak ditemukan">
            <div className="empty-state-icon">
              <Search size={36} aria-hidden="true" />
            </div>
            <h2 className="empty-state-title">
              {isFilterActive
                ? 'Tidak Ada Disposisi yang Sesuai'
                : 'Belum Ada Lembar Disposisi'}
            </h2>
            <p className="empty-state-desc">
              {isFilterActive
                ? 'Tidak ditemukan lembar disposisi yang cocok dengan kata kunci pencarian atau kombinasi filter status yang Anda pilih.'
                : 'Saat ini belum ada lembar disposisi surat yang diterbitkan. Anda dapat membuat disposisi baru untuk meneruskan surat masuk.'}
            </p>
            {isFilterActive ? (
              <button
                type="button"
                className="btn-empty-reset"
                onClick={handleResetFilters}
              >
                <RotateCcw size={14} aria-hidden="true" />
                <span>Atur Ulang Pencarian & Filter</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsFormOpen(true)}
              >
                <PlusCircle size={15} aria-hidden="true" />
                <span>Terbitkan Disposisi Pertama</span>
              </button>
            )}
          </div>
        ) : (
          <section
            className="disposisi-cards-grid"
            aria-label={`Daftar ${filteredDisposisi.length} Lembar Disposisi Surat`}
          >
            {filteredDisposisi.map((item) => (
              <DisposisiCard
                key={item.id}
                disposisi={item}
                onDetail={(disp) => setSelectedDisposisi(disp)}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </section>
        )}
      </main>

      {/* Modal Form Pembuatan Disposisi Baru (Validasi Client-Side) */}
      <DisposisiFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleDisposisiCreated}
        suratOptions={suratOptions}
      />

      {/* Modal Detail Lembar Disposisi */}
      <DetailDisposisiModal
        disposisi={selectedDisposisi}
        onClose={() => setSelectedDisposisi(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
