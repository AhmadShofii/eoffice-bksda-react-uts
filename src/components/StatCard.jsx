import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

/**
 * Komponen Reusable: StatCard
 * E-Office BKSDA Jawa Tengah
 *
 * Menampilkan ringkasan data statistik dengan ikon indikator, angka, badge, dan link pintasan.
 * Mengikuti spesifikasi aksesibilitas WCAG & Semantic HTML5 (article).
 *
 * @param {object} props
 * @param {string} props.title - Judul statistik (contoh: "Surat Masuk")
 * @param {number|string} props.value - Nilai kuantitatif statistik
 * @param {React.ElementType} props.icon - Komponen icon Lucide
 * @param {'emerald'|'blue'|'amber'|'rose'|'purple'} [props.variant='emerald'] - Variasi warna tema
 * @param {string} [props.badgeText] - Teks badge informasi tambahan (contoh: "12 Baru")
 * @param {'emerald'|'amber'|'rose'|'neutral'} [props.badgeVariant='emerald'] - Warna badge
 * @param {string} [props.description] - Keterangan singkat deskriptif
 * @param {string} [props.linkTo] - URL tujuan modul (contoh: "/surat-masuk")
 * @param {string} [props.linkLabel] - Teks tombol navigasi (contoh: "Buka Surat Masuk")
 */
export default function StatCard({
  title,
  value = 0,
  icon: IconComponent,
  variant = 'emerald',
  badgeText,
  badgeVariant = 'emerald',
  description,
  linkTo,
  linkLabel = 'Lihat Detail',
}) {
  return (
    <article
      className={`stat-card stat-card--${variant}`}
      aria-labelledby={`stat-${title.toLowerCase().replace(/\s+/g, '-')}-title`}
    >
      <div className="stat-card-header">
        <div className={`stat-card-icon stat-card-icon--${variant}`} aria-hidden="true">
          {IconComponent && <IconComponent size={24} />}
        </div>
        {badgeText && (
          <span className={`stat-badge stat-badge--${badgeVariant}`} role="status">
            {badgeText}
          </span>
        )}
      </div>

      <div className="stat-card-body">
        <h3
          id={`stat-${title.toLowerCase().replace(/\s+/g, '-')}-title`}
          className="stat-card-title"
        >
          {title}
        </h3>
        <p className="stat-card-value">
          {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
        </p>
        {description && <p className="stat-card-desc">{description}</p>}
      </div>

      {linkTo && (
        <div className="stat-card-footer">
          <Link
            to={linkTo}
            className="stat-card-link"
            aria-label={`${linkLabel} - ${title}`}
          >
            <span>{linkLabel}</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      )}
    </article>
  );
}
