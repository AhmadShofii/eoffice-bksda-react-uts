import React from 'react';
import {
  Search,
  X,
  Filter,
  CheckCircle2,
  Clock,
  PlayCircle,
  ListFilter,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

/**
 * Komponen Reusable: TaskFilter
 * E-Office BKSDA Jawa Tengah - Modul Anggota 5 (Manajemen Tugas)
 *
 * Menyediakan antarmuka filtering komprehensif untuk daftar tugas:
 * - Tab filter status tugas (Semua, Belum Dikerjakan, Dalam Proses, Selesai) dengan badge jumlah item
 * - Form pencarian real-time berdasarkan judul, deskripsi, atau nama penanggung jawab
 * - Filter dropdown tingkat prioritas (Semua, Tinggi, Sedang, Rendah)
 * - Tombol Reset Filter saat kondisi filter aktif
 * - Aksesibilitas WCAG: role="tablist", role="tab", aria-selected, aria-controls, keyboard-navigable
 *
 * @param {object} props
 * @param {string} props.statusFilter - Status aktif ('all' | 'belum_dikerjakan' | 'proses' | 'selesai')
 * @param {Function} props.onStatusChange - Handler perubahan filter status: (status) => void
 * @param {string} props.priorityFilter - Filter prioritas ('all' | 'Tinggi' | 'Sedang' | 'Rendah')
 * @param {Function} props.onPriorityChange - Handler perubahan prioritas: (prioritas) => void
 * @param {string} props.searchQuery - Teks pencarian saat ini
 * @param {Function} props.onSearchChange - Handler perubahan pencarian: (query) => void
 * @param {object} [props.counts] - Objek jumlah tugas per status { all, belum_dikerjakan, proses, selesai }
 * @param {Function} [props.onReset] - Handler reset seluruh filter
 */
export default function TaskFilter({
  statusFilter = 'all',
  onStatusChange,
  priorityFilter = 'all',
  onPriorityChange,
  searchQuery = '',
  onSearchChange,
  counts = { all: 0, belum_dikerjakan: 0, proses: 0, selesai: 0 },
  onReset,
}) {
  const isFilterActive =
    statusFilter !== 'all' || priorityFilter !== 'all' || (searchQuery && searchQuery.trim() !== '');

  const statusTabs = [
    {
      id: 'all',
      label: 'Semua Tugas',
      count: counts.all ?? 0,
      icon: ListFilter,
      badgeColor: 'badge-tab-all',
    },
    {
      id: 'belum_dikerjakan',
      label: 'Belum Dikerjakan',
      count: counts.belum_dikerjakan ?? 0,
      icon: Clock,
      badgeColor: 'badge-tab-pending',
    },
    {
      id: 'proses',
      label: 'Dalam Proses',
      count: counts.proses ?? 0,
      icon: PlayCircle,
      badgeColor: 'badge-tab-process',
    },
    {
      id: 'selesai',
      label: 'Selesai',
      count: counts.selesai ?? 0,
      icon: CheckCircle2,
      badgeColor: 'badge-tab-completed',
    },
  ];

  return (
    <section
      className="task-filter-panel"
      aria-label="Panel Pencarian dan Filter Tugas Pegawai"
    >
      {/* Baris Pertama: Tab Status & Tombol Reset */}
      <div className="task-filter-top-row">
        <div
          className="task-status-tabs"
          role="tablist"
          aria-label="Filter berdasarkan status pengerjaan"
        >
          {statusTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-status-${tab.id}`}
                aria-selected={isActive}
                aria-controls="task-list-panel"
                tabIndex={isActive ? 0 : -1}
                className={`task-tab-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => onStatusChange && onStatusChange(tab.id)}
                type="button"
              >
                <Icon size={15} className="task-tab-icon" aria-hidden="true" />
                <span className="task-tab-label">{tab.label}</span>
                <span
                  className={`task-tab-counter ${tab.badgeColor}`}
                  aria-label={`${tab.count} tugas`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {isFilterActive && onReset && (
          <button
            type="button"
            className="btn-reset-filter"
            onClick={onReset}
            aria-label="Reset semua filter dan pencarian"
          >
            <RotateCcw size={14} aria-hidden="true" />
            <span>Reset Filter</span>
          </button>
        )}
      </div>

      {/* Baris Kedua: Pencarian Real-Time & Dropdown Filter Prioritas */}
      <div className="task-filter-controls-row">
        <div className="task-search-box">
          <Search size={16} className="task-search-icon" aria-hidden="true" />
          <input
            type="search"
            className="task-search-input"
            placeholder="Cari berdasarkan judul tugas, deskripsi, atau penanggung jawab..."
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            aria-label="Cari tugas pegawai"
          />
          {searchQuery && (
            <button
              type="button"
              className="task-search-clear"
              onClick={() => onSearchChange && onSearchChange('')}
              aria-label="Hapus kata kunci pencarian"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="task-select-filter">
          <label htmlFor="priority-filter-select" className="sr-only">
            Filter Berdasarkan Prioritas
          </label>
          <div className="task-select-wrapper">
            <Filter size={15} className="task-select-icon" aria-hidden="true" />
            <select
              id="priority-filter-select"
              className="task-select"
              value={priorityFilter}
              onChange={(e) => onPriorityChange && onPriorityChange(e.target.value)}
            >
              <option value="all">Semua Prioritas</option>
              <option value="Tinggi">Prioritas Tinggi</option>
              <option value="Sedang">Prioritas Sedang</option>
              <option value="Rendah">Prioritas Rendah</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
