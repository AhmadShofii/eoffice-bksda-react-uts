import { fetchWithFallback } from './api';

/**
 * Service: Dashboard
 * Modul Dashboard & Statistik E-Office BKSDA Jawa Tengah
 * Digunakan oleh Anggota 2 pada DashboardPage.jsx
 */

/**
 * Mengambil ringkasan statistik (jumlah surat masuk, surat keluar, disposisi, tugas, dan aktivitas terbaru).
 * Endpoint Backend: GET /dashboard/summary
 * Fallback Mock: /mock/dashboard.json
 */
export async function getDashboardSummary() {
  const response = await fetchWithFallback('/dashboard/summary', '/mock/dashboard.json');
  return response.data || response;
}

/**
 * Mengambil data tren/grafik surat masuk dan keluar bulanan.
 * Endpoint Backend: GET /dashboard/trend
 * Fallback Mock: /mock/dashboard.json
 */
export async function getDashboardTrend() {
  const response = await fetchWithFallback('/dashboard/trend', '/mock/dashboard.json');
  return response.data?.trend || response.trend || [];
}

/**
 * Mengambil data evaluasi kinerja pegawai/seksi.
 * Endpoint Backend: GET /dashboard/kinerja
 * Fallback Mock: /mock/dashboard.json
 */
export async function getKinerjaPegawai() {
  const response = await fetchWithFallback('/dashboard/kinerja', '/mock/dashboard.json');
  return response.data?.kinerja || response.kinerja || [];
}

export default {
  getDashboardSummary,
  getDashboardTrend,
  getKinerjaPegawai,
};
