import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  CheckSquare,
  PlusCircle,
  RefreshCw,
  AlertTriangle,
  Clock,
  PlayCircle,
  CheckCircle2,
  Users,
  Calendar,
  Sparkles,
  Inbox,
  Filter,
  Check,
  X,
} from 'lucide-react';
import {
  getAllTugas,
  updateStatusTugas,
} from '../services/tugasService';
import {
  TaskCard,
  TaskFilter,
  TaskForm,
  DetailTaskModal,
  LoadingSkeleton,
} from '../components';

/**
 * Halaman: Modul Tugas Pegawai (TugasPage.jsx)
 * E-Office BKSDA Jawa Tengah
 *
 * Tanggung Jawab: Anggota 5 (Modul Tugas, Integrasi Akhir & Dokumentasi)
 *
 * Fitur & Spesifikasi Lengkap:
 * 1. Pengambilan data tugas dinamis dari API/Mock via tugasService (Axios).
 * 2. Filter status komprehensif: Belum Dikerjakan, Dalam Proses, dan Selesai.
 * 3. Filter tingkat prioritas (Tinggi, Sedang, Rendah) dan pencarian real-time.
 * 4. Kartu statistik ringkasan progres tugas konservasi & administrasi.
 * 5. Formulir penambahan tugas baru dengan validasi client-side ketat (TaskForm).
 * 6. Quick action perubahan status tugas langsung dari TaskCard atau DetailTaskModal.
 * 7. Loading skeleton, error state interaktif dengan tombol coba lagi (retry), dan empty state.
 * 8. Notifikasi toast visual untuk konfirmasi penambahan atau pembaruan tugas.
 * 9. Mematuhi kepatuhan Semantic HTML5, WCAG 2.1 AA, dan tata letak responsif CSS Grid/Flexbox.
 */
