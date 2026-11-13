import axios from 'axios';

/**
 * Konfigurasi Utama Axios Client
 * E-Office BKSDA Jawa Tengah
 *
 * Fitur:
 * - Menggunakan Base URL dari environment variable (.env)
 * - Request Interceptor untuk menyematkan Bearer Token secara otomatis
 * - Response Interceptor untuk penanganan pesan error yang informatif & terstandarisasi
 * - Dukungan Mock API seamless jika VITE_USE_MOCK=true (sesuai spesifikasi Tugas Besar UTS)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === true;

// Instance Axios utama untuk Backend API
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Instance Axios khusus untuk fetch Mock JSON lokal (dari folder /public/mock/)
export const mockClient = axios.create({
  baseURL: import.meta.env.BASE_URL || '/',
  timeout: 5000,
  headers: {
    'Accept': 'application/json',
  },
});

/**
 * Request Interceptor:
 * Menambahkan Bearer Token ke Authorization Header jika tersimpan di localStorage.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor:
 * Menstandarisasi struktur error agar mudah ditangani oleh komponen UI di setiap modul.
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let friendlyMessage = 'Terjadi kesalahan pada sistem. Silakan coba beberapa saat lagi.';

    if (error.response) {
      // Server merespon dengan status code di luar jangkauan 2xx
      const { status, data } = error.response;
      const serverMessage = data?.message || data?.error;

      switch (status) {
        case 400:
          friendlyMessage = serverMessage || 'Permintaan tidak valid. Mohon periksa kembali input Anda.';
          break;
        case 401:
          friendlyMessage = 'Sesi Anda telah berakhir atau belum terautentikasi. Silakan login kembali.';
          // Opsi: membersihkan token kadaluarsa
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          break;
        case 403:
          friendlyMessage = serverMessage || 'Anda tidak memiliki hak akses untuk tindakan ini.';
          break;
        case 404:
          friendlyMessage = serverMessage || 'Data atau sumber daya yang diminta tidak ditemukan.';
          break;
        case 422:
          friendlyMessage = serverMessage || 'Validasi gagal. Pastikan seluruh kolom terisi dengan benar.';
          break;
        case 500:
          friendlyMessage = 'Terjadi masalah pada server internal. Silakan hubungi administrator sistem.';
          break;
        default:
          friendlyMessage = serverMessage || `Terjadi kesalahan (Kode status: ${status}).`;
      }

      error.userFriendlyMessage = friendlyMessage;
      error.serverValidationErrors = data?.errors || null;
    } else if (error.request) {
      // Request terkirim namun tidak mendapat balasan (misal server mati/CORS)
      friendlyMessage = 'Tidak dapat terhubung ke server backend BKSDA. Pastikan koneksi jaringan aktif.';
      error.userFriendlyMessage = friendlyMessage;
    } else {
      // Kesalahan dalam inisialisasi request
      friendlyMessage = error.message || friendlyMessage;
      error.userFriendlyMessage = friendlyMessage;
    }

    return Promise.reject(error);
  }
);

/**
 * Helper Universal: fetchWithFallback
 * Mengambil data dari backend API asli terlebih dahulu jika VITE_USE_MOCK=false.
 * Jika backend gagal/offline atau VITE_USE_MOCK=true, otomatis fallback ke Mock API JSON.
 *
 * @param {string} apiEndpoint - Path endpoint backend (contoh: '/surat-masuk')
 * @param {string} mockPath - Path file mock JSON (contoh: '/mock/surat-masuk.json')
 * @param {object} [axiosConfig] - Konfigurasi axios tambahan
 */
export async function fetchWithFallback(apiEndpoint, mockPath, axiosConfig = {}) {
  // Jika konfigurasi mengaktifkan Mock API secara eksplisit
  if (USE_MOCK) {
    const res = await mockClient.get(mockPath, axiosConfig);
    return res.data;
  }

  // Jika mode backend aktif, coba request ke backend BKSDA
  try {
    const res = await apiClient.get(apiEndpoint, axiosConfig);
    return res.data;
  } catch (backendError) {
    console.warn(`[API] Gagal terhubung ke backend (${apiEndpoint}). Mengalihkan ke mock fallback (${mockPath})...`, backendError.message);
    const mockRes = await mockClient.get(mockPath, axiosConfig);
    return mockRes.data;
  }
}

export default apiClient;
