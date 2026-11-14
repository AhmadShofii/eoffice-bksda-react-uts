import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  CheckSquare,
  Calendar,
  User,
  AlertCircle,
  CheckCircle2,
  Send,
  Flag,
  FileText,
  Layers,
  Sparkles,
} from 'lucide-react';
import { createTugas } from '../services/tugasService';

// Daftar penanggung jawab standar di lingkungan BKSDA Jawa Tengah
const OPSI_PENANGGUNG_JAWAB_DEFAULT = [
  'Regu Polhut Wilayah II Pemalang',
  'Fauzan Nurhadi, S.Hut (PEH)',
  'drh. Anita Paramitha',
  'Tim Humas dan Penyuluhan Kehutanan',
  'Subbagian Tata Usaha & Kepegawaian',
  'Seksi Konservasi Wilayah I Surakarta',
  'Resort Konservasi Batang-Pekalongan',
  'Regu Polhut Wilayah I Cilacap',
];

// Kategori kegiatan konservasi & kedinasan
const OPSI_KATEGORI_KEGIATAN = [
  'Patroli & Pengamanan Hutan',
  'Pemeriksaan Medis & Perawatan Satwa',
  'Penanganan Konflik Satwa Liar',
  'Penyuluhan & Sosialisasi Masyarakat',
  'Administrasi Persuratan & Keuangan',
  'Monitoring Keanekaragaman Hayati',
];

/**
 * Komponen Reusable: TaskForm
 * E-Office BKSDA Jawa Tengah - Modul Anggota 5 (Manajemen Tugas)
 *
 * Formulir modal penambahan tugas baru dengan validasi client-side komprehensif:
 * - Kepatuhan Semantic HTML5 & Aksesibilitas WCAG 2.1 AA
 * - Validasi input realtime (required, panjang karakter, batas waktu tanggal)
 * - Penanganan error visual dengan role="alert" dan aria-invalid
 * - Keyboard navigation (Esc to close, auto-focus input pertama)
 * - Terintegrasi dengan tugasService.js (createTugas)
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Status visibilitas modal form
 * @param {Function} props.onClose - Callback saat modal ditutup: () => void
 * @param {Function} props.onSuccess - Callback saat tugas berhasil ditambahkan: (newTask) => void
 */
