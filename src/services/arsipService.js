import apiClient, { fetchWithFallback, USE_MOCK } from './api';

/**
 * Service: Arsip Dokumen
 * Modul Pengarsipan Surat & Dokumen Resmi E-Office BKSDA Jawa Tengah
 * Digunakan oleh Anggota 4 pada ArsipPage.jsx
 */

/**
 * Mengambil daftar arsip dokumen dengan filter & pencarian.
 * Endpoint Backend: GET /arsip
 * Fallback Mock: /mock/arsip.json
 *
 * @param {object} [params] - Optional query: { search, kategori, tahun, page, limit }
 */
export async function getAllArsip(params = {}) {
  const response = await fetchWithFallback('/arsip', '/mock/arsip.json', { params });
  let list = Array.isArray(response) ? response : (response.data || []);

  if (USE_MOCK) {
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(item =>
        item.judul?.toLowerCase().includes(q) ||
        item.kode_klasifikasi?.toLowerCase().includes(q) ||
        item.nomor_surat?.toLowerCase().includes(q)
      );
    }
    if (params.kategori && params.kategori !== 'all') {
      list = list.filter(item => item.kategori === params.kategori);
    }
  }

  return list;
}

/**
 * Mengambil detail arsip dokumen berdasarkan ID.
 * Endpoint Backend: GET /arsip/{id}
 * Fallback Mock: mencari item by ID dari /mock/arsip.json
 *
 * @param {number|string} id
 */
export async function getArsipById(id) {
  if (USE_MOCK) {
    const list = await getAllArsip();
    const found = list.find(item => String(item.id) === String(id));
    if (!found) {
      throw new Error(`Dokumen arsip dengan ID ${id} tidak ditemukan.`);
    }
    return found;
  }

  try {
    const response = await apiClient.get(`/arsip/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    console.warn(`[arsipService] Gagal fetch detail id ${id} dari backend, coba fallback mock...`);
    const list = await getAllArsip();
    const found = list.find(item => String(item.id) === String(id));
    if (found) return found;
    throw error;
  }
}

/**
 * Mendaftarkan arsip baru ke sistem.
 * Endpoint Backend: POST /arsip
 *
 * @param {object} payload
 */
export async function createArsip(payload) {
  if (USE_MOCK) {
    return {
      status: true,
      message: 'Dokumen berhasil diarsipkan (Simulasi Mock API)',
      data: { id: Date.now(), ...payload },
    };
  }

  const response = await apiClient.post('/arsip', payload);
  return response.data;
}

/**
 * Menghapus data arsip dokumen.
 * Endpoint Backend: DELETE /arsip/{id}
 *
 * @param {number|string} id
 */
export async function deleteArsip(id) {
  if (USE_MOCK) {
    return {
      status: true,
      message: `Dokumen arsip #${id} berhasil dihapus (Simulasi Mock API)`,
    };
  }

  const response = await apiClient.delete(`/arsip/${id}`);
  return response.data;
}

export default {
  getAllArsip,
  getArsipById,
  createArsip,
  deleteArsip,
};
