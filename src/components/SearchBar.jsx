import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * Komponen Reusable: SearchBar
 * E-Office BKSDA Jawa Tengah - Modul Anggota 3
 *
 * Input pencarian persuratan dengan aksesibilitas ramah pembaca layar (WCAG),
 * tombol hapus instan (clear button), dan indikator visual status pencarian.
 *
 * @param {object} props
 * @param {string} props.value - Nilai input pencarian
 * @param {Function} props.onChange - Handler perubahan input: (e) => void
 * @param {Function} [props.onClear] - Handler untuk menghapus kata kunci
 * @param {string} [props.placeholder='Cari nomor surat, perihal, atau pengirim...'] - Teks placeholder
 * @param {string} [props.label='Pencarian Surat'] - Label aksesibilitas pembaca layar
 * @param {string} [props.id='search-surat-input'] - Atribut ID elemen input
 * @param {number} [props.resultCount] - Total hasil pencarian yang ditemukan (opsional)
 * @param {string} [props.className=''] - Class CSS tambahan
 */
export default function SearchBar({
  value = '',
  onChange,
  onClear,
  placeholder = 'Cari nomor surat, perihal, atau pengirim...',
  label = 'Pencarian Surat',
  id = 'search-surat-input',
  resultCount,
  className = '',
}) {
  const handleKeyDown = (e) => {
    // Tombol Escape menghapus kata kunci pencarian
    if (e.key === 'Escape' && value && onClear) {
      e.preventDefault();
      onClear();
    }
  };

  return (
    <div className={`search-bar-container ${className}`}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>

      <div className="search-input-wrapper">
        <Search size={18} className="search-input-icon" aria-hidden="true" />
        <input
          id={id}
          type="search"
          role="searchbox"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="search-input-field"
          aria-label={label}
          autoComplete="off"
          spellCheck="false"
        />

        {value && onClear && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={onClear}
            aria-label="Hapus kata kunci pencarian"
            title="Hapus pencarian (Esc)"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      {typeof resultCount === 'number' && (
        <span className="search-result-pill" aria-live="polite">
          {resultCount} data ditemukan
        </span>
      )}
    </div>
  );
}
