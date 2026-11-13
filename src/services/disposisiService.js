import apiClient, { fetchWithFallback, USE_MOCK } from './api';

/**
 * Service: Disposisi
 * Modul Pengelolaan Disposisi Surat E-Office BKSDA Jawa Tengah
 * Digunakan oleh Anggota 4 pada DisposisiPage.jsx
 */

/**
 * Mengambil daftar lembar disposisi.
 * Endpoint Backend: GET /disposisi
 * Fallback Mock: /mock/disposisi.json
 *
 * @param {object} [params] - Optional query: { search, status, page, limit }
 */
export async function getAllDisposisi(params = {}) {
  const response = await fetchWithFallback('/disposisi', '/mock/disposisi.json', { params });
  let list = Array.isArray(response) ? response : (response.data || []);

  if (USE_MOCK) {
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(item =>
        item.nomor_surat?.toLowerCase().includes(q) ||
        item.perihal?.toLowerCase().includes(q) ||
        item.penerima_disposisi?.toLowerCase().includes(q) ||
        item.instruksi?.toLowerCase().includes(q)
      );
    }
    if (params.status && params.status !== 'all') {
      list = list.filter(item => item.status === params.status);
    }
  }

  return list;
}

/**
 * Mengambil detail lembar disposisi berdasarkan ID.
 * Endpoint Backend: GET /disposisi/{id}
 * Fallback Mock: mencari item by ID dari /mock/disposisi.json
 *
 * @param {number|string} id
 */
export async function getDisposisiById(id) {
  if (USE_MOCK) {
    const list = await getAllDisposisi();
    const found = list.find(item => String(item.id) === String(id));
    if (!found) {
      throw new Error(`Disposisi dengan ID ${id} tidak ditemukan.`);
    }
    return found;
  }

  try {
    const response = await apiClient.get(`/disposisi/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    console.warn(`[disposisiService] Gagal fetch detail id ${id} dari backend, coba fallback mock...`);
    const list = await getAllDisposisi();
    const found = list.find(item => String(item.id) === String(id));
    if (found) return found;
    throw error;
  }
}

/**
 * Membuat lembar disposisi baru untuk suatu surat masuk.
 * Endpoint Backend: POST /disposisi
 *
 * @param {object} payload - { surat_id, penerima_disposisi, instruksi, catatan, batas_waktu }
 */
export async function createDisposisi(payload) {
  if (USE_MOCK) {
    return {
      status: true,
      message: 'Disposisi surat berhasil diteruskan (Simulasi Mock API)',
      data: { id: Date.now(), ...payload, status: 'menunggu' },
    };
  }

  const response = await apiClient.post('/disposisi', payload);
  return response.data;
}

/**
 * Memperbarui status disposisi (tindak lanjut, selesai, dikembalikan).
 * Endpoint Backend: PATCH /disposisi/{id}/tindak-lanjut atau /disposisi/{id}
 *
 * @param {number|string} id
 * @param {string} status - 'menunggu' | 'dalam_proses' | 'selesai' | 'dikembalikan'
 */
export async function updateStatusDisposisi(id, status) {
  if (USE_MOCK) {
    return {
      status: true,
      message: `Status disposisi #${id} berhasil diubah menjadi ${status} (Simulasi Mock API)`,
      data: { id, status },
    };
  }

  const response = await apiClient.patch(`/disposisi/${id}`, { status });
  return response.data;
}

export default {
  getAllDisposisi,
  getDisposisiById,
  createDisposisi,
  updateStatusDisposisi,
};
