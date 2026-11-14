import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Send,
  Share2,
  CheckSquare,
  RefreshCw,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { getDashboardSummary } from '../services/dashboardService';
import StatCard from '../components/StatCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

/**
 * Halaman: Dashboard Utama E-Office
 * Balai Konservasi Sumber Daya Alam (BKSDA) Jawa Tengah
 *
 * Tanggung Jawab: Anggota 2 (Dashboard & Layout Utama)
 *
 * Fitur:
 * - Mengambil dan mengelola data ringkasan statistik secara dinamis melalui Axios/Fetch.
 * - 4 Kartu Statistik Reusable (StatCard): Surat Masuk, Surat Keluar, Disposisi, Tugas.
 * - Loading state dengan LoadingSkeleton shimmer.
 * - Error state interaktif dengan pesan ramah pengguna dan tombol retry (Coba Lagi).
 * - Ringkasan status alur surat dan disposisi harian.
 * - Timeline aktivitas persuratan terbaru (Aktivitas Terkini).
 * - Aksesibilitas WCAG, Semantic HTML5, dan Responsif CSS Grid/Flexbox.
 */
export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fungsi Fetch Data Dashboard dari API / Mock Service
  const fetchDashboardData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const result = await getDashboardSummary();
      // Menangani variasi format response API (result.data atau result langsung)
      const dataPayload = result?.data || result;
      setDashboardData(dataPayload);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error saat mengambil data dashboard:', err);
      const message =
        err?.userFriendlyMessage ||
        err?.message ||
        'Gagal memuat data statistik dashboard. Silakan periksa koneksi jaringan Anda.';
      setError(message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Memanggil API saat komponen pertama kali dimuat
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handler Tombol Retry / Segarkan Manual
  const handleRetry = () => {
    fetchDashboardData(true);
  };

  // Ekstraksi data statistik dan status dengan nilai fallback yang aman
  const statistik = dashboardData?.statistik || {
    surat_masuk: 0,
    surat_keluar: 0,
    disposisi: 0,
    tugas: 0,
  };

  const ringkasan = dashboardData?.ringkasan_status || {
    surat_masuk_baru: 0,
    disposisi_menunggu: 0,
    disposisi_proses: 0,
    tugas_berjalan: 0,
  };

  const aktivitasList = dashboardData?.aktivitas_terbaru || [];

  // Helper untuk mendapatkan ikon aktivitas berdasarkan tipe
  const getActivityIcon = (tipe) => {
    switch (tipe) {
      case 'surat_masuk':
        return <Inbox size={18} className="activity-icon--emerald" />;
      case 'surat_keluar':
        return <Send size={18} className="activity-icon--blue" />;
      case 'disposisi':
        return <Share2 size={18} className="activity-icon--amber" />;
      case 'tugas':
        return <CheckSquare size={18} className="activity-icon--purple" />;
      default:
        return <FileText size={18} className="activity-icon--default" />;
    }
  };

  return (
    <div className="page-container dashboard-page">
      {/* 1. Header Dashboard & Aksi Cepat */}
      <header className="page-header" role="region" aria-label="Header Dashboard">
        <div className="page-header-text">
          <div className="page-badge-lead">
            <Sparkles size={14} aria-hidden="true" />
            <span>Pusat Kendali Administrasi Elektronik</span>
          </div>
          <h1 className="page-title">Dashboard E-Office</h1>
          <p className="page-subtitle">
            Ringkasan data operasional tata persuratan, disposisi, dan agenda Balai Konservasi Sumber Daya Alam Jawa Tengah
          </p>
        </div>

        <div className="page-header-actions">
          {lastUpdated && (
            <span className="last-updated-text" title="Waktu pembaruan data terakhir">
              <Clock size={13} aria-hidden="true" />
              Diperbarui: {lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB
            </span>
          )}

          <button
            type="button"
            className="btn btn-refresh"
            onClick={handleRetry}
            disabled={loading || isRefreshing}
            aria-label="Segarkan data statistik dashboard"
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

      {/* 2. Error State dengan Tombol Retry */}
      {error && !loading && (
        <section
          className="error-state-card"
          role="alert"
          aria-live="assertive"
          aria-labelledby="error-heading"
        >
          <div className="error-icon-wrapper" aria-hidden="true">
            <AlertTriangle size={32} />
          </div>
          <div className="error-content">
            <h2 id="error-heading" className="error-title">
              Terjadi Kendala Memuat Data Dashboard
            </h2>
            <p className="error-message">{error}</p>
            <div className="error-actions">
              <button
                type="button"
                className="btn btn-retry"
                onClick={handleRetry}
                aria-label="Coba ambil kembali data dashboard"
              >
                <RefreshCw size={15} aria-hidden="true" />
                <span>Coba Lagi (Retry)</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3. Loading State Skeleton */}
      {loading && (
        <section aria-label="Memuat statistik dashboard" aria-busy="true">
          <LoadingSkeleton type="stat-card" count={4} />

          <div className="dashboard-grid-secondary" style={{ marginTop: '2rem' }}>
            <div className="dashboard-column">
              <LoadingSkeleton type="block" height="260px" />
            </div>
            <div className="dashboard-column">
              <LoadingSkeleton type="activity" count={4} />
            </div>
          </div>
        </section>
      )}

      {/* 4. Tampilan Data Statistik Utama jika Berhasil Diambil */}
      {!loading && !error && (
        <>
          {/* Grid 4 Kartu Statistik Reusable (StatCard) */}
          <section
            className="stats-grid"
            aria-labelledby="stats-overview-heading"
          >
            <h2 id="stats-overview-heading" className="sr-only">
              Statistik Utama E-Office
            </h2>

            {/* Kartu 1: Surat Masuk */}
            <StatCard
              title="Surat Masuk"
              value={statistik.surat_masuk}
              icon={Inbox}
              variant="emerald"
              badgeText={`+${ringkasan.surat_masuk_baru || 0} Baru`}
              badgeVariant="emerald"
              description="Total surat dinas masuk tercatat dalam sistem"
              linkTo="/surat-masuk"
              linkLabel="Buka Surat Masuk"
            />

            {/* Kartu 2: Surat Keluar */}
            <StatCard
              title="Surat Keluar"
              value={statistik.surat_keluar}
              icon={Send}
              variant="blue"
              badgeText="Terkirim"
              badgeVariant="neutral"
              description="Surat dinas BKSDA terverifikasi &amp; diterbitkan"
              linkTo="/surat-keluar"
              linkLabel="Buka Surat Keluar"
            />

            {/* Kartu 3: Disposisi Surat */}
            <StatCard
              title="Disposisi Surat"
              value={statistik.disposisi}
              icon={Share2}
              variant="amber"
              badgeText={`${ringkasan.disposisi_menunggu || 0} Menunggu`}
              badgeVariant="amber"
              description="Instruksi &amp; arahan pimpinan yang sedang berjalan"
              linkTo="/disposisi"
              linkLabel="Kelola Disposisi"
            />

            {/* Kartu 4: Manajemen Tugas */}
            <StatCard
              title="Tugas Pegawai"
              value={statistik.tugas}
              icon={CheckSquare}
              variant="purple"
              badgeText={`${ringkasan.tugas_berjalan || 0} Proses`}
              badgeVariant="emerald"
              description="Agenda kerja lapangan &amp; administratif seksi"
              linkTo="/tugas"
              linkLabel="Pantau Tugas"
            />
          </section>

          {/* Grid Sekunder: Ringkasan Status & Aktivitas Terbaru */}
          <div className="dashboard-grid-secondary">
            {/* Kolom Kiri: Ringkasan Status Operasional & Pintasan Navigasi */}
            <div className="dashboard-column">
              {/* Card: Status Alur Kerja Hari Ini */}
              <section
                className="content-card status-summary-card"
                aria-labelledby="status-summary-heading"
              >
                <div className="card-header">
                  <div className="card-header-icon" aria-hidden="true">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h2 id="status-summary-heading" className="card-title">
                      Status Operasional Hari Ini
                    </h2>
                    <p className="card-subtitle">
                      Pantauan beban kerja dan alur administrasi aktif
                    </p>
                  </div>
                </div>

                <div className="status-indicator-list">
                  <div className="status-indicator-item">
                    <div className="status-item-info">
                      <span className="status-item-label">Surat Masuk Baru (Belum Disposisi)</span>
                      <span className="status-item-count count--emerald">
                        {ringkasan.surat_masuk_baru} Berkas
                      </span>
                    </div>
                    <div className="status-progress-bar">
                      <div
                        className="status-progress-fill fill--emerald"
                        style={{ width: `${Math.min((ringkasan.surat_masuk_baru / 20) * 100, 100)}%` }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <div className="status-indicator-item">
                    <div className="status-item-info">
                      <span className="status-item-label">Disposisi Menunggu Tindak Lanjut</span>
                      <span className="status-item-count count--amber">
                        {ringkasan.disposisi_menunggu} Berkas
                      </span>
                    </div>
                    <div className="status-progress-bar">
                      <div
                        className="status-progress-fill fill--amber"
                        style={{ width: `${Math.min((ringkasan.disposisi_menunggu / 15) * 100, 100)}%` }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <div className="status-indicator-item">
                    <div className="status-item-info">
                      <span className="status-item-label">Disposisi Sedang Diproses Staf</span>
                      <span className="status-item-count count--blue">
                        {ringkasan.disposisi_proses} Berkas
                      </span>
                    </div>
                    <div className="status-progress-bar">
                      <div
                        className="status-progress-fill fill--blue"
                        style={{ width: `${Math.min((ringkasan.disposisi_proses / 25) * 100, 100)}%` }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <div className="status-indicator-item">
                    <div className="status-item-info">
                      <span className="status-item-label">Tugas Kegiatan Sedang Berjalan</span>
                      <span className="status-item-count count--purple">
                        {ringkasan.tugas_berjalan} Agenda
                      </span>
                    </div>
                    <div className="status-progress-bar">
                      <div
                        className="status-progress-fill fill--purple"
                        style={{ width: `${Math.min((ringkasan.tugas_berjalan / 15) * 100, 100)}%` }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Card: Pintasan Cepat Modul */}
              <section
                className="content-card quick-links-card"
                aria-labelledby="quick-links-heading"
              >
                <div className="card-header">
                  <div className="card-header-icon" aria-hidden="true">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h2 id="quick-links-heading" className="card-title">
                      Pintasan Modul E-Office
                    </h2>
                    <p className="card-subtitle">
                      Akses langsung ke modul persuratan dan administrasi lainnya
                    </p>
                  </div>
                </div>

                <div className="quick-links-grid">
                  <Link to="/surat-masuk" className="quick-link-box">
                    <div className="quick-link-icon icon--emerald" aria-hidden="true">
                      <Inbox size={20} />
                    </div>
                    <div className="quick-link-text">
                      <span className="quick-link-title">Surat Masuk</span>
                      <span className="quick-link-sub">Registrasi &amp; Pencarian</span>
                    </div>
                    <ArrowRight size={16} className="quick-link-arrow" aria-hidden="true" />
                  </Link>

                  <Link to="/surat-keluar" className="quick-link-box">
                    <div className="quick-link-icon icon--blue" aria-hidden="true">
                      <Send size={20} />
                    </div>
                    <div className="quick-link-text">
                      <span className="quick-link-title">Surat Keluar</span>
                      <span className="quick-link-sub">Penomoran &amp; Verifikasi</span>
                    </div>
                    <ArrowRight size={16} className="quick-link-arrow" aria-hidden="true" />
                  </Link>

                  <Link to="/disposisi" className="quick-link-box">
                    <div className="quick-link-icon icon--amber" aria-hidden="true">
                      <Share2 size={20} />
                    </div>
                    <div className="quick-link-text">
                      <span className="quick-link-title">Disposisi Surat</span>
                      <span className="quick-link-sub">Alur Lembar Arahan</span>
                    </div>
                    <ArrowRight size={16} className="quick-link-arrow" aria-hidden="true" />
                  </Link>

                  <Link to="/tugas" className="quick-link-box">
                    <div className="quick-link-icon icon--purple" aria-hidden="true">
                      <CheckSquare size={20} />
                    </div>
                    <div className="quick-link-text">
                      <span className="quick-link-title">Manajemen Tugas</span>
                      <span className="quick-link-sub">Agenda &amp; Pelaksanaan</span>
                    </div>
                    <ArrowRight size={16} className="quick-link-arrow" aria-hidden="true" />
                  </Link>
                </div>
              </section>
            </div>

            {/* Kolom Kanan: Timeline Aktivitas Persuratan Terkini */}
            <div className="dashboard-column">
              <section
                className="content-card activities-card"
                aria-labelledby="recent-activities-heading"
              >
                <div className="card-header">
                  <div className="card-header-icon" aria-hidden="true">
                    <Activity size={20} />
                  </div>
                  <div>
                    <h2 id="recent-activities-heading" className="card-title">
                      Aktivitas Persuratan Terkini
                    </h2>
                    <p className="card-subtitle">
                      Log pembaruan persuratan dan disposisi terbaru BKSDA Jateng
                    </p>
                  </div>
                </div>

                {aktivitasList.length === 0 ? (
                  <div className="empty-activities" role="status">
                    <p>Belum ada rekaman aktivitas persuratan terbaru.</p>
                  </div>
                ) : (
                  <ol className="activity-timeline" role="list">
                    {aktivitasList.map((item) => (
                      <li key={item.id} className="activity-item">
                        <div className="activity-icon-bubble" aria-hidden="true">
                          {getActivityIcon(item.tipe)}
                        </div>

                        <article className="activity-details">
                          <div className="activity-meta">
                            <h3 className="activity-title">{item.judul}</h3>
                            <time className="activity-time">{item.waktu}</time>
                          </div>
                          <p className="activity-desc">{item.keterangan}</p>
                        </article>
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
