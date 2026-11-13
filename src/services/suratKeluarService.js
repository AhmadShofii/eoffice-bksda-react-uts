import apiClient, { fetchWithFallback, USE_MOCK } from './api';

/**
 * Service: Surat Keluar
 * Modul Pengelolaan Surat Keluar E-Office BKSDA Jawa Tengah
 * Digunakan oleh Anggota 3 pada SuratKeluarPage.jsx
 */

/**
 * Mengambil daftar surat keluar dengan filter & pencarian.
 * Endpoint Backend: GET /surat-keluar
 * Fallback Mock: /mock/surat-keluar.json
 *
 * @param {object} [params] - Optional query: { search, status, sifat, page, limit }
 */
export async function getAllSuratKeluar(params = {}) {
  const response = await fetchWithFallback('/surat-keluar', '/mock/surat-keluar.json', { params });
  let list = Array.isArray(response) ? response : (response.data || []);

  if (USE_MOCK) {
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(item =>
        item.nomor_surat?.toLowerCase().includes(q) ||
        item.perihal?.toLowerCase().includes(q) ||
        item.tujuan?.toLowerCase().includes(q)
      );
    }
    if (params.status && params.status !== 'all') {
      list = list.filter(item => item.status === params.status);
    }
  }

  return list;
}

/**
 * Mengambil detail surat keluar berdasarkan ID.
 * Endpoint Backend: GET /surat-keluar/{id}
 * Fallback Mock: mencari item by ID dari /mock/surat-keluar.json
 *
 * @param {number|string} id
 */
export async function getSuratKeluarById(id) {
  if (USE_MOCK) {
    const list = await getAllSuratKeluar();
    const found = list.find(item => String(item.id) === String(id));
    if (!found) {
      throw new Error(`Surat keluar dengan ID ${id} tidak ditemukan.`);
    }
    return found;
  }

  try {
    const response = await apiClient.get(`/surat-keluar/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    console.warn(`[suratKeluarService] Gagal fetch detail id ${id} dari backend, coba fallback mock...`);
    const list = await getAllSuratKeluar();
    const found = list.find(item => String(item.id) === String(id));
    if (found) return found;
    throw error;
  }
}

/**
 * Membuat draf/surat keluar baru.
 * Endpoint Backend: POST /surat-keluar
 *
 * @param {object} payload
 */
export async function createSuratKeluar(payload) {
  if (USE_MOCK) {
    return {
      status: true,
      message: 'Surat keluar berhasil dibuat (Simulasi Mock API)',
      data: { id: Date.now(), ...payload, status: 'draft' },
    };
  }

  const response = await apiClient.post('/surat-keluar', payload);
  return response.data;
}

/**
 * Memperbarui surat keluar.
 * Endpoint Backend: PUT /surat-keluar/{id}
 *
 * @param {number|string} id
 * @param {object} payload
 */
export async function updateSuratKeluar(id, payload) {
  if (USE_MOCK) {
    return {
      status: true,
      message: `Surat keluar #${id} berhasil diperbarui (Simulasi Mock API)`,
      data: { id, ...payload },
    };
  }

  const response = await apiClient.put(`/surat-keluar/${id}`, payload);
  return response.data;
}

/**
 * Menghapus surat keluar.
 * Endpoint Backend: DELETE /surat-keluar/{id}
 *
 * @param {number|string} id
 */
export async function deleteSuratKeluar(id) {
  if (USE_MOCK) {
    return {
      status: true,
      message: `Surat keluar #${id} berhasil dihapus (Simulasi Mock API)`,
    };
  }

  const response = await apiClient.delete(`/surat-keluar/${id}`);
  return response.data;
}

export default {
  getAllSuratKeluar,
  getSuratKeluarById,
  createSuratKeluar,
  updateSuratKeluar,
  deleteSuratKeluar,
};