export default function TaskForm({ isOpen, onClose, onSuccess }) {
  const judulInputRef = useRef(null);

  // Nilai form awal
  const initialFormState = {
    judul: '',
    deskripsi: '',
    penanggung_jawab: OPSI_PENANGGUNG_JAWAB_DEFAULT[0],
    penanggung_jawab_custom: '',
    prioritas: 'Sedang',
    tenggat_waktu: '',
    kategori: OPSI_KATEGORI_KEGIATAN[0],
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isCustomPJ, setIsCustomPJ] = useState(false);

  // Aksesibilitas: Keyboard Escape & Auto-focus
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    // Auto-focus input judul setelah modal terbuka
    const timer = setTimeout(() => {
      judulInputRef.current?.focus();
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
      clearTimeout(timer);
    };
  }, [isOpen, isSubmitting, onClose]);

  // Reset form saat modal dibuka kembali
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormState);
      setErrors({});
      setTouched({});
      setSubmitError(null);
      setIsCustomPJ(false);
    }
  }, [isOpen]);

  /**
   * Fungsi validasi client-side per field input
   */
  const validateField = (name, value, currentFormData = formData) => {
    switch (name) {
      case 'judul': {
        const val = (value || '').trim();
        if (!val) return 'Judul tugas wajib diisi.';
        if (val.length < 5) return 'Judul tugas minimal 5 karakter.';
        if (val.length > 120) return 'Judul tugas maksimal 120 karakter.';
        return null;
      }

      case 'penanggung_jawab': {
        if (isCustomPJ) {
          const customVal = (currentFormData.penanggung_jawab_custom || '').trim();
          if (!customVal) return 'Nama penanggung jawab wajib diisi.';
          if (customVal.length < 3) return 'Nama penanggung jawab minimal 3 karakter.';
        } else {
          if (!value) return 'Pilih salah satu penanggung jawab.';
        }
        return null;
      }

      case 'penanggung_jawab_custom': {
        if (isCustomPJ) {
          const val = (value || '').trim();
          if (!val) return 'Nama penanggung jawab kustom wajib diisi.';
          if (val.length < 3) return 'Nama penanggung jawab minimal 3 karakter.';
        }
        return null;
      }

      case 'prioritas': {
        if (!value) return 'Pilih tingkat prioritas tugas.';
        return null;
      }

      case 'tenggat_waktu': {
        if (!value) return 'Tenggat waktu pelaksanaan tugas wajib ditentukan.';
        const d = new Date(value);
        if (isNaN(d.getTime())) return 'Format tanggal tidak valid.';
        return null;
      }

      case 'deskripsi': {
        const val = (value || '').trim();
        if (!val) return 'Deskripsi rincian tugas wajib diisi.';
        if (val.length < 10) return 'Deskripsi tugas minimal 10 karakter agar instruksi jelas.';
        if (val.length > 600) return 'Deskripsi tugas maksimal 600 karakter.';
        return null;
      }

      default:
        return null;
    }
  };

  /**
   * Validasi seluruh form sebelum submit
   */
  const validateAll = () => {
    const newErrors = {};

    const fieldsToValidate = [
      'judul',
      'penanggung_jawab',
      'penanggung_jawab_custom',
      'prioritas',
      'tenggat_waktu',
      'deskripsi',
    ];

    fieldsToValidate.forEach((key) => {
      const err = validateField(key, formData[key], formData);
      if (err) newErrors[key] = err;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    if (touched[name]) {
      const errorMsg = validateField(name, value, updatedForm);
      setErrors((prev) => ({
        ...prev,
        [name]: errorMsg,
      }));
    }
  };

  // Handler blur untuk validasi langsung saat fokus berpindah
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const errorMsg = validateField(name, value, formData);
    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  // Handler submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Tandai semua field telah disentuh (touched)
    const allTouched = {
      judul: true,
      penanggung_jawab: true,
      penanggung_jawab_custom: true,
      prioritas: true,
      tenggat_waktu: true,
      deskripsi: true,
    };
    setTouched(allTouched);

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const pjFinal = isCustomPJ
        ? formData.penanggung_jawab_custom.trim()
        : formData.penanggung_jawab;

      const payload = {
        judul: formData.judul.trim(),
        deskripsi: formData.deskripsi.trim(),
        penanggung_jawab: pjFinal,
        prioritas: formData.prioritas,
        tenggat_waktu: formData.tenggat_waktu,
        kategori: formData.kategori,
        status: 'belum_dikerjakan',
      };

      const result = await createTugas(payload);
      const createdItem = result?.data || { id: Date.now(), ...payload };

      if (onSuccess) {
        onSuccess(createdItem);
      }
      onClose();
    } catch (err) {
      console.error('Error saat membuat tugas baru:', err);
      setSubmitError(
        err?.userFriendlyMessage ||
          err?.message ||
          'Gagal menambahkan tugas ke server. Silakan coba beberapa saat lagi.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        className="modal-dialog modal-dialog--md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
        aria-describedby="task-form-subtitle"
      >
        {/* Header Modal */}
        <header className="modal-header">
          <div className="modal-header-icon-box">
            <CheckSquare size={22} className="modal-icon-brand" aria-hidden="true" />
          </div>
          <div className="modal-header-text">
            <h2 id="task-form-title" className="modal-title">
              Tambah Tugas Pegawai
            </h2>
            <p id="task-form-subtitle" className="modal-subtitle">
              Delegasikan agenda baru bagi personel konservasi & administrasi BKSDA
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Tutup form penambahan tugas"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        {/* Notifikasi Error Submit */}
        {submitError && (
          <div className="form-error-banner" role="alert">
            <AlertCircle size={16} aria-hidden="true" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Konten Form */}
        <form onSubmit={handleSubmit} noValidate className="modal-form-content">
          {/* Field 1: Judul Tugas */}
          <div className="form-group">
            <label htmlFor="task-judul" className="form-label required">
              Judul Tugas / Agenda
            </label>
            <input
              ref={judulInputRef}
              type="text"
              id="task-judul"
              name="judul"
              className={`form-input ${touched.judul && errors.judul ? 'form-input--error' : ''}`}
              placeholder="Contoh: Patroli Jalur Rawan Perambahan Kawasan Hutan..."
              value={formData.judul}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              aria-required="true"
              aria-invalid={touched.judul && !!errors.judul}
              aria-describedby={touched.judul && errors.judul ? 'err-task-judul' : undefined}
            />
            {touched.judul && errors.judul && (
              <p id="err-task-judul" className="form-feedback-error" role="alert">
                <AlertCircle size={13} aria-hidden="true" />
                <span>{errors.judul}</span>
              </p>
            )}
          </div>

          {/* Field 2 & 3: Penanggung Jawab & Kategori (Grid 2 Kolom) */}
          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="task-pj" className="form-label required">
                Penanggung Jawab (PJ)
              </label>
              {!isCustomPJ ? (
                <div className="select-with-action">
                  <select
                    id="task-pj"
                    name="penanggung_jawab"
                    className={`form-select ${
                      touched.penanggung_jawab && errors.penanggung_jawab ? 'form-select--error' : ''
                    }`}
                    value={formData.penanggung_jawab}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                  >
                    {OPSI_PENANGGUNG_JAWAB_DEFAULT.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn-toggle-custom"
                    onClick={() => {
                      setIsCustomPJ(true);
                      setFormData((prev) => ({ ...prev, penanggung_jawab_custom: '' }));
                    }}
                    title="Ketik nama PJ secara manual"
                  >
                    Input Manual
                  </button>
                </div>
              ) : (
                <div className="select-with-action">
                  <input
                    type="text"
                    id="task-pj-custom"
                    name="penanggung_jawab_custom"
                    className={`form-input ${
                      touched.penanggung_jawab_custom && errors.penanggung_jawab_custom
                        ? 'form-input--error'
                        : ''
                    }`}
                    placeholder="Nama staf / tim penanggung jawab..."
                    value={formData.penanggung_jawab_custom}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    aria-required="true"
                  />
                  <button
                    type="button"
                    className="btn-toggle-custom"
                    onClick={() => {
                      setIsCustomPJ(false);
                      setErrors((prev) => ({ ...prev, penanggung_jawab_custom: null }));
                    }}
                    title="Pilih dari daftar standar"
                  >
                    Pilih List
                  </button>
                </div>
              )}
              {isCustomPJ && touched.penanggung_jawab_custom && errors.penanggung_jawab_custom && (
                <p className="form-feedback-error" role="alert">
                  <AlertCircle size={13} aria-hidden="true" />
                  <span>{errors.penanggung_jawab_custom}</span>
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="task-kategori" className="form-label">
                Kategori Kegiatan
              </label>
              <select
                id="task-kategori"
                name="kategori"
                className="form-select"
                value={formData.kategori}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                {OPSI_KATEGORI_KEGIATAN.map((kat) => (
                  <option key={kat} value={kat}>
                    {kat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Field 4 & 5: Prioritas & Batas Waktu (Grid 2 Kolom) */}
          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="task-prioritas" className="form-label required">
                Tingkat Prioritas
              </label>
              <select
                id="task-prioritas"
                name="prioritas"
                className={`form-select ${
                  touched.prioritas && errors.prioritas ? 'form-select--error' : ''
                }`}
                value={formData.prioritas}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              >
                <option value="Tinggi">🔴 Prioritas Tinggi (Mendesak)</option>
                <option value="Sedang">🟡 Prioritas Sedang (Standar)</option>
                <option value="Rendah">🟢 Prioritas Rendah (Rutin)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-deadline" className="form-label required">
                Tenggat Waktu Selesai
              </label>
              <input
                type="date"
                id="task-deadline"
                name="tenggat_waktu"
                className={`form-input ${
                  touched.tenggat_waktu && errors.tenggat_waktu ? 'form-input--error' : ''
                }`}
                value={formData.tenggat_waktu}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                aria-required="true"
                aria-invalid={touched.tenggat_waktu && !!errors.tenggat_waktu}
                aria-describedby={
                  touched.tenggat_waktu && errors.tenggat_waktu ? 'err-task-deadline' : undefined
                }
              />
              {touched.tenggat_waktu && errors.tenggat_waktu && (
                <p id="err-task-deadline" className="form-feedback-error" role="alert">
                  <AlertCircle size={13} aria-hidden="true" />
                  <span>{errors.tenggat_waktu}</span>
                </p>
              )}
            </div>
          </div>

          {/* Field 6: Deskripsi Tugas */}
          <div className="form-group">
            <div className="label-with-hint">
              <label htmlFor="task-deskripsi" className="form-label required">
                Instruksi & Rincian Tugas
              </label>
              <span className="char-counter">
                {(formData.deskripsi || '').length}/600
              </span>
            </div>
            <textarea
              id="task-deskripsi"
              name="deskripsi"
              rows={4}
              className={`form-textarea ${
                touched.deskripsi && errors.deskripsi ? 'form-textarea--error' : ''
              }`}
              placeholder="Jelaskan ruang lingkup, lokasi sasaran, peralatan yang dibutuhkan, serta hasil yang diharapkan..."
              value={formData.deskripsi}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              maxLength={600}
              aria-required="true"
              aria-invalid={touched.deskripsi && !!errors.deskripsi}
              aria-describedby={
                touched.deskripsi && errors.deskripsi ? 'err-task-deskripsi' : undefined
              }
            />
            {touched.deskripsi && errors.deskripsi && (
              <p id="err-task-deskripsi" className="form-feedback-error" role="alert">
                <AlertCircle size={13} aria-hidden="true" />
                <span>{errors.deskripsi}</span>
              </p>
            )}
          </div>

          {/* Footer Modal: Tombol Aksi */}
          <footer className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-icon" aria-hidden="true" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Send size={15} aria-hidden="true" />
                  <span>Simpan & Tugaskan</span>
                </>
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
