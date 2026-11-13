import apiClient, { fetchWithFallback, USE_MOCK } from './api';

/**
 * Service: Tugas Pegawai
 * Modul Penugasan & Monitoring Tugas E-Office BKSDA Jawa Tengah
 * Digunakan oleh Anggota 5 pada TugasPage.jsx
 */

/**
 * Mengambil daftar tugas pegawai dengan filter status & pencarian.
 * Endpoint Backend: GET /tugas
 * Fallback Mock: /mock/tugas.json
 *
 * @param {object} [params] - Optional query: { search, status, prioritas, page, limit }
 */
export async function getAllTugas(params = {}) {
  const response = await fetchWithFallback('/tugas', '/mock/tugas.json', { params });
  let list = Array.isArray(response) ? response : (response.data || []);

  if (USE_MOCK) {
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(item =>
        item.judul?.toLowerCase().includes(q) ||
        item.deskripsi?.toLowerCase().includes(q) ||
        item.penanggung_jawab?.toLowerCase().includes(q)
      );
    }
    if (params.status && params.status !== 'all') {
      list = list.filter(item => item.status === params.status);
    }
  }

  return list;
}

/**
 * Mengambil detail tugas berdasarkan ID.
 * Endpoint Backend: GET /tugas/{id}
 * Fallback Mock: mencari item by ID dari /mock/tugas.json
 *
 * @param {number|string} id
 */
export async function getTugasById(id) {
  if (USE_MOCK) {
    const list = await getAllTugas();
    const found = list.find(item => String(item.id) === String(id));
    if (!found) {
      throw new Error(`Tugas dengan ID ${id} tidak ditemukan.`);
    }
    return found;
  }

  try {
    const response = await apiClient.get(`/tugas/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    console.warn(`[tugasService] Gagal fetch detail id ${id} dari backend, coba fallback mock...`);
    const list = await getAllTugas();
    const found = list.find(item => String(item.id) === String(id));
    if (found) return found;
    throw error;
  }
}

/**
 * Menambahkan tugas baru (delegasi tugas oleh pimpinan/seksi).
 * Endpoint Backend: POST /tugas
 *
 * @param {object} payload - { judul, deskripsi, penanggung_jawab, prioritas, tenggat_waktu }
 */
export async function createTugas(payload) {
  if (USE_MOCK) {
    return {
      status: true,
      message: 'Tugas baru berhasil ditambahkan (Simulasi Mock API)',
      data: { id: Date.now(), ...payload, status: 'belum_dikerjakan' },
    };
  }

  const response = await apiClient.post('/tugas', payload);
  return response.data;
}

/**
 * Memperbarui status tugas ('belum_dikerjakan' | 'proses' | 'selesai').
 * Endpoint Backend: PATCH /tugas/{id}
 *
 * @param {number|string} id
 * @param {string} status
 */
export async function updateStatusTugas(id, status) {
  if (USE_MOCK) {
    return {
      status: true,
      message: `Status tugas #${id} berhasil diubah menjadi ${status} (Simulasi Mock API)`,
      data: { id, status },
    };
  }

  const response = await apiClient.patch(`/tugas/${id}`, { status });
  return response.data;
}

export default {
  getAllTugas,
  getTugasById,
  createTugas,
  updateStatusTugas,
};
