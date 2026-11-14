import React from 'react';

/**
 * Komponen Reusable: LoadingSkeleton
 * E-Office BKSDA Jawa Tengah
 *
 * Memberikan animasi skeleton loading shimmer dengan berbagai varian tampilan
 * untuk meningkatkan pengalaman pengguna (UX) saat proses fetching data API.
 *
 * @param {object} props
 * @param {'stat-card'|'activity'|'block'|'text'} [props.type='block'] - Tipe komponen skeleton
 * @param {number} [props.count=1] - Jumlah item skeleton yang dirender
 * @param {string} [props.height] - Tinggi kustom item skeleton (misal: "24px")
 * @param {string} [props.width] - Lebar kustom item skeleton (misal: "100%")
 * @param {string} [props.className] - Class CSS tambahan
 */
export default function LoadingSkeleton({
  type = 'block',
  count = 1,
  height,
  width,
  className = '',
}) {
  const items = Array.from({ length: count }, (_, idx) => idx);

  if (type === 'stat-card') {
    return (
      <div
        className={`skeleton-stats-grid ${className}`}
        role="status"
        aria-live="polite"
        aria-label="Memuat statistik..."
      >
        {items.map((key) => (
          <div key={key} className="skeleton-card skeleton-stat-card">
            <div className="skeleton-header">
              <div className="skeleton-avatar shimmer" />
              <div className="skeleton-badge shimmer" />
            </div>
            <div className="skeleton-body">
              <div className="skeleton-line shimmer skeleton-line--short" />
              <div className="skeleton-line shimmer skeleton-line--large" />
              <div className="skeleton-line shimmer skeleton-line--desc" />
            </div>
            <div className="skeleton-footer">
              <div className="skeleton-line shimmer skeleton-line--button" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'activity') {
    return (
      <div
        className={`skeleton-activity-list ${className}`}
        role="status"
        aria-live="polite"
        aria-label="Memuat daftar aktivitas..."
      >
        {items.map((key) => (
          <div key={key} className="skeleton-activity-item">
            <div className="skeleton-icon-bubble shimmer" />
            <div className="skeleton-activity-content">
              <div className="skeleton-line shimmer skeleton-line--title" />
              <div className="skeleton-line shimmer skeleton-line--desc" />
            </div>
            <div className="skeleton-line shimmer skeleton-line--time" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`skeleton-wrapper ${className}`}
      role="status"
      aria-live="polite"
      aria-label="Memuat data..."
    >
      {items.map((key) => (
        <div
          key={key}
          className={`skeleton-block shimmer ${type === 'text' ? 'skeleton-text' : ''}`}
          style={{
            height: height || undefined,
            width: width || undefined,
          }}
        />
      ))}
    </div>
  );
}
