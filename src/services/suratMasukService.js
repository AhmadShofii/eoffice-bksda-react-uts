import apiClient, { fetchWithFallback, USE_MOCK } from './api';

/**
 * Service: Surat Masuk
 * Modul Pengelolaan Surat Masuk E-Office BKSDA Jawa Tengah
 * Digunakan oleh Anggota 3 pada SuratMasukPage.jsx
 */

/**
 * Mengambil daftar surat masuk dengan dukungan pencarian & filter parameter.
 * Endpoint Backend: GET /surat-masuk
 * Fallback Mock: /mock/surat-masuk.json
 *
 * @param {object} [params] - Optional query params: { search, status, sifat, page, limit }
 */
export async function getAllSuratMasuk(params = {}) {
  const response = await fetchWithFallback('/surat-masuk', '/mock/surat-masuk.json', { params });
  let list = Array.isArray(response) ? response : (response.data || []);

  // Filter client-side jika menggunakan Mock API
  if (USE_MOCK) {
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(item =>
        item.nomor_surat?.toLowerCase().includes(q) ||
        item.perihal?.toLowerCase().includes(q) ||
        item.pengirim?.toLowerCase().includes(q)
      );
    }
    if (params.status && params.status !== 'all') {
      list = list.filter(item => item.status === params.status);
    }
    if (params.sifat && params.sifat !== 'all') {
      list = list.filter(item => item.sifat === params.sifat);
    }
    if (params.kategori && params.kategori !== 'all') {
      list = list.filter(item => item.kategori === params.kategori);
    }
  }

  return list;
}

/**
 * Mengambil detail surat masuk berdasarkan ID.
 * Endpoint Backend: GET /surat-masuk/{id}
 * Fallback Mock: mencari item by ID dari /mock/surat-masuk.json
 *
 * @param {number|string} id
 */
export async function getSuratMasukById(id) {
  if (USE_MOCK) {
    const list = await getAllSuratMasuk();
    const found = list.find(item => String(item.id) === String(id));
    if (!found) {
      throw new Error(`Surat masuk dengan ID ${id} tidak ditemukan.`);
    }
    return found;
  }

  try {
    const response = await apiClient.get(`/surat-masuk/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    console.warn(`[suratMasukService] Gagal fetch detail id ${id} dari backend, coba fallback mock...`);
    const list = await getAllSuratMasuk();
    const found = list.find(item => String(item.id) === String(id));
    if (found) return found;
    throw error;
  }
}

/**
 * Menambahkan surat masuk baru.
 * Endpoint Backend: POST /surat-masuk
 *
 * @param {object} payload - { nomor_surat, pengirim, perihal, tanggal_surat, tanggal_terima, kategori, sifat, ringkasan }
 */
export async function createSuratMasuk(payload) {
  if (USE_MOCK) {
    // Simulasi sukses penambahan pada mode mock
    return {
      status: true,
      message: 'Surat masuk berhasil ditambahkan (Simulasi Mock API)',
      data: { id: Date.now(), ...payload, status: 'baru' },
    };
  }

  const response = await apiClient.post('/surat-masuk', payload);
  return response.data;
}

/**
 * Memperbarui data surat masuk.
 * Endpoint Backend: PUT /surat-masuk/{id}
 *
 * @param {number|string} id
 * @param {object} payload
 */
export async function updateSuratMasuk(id, payload) {
  if (USE_MOCK) {
    return {
      status: true,
      message: `Surat masuk #${id} berhasil diperbarui (Simulasi Mock API)`,
      data: { id, ...payload },
    };
  }

  const response = await apiClient.put(`/surat-masuk/${id}`, payload);
  return response.data;
}

/**
 * Menghapus surat masuk.
 * Endpoint Backend: DELETE /surat-masuk/{id}
 *
 * @param {number|string} id
 */
export async function deleteSuratMasuk(id) {
  if (USE_MOCK) {
    return {
      status: true,
      message: `Surat masuk #${id} berhasil dihapus (Simulasi Mock API)`,
    };
  }

  const response = await apiClient.delete(`/surat-masuk/${id}`);
  return response.data;
}

export default {
  getAllSuratMasuk,
  getSuratMasukById,
  createSuratMasuk,
  updateSuratMasuk,
  deleteSuratMasuk,
};