export default function TugasPage() {
  // State Utama Data & API
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // State Filter & Pencarian
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // State Modal & Aksi
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  /**
   * Mengambil data daftar tugas dari service API
   */
  const fetchTasks = useCallback(async (isManual = false) => {
    if (isManual) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await getAllTugas();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error saat mengambil data tugas:', err);
      const friendlyMsg =
        err?.userFriendlyMessage ||
        err?.message ||
        'Gagal memuat daftar tugas dari server. Silakan periksa jaringan Anda.';
      setError(friendlyMsg);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Otomatis menutup toast setelah 4 detik
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  /**
   * Menampilkan pesan notifikasi toast
   */
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
  };

  /**
   * Handler untuk penambahan tugas baru yang berhasil
   */
  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
    showToast(`Tugas "${newTask.judul}" berhasil ditambahkan!`, 'success');
  };

  /**
   * Handler untuk pembaruan status tugas
   */
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateStatusTugas(taskId, newStatus);

      // Perbarui state lokal secara reaktif
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );

      // Jika modal detail sedang terbuka untuk tugas ini, perbarui objeknya
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      const statusLabels = {
        belum_dikerjakan: 'Belum Dikerjakan',
        proses: 'Dalam Proses',
        selesai: 'Selesai',
      };
      showToast(
        `Status tugas berhasil diperbarui ke: ${statusLabels[newStatus] || newStatus}`,
        'success'
      );
    } catch (err) {
      console.error('Gagal memperbarui status tugas:', err);
      showToast(
        err?.userFriendlyMessage || 'Gagal mengubah status tugas. Silakan coba lagi.',
        'error'
      );
    }
  };

  /**
   * Handler membuka modal detail tugas
   */
  const handleOpenDetail = (task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  /**
   * Reset seluruh filter & pencarian ke default
   */
  const handleResetFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setSearchQuery('');
  };

  /**
   * Hitung ringkasan jumlah tugas per status
   */
  const counts = useMemo(() => {
    const res = {
      all: tasks.length,
      belum_dikerjakan: 0,
      proses: 0,
      selesai: 0,
    };
    tasks.forEach((t) => {
      const s = (t.status || '').toLowerCase();
      if (s === 'belum_dikerjakan') res.belum_dikerjakan += 1;
      else if (s === 'proses' || s === 'dalam_proses') res.proses += 1;
      else if (s === 'selesai') res.selesai += 1;
    });
    return res;
  }, [tasks]);

  /**
   * Filter daftar tugas berdasarkan status, prioritas, dan query pencarian
   */
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // 1. Filter Status
      if (statusFilter !== 'all') {
        const s = (t.status || '').toLowerCase();
        if (statusFilter === 'proses') {
          if (s !== 'proses' && s !== 'dalam_proses') return false;
        } else if (s !== statusFilter) {
          return false;
        }
      }

      // 2. Filter Prioritas
      if (priorityFilter !== 'all') {
        if ((t.prioritas || '').toLowerCase() !== priorityFilter.toLowerCase()) {
          return false;
        }
      }

      // 3. Pencarian Teks
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchJudul = t.judul?.toLowerCase().includes(q);
        const matchDesc = t.deskripsi?.toLowerCase().includes(q);
        const matchPJ = t.penanggung_jawab?.toLowerCase().includes(q);
        if (!matchJudul && !matchDesc && !matchPJ) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, statusFilter, priorityFilter, searchQuery]);

  return (
    <div className="page-container" id="main-content">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <aside
          className={`toast-banner toast-banner--${toastMessage.type}`}
          role="status"
          aria-live="polite"
        >
          <div className="toast-content">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 size={18} className="toast-icon" aria-hidden="true" />
            ) : (
              <AlertTriangle size={18} className="toast-icon" aria-hidden="true" />
            )}
            <span className="toast-text">{toastMessage.message}</span>
          </div>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => setToastMessage(null)}
            aria-label="Tutup notifikasi"
          >
            <X size={15} aria-hidden="true" />
          </button>
        </aside>
      )}

      {/* Header Halaman Utama */}
      <header className="page-header">
        <div className="page-header-text">
          <div className="page-header-top">
            <span className="page-badge-lead">
              <CheckSquare size={13} aria-hidden="true" />
              <span>Modul Monitoring & Penugasan</span>
            </span>
            <span className="badge-author" title="Penanggung Jawab Implementasi">
              <Users size={13} aria-hidden="true" />
              <span>Modul Anggota 5</span>
            </span>
          </div>
          <h1 className="page-title">Manajemen Tugas Pegawai</h1>
          <p className="page-subtitle">
            Pelacakan agenda konservasi lapangan, penyelamatan satwa, dan tata kelola administrasi BKSDA Jateng
          </p>
        </div>

        <div className="page-header-actions">
          <button
            type="button"
            className="btn btn-refresh"
            onClick={() => fetchTasks(true)}
            disabled={loading || isRefreshing}
            aria-label="Segarkan data tugas pegawai"
          >
            <RefreshCw
              size={16}
              className={isRefreshing ? 'spin-icon' : ''}
              aria-hidden="true"
            />
            <span>{isRefreshing ? 'Memperbarui...' : 'Segarkan'}</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsFormOpen(true)}
            aria-label="Tambah tugas pegawai baru"
          >
            <PlusCircle size={16} aria-hidden="true" />
            <span>Tambah Tugas</span>
          </button>
        </div>
      </header>

      {/* Kartu Ringkasan Metrik Statistik Tugas */}
      <section
        className="tasks-summary-grid"
        aria-label="Ringkasan Statistik Progres Penugasan"
      >
        <article className="task-summary-card task-summary-card--total">
          <div className="summary-card-icon-box total-icon-box" aria-hidden="true">
            <CheckSquare size={20} />
          </div>
          <div className="summary-card-info">
            <span className="summary-card-label">Total Penugasan</span>
            <strong className="summary-card-value">{counts.all}</strong>
            <span className="summary-card-sub">Seluruh agenda tercatat</span>
          </div>
        </article>

        <article className="task-summary-card task-summary-card--pending">
          <div className="summary-card-icon-box pending-icon-box" aria-hidden="true">
            <Clock size={20} />
          </div>
          <div className="summary-card-info">
            <span className="summary-card-label">Belum Dikerjakan</span>
            <strong className="summary-card-value">{counts.belum_dikerjakan}</strong>
            <span className="summary-card-sub">Menunggu pelaksanaan</span>
          </div>
        </article>

        <article className="task-summary-card task-summary-card--process">
          <div className="summary-card-icon-box process-icon-box" aria-hidden="true">
            <PlayCircle size={20} />
          </div>
          <div className="summary-card-info">
            <span className="summary-card-label">Dalam Proses</span>
            <strong className="summary-card-value">{counts.proses}</strong>
            <span className="summary-card-sub">Sedang berjalan di lapangan</span>
          </div>
        </article>

        <article className="task-summary-card task-summary-card--completed">
          <div className="summary-card-icon-box completed-icon-box" aria-hidden="true">
            <CheckCircle2 size={20} />
          </div>
          <div className="summary-card-info">
            <span className="summary-card-label">Tugas Selesai</span>
            <strong className="summary-card-value">{counts.selesai}</strong>
            <span className="summary-card-sub">Tuntas dilaporkan</span>
          </div>
        </article>
      </section>

      {/* Komponen Filter & Pencarian Reusable */}
      <TaskFilter
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        counts={counts}
        onReset={handleResetFilters}
      />

      {/* Konten Daftar Tugas: Menangani State Loading, Error, Empty, dan Data */}
      <section
        id="task-list-panel"
        className="task-content-section"
        aria-label="Daftar Kartu Tugas Pegawai"
        aria-live="polite"
      >
        {/* 1. Kondisi Loading State */}
        {loading && (
          <div className="loading-state-wrapper">
            <LoadingSkeleton count={4} type="card" />
          </div>
        )}

        {/* 2. Kondisi Error State dengan Tombol Coba Lagi */}
        {!loading && error && (
          <div className="error-state-card" role="alert">
            <div className="error-icon-box">
              <AlertTriangle size={36} aria-hidden="true" />
            </div>
            <h2 className="error-title">Gagal Memuat Data Tugas</h2>
            <p className="error-desc">{error}</p>
            <button
              type="button"
              className="btn btn-retry"
              onClick={() => fetchTasks(false)}
            >
              <RefreshCw size={15} aria-hidden="true" />
              <span>Coba Muat Ulang</span>
            </button>
          </div>
        )}

        {/* 3. Kondisi Empty State (Tidak Ada Tugas Ditemukan) */}
        {!loading && !error && filteredTasks.length === 0 && (
          <div className="empty-state-card">
            <div className="empty-icon-box">
              <Inbox size={44} aria-hidden="true" />
            </div>
            <h2 className="empty-title">Tidak Ada Tugas yang Sesuai</h2>
            <p className="empty-desc">
              {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Tidak ditemukan tugas yang cocok dengan filter atau kata kunci pencarian Anda.'
                : 'Belum ada agenda tugas pegawai yang terdaftar pada sistem.'}
            </p>
            <div className="empty-actions">
              {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' ? (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleResetFilters}
                >
                  <RefreshCw size={14} aria-hidden="true" />
                  <span>Reset Filter</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsFormOpen(true)}
                >
                  <PlusCircle size={15} aria-hidden="true" />
                  <span>Buat Tugas Pertama</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* 4. Daftar Kartu Tugas (CSS Grid) */}
        {!loading && !error && filteredTasks.length > 0 && (
          <div className="tasks-grid">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onDetail={handleOpenDetail}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modal Form Tambah Tugas Baru */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleTaskCreated}
      />

      {/* Modal Rincian / Detail Tugas */}
      <DetailTaskModal
        task={selectedTask}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onUpdateStatus={handleStatusChange}
      />
    </div>
  );
}
