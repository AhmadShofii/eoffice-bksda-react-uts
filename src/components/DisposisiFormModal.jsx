import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Share2,
  Calendar,
  UserCheck,
  Users,
  FileText,
  AlertCircle,
  CheckCircle2,
  Send,
  HelpCircle,
} from 'lucide-react';
import { createDisposisi } from '../services/disposisiService';

// Opsi referensi surat masuk BKSDA Jawa Tengah
const OPSI_SURAT_DEFAULT = [
  {
    surat_id: 1,
    nomor_surat: '005/KLHK/BKSDA/X/2026',
    perihal: 'Undangan Rakor Pengawasan Satwa Liar Wilayah Jawa Bagian Tengah',
  },
  {
    surat_id: 2,
    nomor_surat: '120/DISLHK-JTG/2026',
    perihal: 'Permohonan Data Keanekaragaman Hayati Cagar Alam Subah Batang',
  },
  {
    surat_id: 3,
    nomor_surat: '45/KPHP-PEMALANG/XI/2026',
    perihal: 'Laporan Kejadian Kebakaran Hutan di Perbatasan Kawasan Suaka Margasatwa',
  },
  {
    surat_id: 4,
    nomor_surat: '88/POLRES-BTL/2026',
    perihal: 'Bantuan Saksi Ahli Identifikasi Burung Pemangsa Dilindungi',
  },
  {
    surat_id: 5,
    nomor_surat: '092/BBKSDA-DIY/2026',
    perihal: 'Koordinasi Translokasi Satwa Sitaan Buaya Muara (Crocodylus porosus)',
  },
];

// Opsi daftar pejabat & unit pelaksana penerima disposisi
const OPSI_PENERIMA_DEFAULT = [
  'Staf Pengendali Ekosistem Hutan (PEH)',
  'Regu Polisi Kehutanan (Polhut) Reaksi Cepat',
  'drh. Anita (Dokter Hewan BKSDA Jateng)',
  'Kepala Resort Konservasi Wilayah Batang-Pekalongan',
  'Subbagian Tata Usaha & Urusan Kepegawaian',
  'Koordinator Urusan Perencanaan, Perlindungan & KSDAE',
];

/**
 * Komponen Reusable: DisposisiFormModal
 * E-Office BKSDA Jawa Tengah - Modul Anggota 4
 *
 * Form pembuatan / penerusan disposisi surat baru dengan validasi client-side komprehensif:
 * - Kepatuhan Semantic HTML5 & Aksesibilitas WCAG 2.1 AA
 * - Validasi input realtime (required, panjang karakter, batas waktu tanggal)
 * - Penanganan error visual dengan role="alert" dan aria-invalid
 * - Keyboard navigation (Esc to close, tab index)
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Status visibilitas modal form
 * @param {Function} props.onClose - Callback saat modal ditutup: () => void
 * @param {Function} props.onSuccess - Callback saat disposisi berhasil dibuat: (newDisposisi) => void
 * @param {Array} [props.suratOptions] - Opsi surat tambahan dari modul surat masuk
 */
export default function DisposisiFormModal({
  isOpen,
  onClose,
  onSuccess,
  suratOptions = OPSI_SURAT_DEFAULT,
}) {
  const closeBtnRef = useRef(null);

  // State Formulir Disposisi
  const [formData, setFormData] = useState({
    surat_index: '0',
    pemberi_disposisi: 'Kepala Seksi Konservasi Wilayah II Pemalang',
    penerima_disposisi: '',
    penerima_custom: '',
    instruksi: '',
    catatan: '',
    batas_waktu: '',
    sifat: 'Penting',
  });

  // State Validasi & Status Pengiriman
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Aksesibilitas tombol Escape & penguncian scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    // Set default tanggal besok lusa untuk batas waktu
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    const dateFormatted = defaultDate.toISOString().split('T')[0];

    setFormData((prev) => ({
      ...prev,
      batas_waktu: prev.batas_waktu || dateFormatted,
    }));

    setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Validasi Client-Side Per Kolom
  const validate = (values) => {
    const errs = {};

    // 1. Validasi Surat Terpilih
    if (values.surat_index === '' || values.surat_index === undefined) {
      errs.surat_index = 'Surat yang didisposisikan wajib dipilih.';
    }

    // 2. Validasi Pemberi Disposisi
    if (!values.pemberi_disposisi.trim()) {
      errs.pemberi_disposisi = 'Nama / Jabatan pemberi disposisi tidak boleh kosong.';
    } else if (values.pemberi_disposisi.trim().length < 4) {
      errs.pemberi_disposisi = 'Jabatan pemberi disposisi minimal 4 karakter.';
    }

    // 3. Validasi Penerima Disposisi
    const finalPenerima =
      values.penerima_disposisi === 'LAINNYA'
        ? values.penerima_custom
        : values.penerima_disposisi;

    if (!finalPenerima || !finalPenerima.trim()) {
      errs.penerima_disposisi = 'Tujuan / Pejabat penerima disposisi wajib ditentukan.';
    } else if (finalPenerima.trim().length < 3) {
      errs.penerima_disposisi = 'Nama pejabat / unit penerima minimal 3 karakter.';
    }

    // 4. Validasi Instruksi Pimpinan
    if (!values.instruksi.trim()) {
      errs.instruksi = 'Instruksi pimpinan wajib diisi sebagai dasar tindak lanjut.';
    } else if (values.instruksi.trim().length < 8) {
      errs.instruksi = 'Instruksi tindak lanjut terlalu pendek (minimal 8 karakter).';
    }

    // 5. Validasi Batas Waktu
    if (!values.batas_waktu) {
      errs.batas_waktu = 'Batas waktu penyelesaian wajib ditentukan.';
    }

    return errs;
  };

  // Handler Perubahan Input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validasi realtime jika kolom sudah pernah disentuh
    if (touched[name]) {
      const fieldErrors = validate({ ...formData, [name]: value });
      setErrors((prev) => ({
        ...prev,
        [name]: fieldErrors[name],
      }));
    }
  };

  // Handler Blur Kolom
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const fieldErrors = validate(formData);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldErrors[name],
    }));
  };

  // Handler Submit Formulir Disposisi
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Tandai seluruh kolom sebagai touched
    setTouched({
      surat_index: true,
      pemberi_disposisi: true,
      penerima_disposisi: true,
      instruksi: true,
      batas_waktu: true,
    });

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Fokus ke elemen error pertama
      const firstErrorKey = Object.keys(validationErrors)[0];
      const element = document.getElementById(`field-${firstErrorKey}`);
      element?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedSurat = suratOptions[parseInt(formData.surat_index, 10)] || suratOptions[0];
      const finalPenerima =
        formData.penerima_disposisi === 'LAINNYA'
          ? formData.penerima_custom.trim()
          : (formData.penerima_disposisi || OPSI_PENERIMA_DEFAULT[0]);

      const payload = {
        surat_id: selectedSurat.surat_id || 1,
        nomor_surat: selectedSurat.nomor_surat,
        perihal: selectedSurat.perihal,
        pemberi_disposisi: formData.pemberi_disposisi.trim(),
        penerima_disposisi: finalPenerima,
        instruksi: formData.instruksi.trim(),
        catatan: formData.catatan.trim() || undefined,
        batas_waktu: formData.batas_waktu,
        sifat: formData.sifat,
        status: 'menunggu',
      };

      // Panggil service createDisposisi
      const response = await createDisposisi(payload);
      const createdItem = response.data || { id: Date.now(), ...payload };

      // Notifikasi sukses ke parent component
      onSuccess(createdItem);
      onClose();
    } catch (err) {
      console.error('Error saat membuat disposisi:', err);
      setSubmitError(
        err?.userFriendlyMessage ||
        err?.message ||
        'Gagal meneruskan disposisi. Pastikan seluruh kolom terisi dengan benar.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        className="modal-dialog modal-dialog--form"
        role="dialog"
        aria-modal="true"
        aria-labelledby="disposisi-form-title"
      >
        {/* Header Form */}
        <header className="modal-header">
          <div className="modal-header-info">
            <span className="modal-type-chip">Alur Penugasan Persuratan</span>
            <h2 id="disposisi-form-title" className="modal-title">
              Terbitkan Disposisi Surat Baru
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="modal-btn-close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Tutup form disposisi"
            title="Tutup (Esc)"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        {/* Konten Formulir Semantik HTML5 */}
        <form onSubmit={handleSubmit} noValidate className="modal-form-body">
          {submitError && (
            <div className="form-alert-box form-alert-box--error" role="alert">
              <AlertCircle size={18} aria-hidden="true" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Kolom 1: Pilihan Surat Masuk yang Didisposisikan */}
          <div className="form-group">
            <label htmlFor="field-surat_index" className="form-label">
              Pilih Surat Masuk yang Didisposisikan <span className="text-required">*</span>
            </label>
            <select
              id="field-surat_index"
              name="surat_index"
              value={formData.surat_index}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-select ${errors.surat_index && touched.surat_index ? 'input--invalid' : ''}`}
              aria-invalid={Boolean(errors.surat_index && touched.surat_index)}
              aria-describedby={errors.surat_index && touched.surat_index ? 'err-surat_index' : undefined}
              required
            >
              {suratOptions.map((opt, idx) => (
                <option key={opt.surat_id || idx} value={String(idx)}>
                  [{opt.nomor_surat}] - {opt.perihal}
                </option>
              ))}
            </select>
            {errors.surat_index && touched.surat_index && (
              <span id="err-surat_index" className="form-error-msg" role="alert">
                <AlertCircle size={13} aria-hidden="true" /> {errors.surat_index}
              </span>
            )}
          </div>

          {/* Baris 2 Kolom: Pemberi Disposisi & Sifat */}
          <div className="form-row-2col">
            <div className="form-group">
              <label htmlFor="field-pemberi_disposisi" className="form-label">
                Pemberi Disposisi (Pimpinan) <span className="text-required">*</span>
              </label>
              <input
                id="field-pemberi_disposisi"
                type="text"
                name="pemberi_disposisi"
                value={formData.pemberi_disposisi}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Contoh: Kepala Seksi Wilayah II Pemalang"
                className={`form-input ${errors.pemberi_disposisi && touched.pemberi_disposisi ? 'input--invalid' : ''}`}
                aria-invalid={Boolean(errors.pemberi_disposisi && touched.pemberi_disposisi)}
                aria-describedby={errors.pemberi_disposisi && touched.pemberi_disposisi ? 'err-pemberi' : undefined}
                required
              />
              {errors.pemberi_disposisi && touched.pemberi_disposisi && (
                <span id="err-pemberi" className="form-error-msg" role="alert">
                  <AlertCircle size={13} aria-hidden="true" /> {errors.pemberi_disposisi}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="field-sifat" className="form-label">
                Sifat Urgensi Disposisi
              </label>
              <select
                id="field-sifat"
                name="sifat"
                value={formData.sifat}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Biasa">Biasa (Rutin)</option>
                <option value="Penting">Penting</option>
                <option value="Segera">Segera</option>
                <option value="Sangat Segera">Sangat Segera / Rahasia</option>
              </select>
            </div>
          </div>

          {/* Kolom 3: Tujuan / Penerima Disposisi */}
          <div className="form-group">
            <label htmlFor="field-penerima_disposisi" className="form-label">
              Tujuan Disposisi (Pejabat / Regu Pelaksana) <span className="text-required">*</span>
            </label>
            <select
              id="field-penerima_disposisi"
              name="penerima_disposisi"
              value={formData.penerima_disposisi}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-select ${errors.penerima_disposisi && touched.penerima_disposisi ? 'input--invalid' : ''}`}
              aria-invalid={Boolean(errors.penerima_disposisi && touched.penerima_disposisi)}
              aria-describedby={errors.penerima_disposisi && touched.penerima_disposisi ? 'err-penerima' : undefined}
              required
            >
              <option value="">-- Pilih Pejabat / Unit Pelaksana --</option>
              {OPSI_PENERIMA_DEFAULT.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
              <option value="LAINNYA">Lainnya (Tuliskan nama / jabatan manual)...</option>
            </select>

            {formData.penerima_disposisi === 'LAINNYA' && (
              <input
                type="text"
                name="penerima_custom"
                value={formData.penerima_custom}
                onChange={handleChange}
                placeholder="Tuliskan nama staf atau jabatan penerima..."
                className="form-input form-input--sub"
                style={{ marginTop: '0.5rem' }}
                aria-label="Nama penerima kustom"
                required
              />
            )}

            {errors.penerima_disposisi && touched.penerima_disposisi && (
              <span id="err-penerima" className="form-error-msg" role="alert">
                <AlertCircle size={13} aria-hidden="true" /> {errors.penerima_disposisi}
              </span>
            )}
          </div>

          {/* Kolom 4: Batas Waktu Penyelesaian */}
          <div className="form-group">
            <label htmlFor="field-batas_waktu" className="form-label">
              Batas Waktu Tindak Lanjut (Tenggat) <span className="text-required">*</span>
            </label>
            <input
              id="field-batas_waktu"
              type="date"
              name="batas_waktu"
              value={formData.batas_waktu}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${errors.batas_waktu && touched.batas_waktu ? 'input--invalid' : ''}`}
              aria-invalid={Boolean(errors.batas_waktu && touched.batas_waktu)}
              aria-describedby={errors.batas_waktu && touched.batas_waktu ? 'err-batas_waktu' : undefined}
              required
            />
            {errors.batas_waktu && touched.batas_waktu && (
              <span id="err-batas_waktu" className="form-error-msg" role="alert">
                <AlertCircle size={13} aria-hidden="true" /> {errors.batas_waktu}
              </span>
            )}
          </div>

          {/* Kolom 5: Instruksi Pimpinan (Textarea Wajib) */}
          <div className="form-group">
            <label htmlFor="field-instruksi" className="form-label">
              Instruksi / Arahan Tindak Lanjut Pimpinan <span className="text-required">*</span>
            </label>
            <textarea
              id="field-instruksi"
              name="instruksi"
              rows={3}
              value={formData.instruksi}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Tuliskan instruksi tindakan konkret, misal: 'Segera lakukan koordinasi teknis dan kirim tim regu lapangan...'"
              className={`form-textarea ${errors.instruksi && touched.instruksi ? 'input--invalid' : ''}`}
              aria-invalid={Boolean(errors.instruksi && touched.instruksi)}
              aria-describedby={errors.instruksi && touched.instruksi ? 'err-instruksi' : undefined}
              required
            />
            {errors.instruksi && touched.instruksi ? (
              <span id="err-instruksi" className="form-error-msg" role="alert">
                <AlertCircle size={13} aria-hidden="true" /> {errors.instruksi}
              </span>
            ) : (
              <span className="form-hint">
                Minimal 8 karakter. Berikan instruksi yang jelas bagi staf/regu lapangan.
              </span>
            )}
          </div>

          {/* Kolom 6: Catatan Tambahan (Opsional) */}
          <div className="form-group">
            <label htmlFor="field-catatan" className="form-label">
              Catatan Khusus (Opsional)
            </label>
            <textarea
              id="field-catatan"
              name="catatan"
              rows={2}
              value={formData.catatan}
              onChange={handleChange}
              placeholder="Catatan koordinasi, perlengkapan, atau tenggat pelaporan khusus..."
              className="form-textarea"
            />
          </div>

          {/* Tombol Aksi Form */}
          <footer className="modal-footer">
            <button
              type="button"
              className="btn-footer-secondary"
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
                <>Menerbitkan Disposisi...</>
              ) : (
                <>
                  <Send size={15} aria-hidden="true" />
                  <span>Kirim Lembar Disposisi</span>
                </>
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
