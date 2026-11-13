/**
 * Central Service Layer Export
 * E-Office BKSDA Jawa Tengah
 *
 * Seluruh modul service terkonsentrasi di sini untuk mempermudah impor
 * oleh Anggota 2, 3, 4, dan 5 saat mengembangkan halaman masing-masing.
 */

export * from './api';
export { default as apiClient } from './api';

export * from './dashboardService';
export { default as dashboardService } from './dashboardService';

export * from './suratMasukService';
export { default as suratMasukService } from './suratMasukService';

export * from './suratKeluarService';
export { default as suratKeluarService } from './suratKeluarService';

export * from './disposisiService';
export { default as disposisiService } from './disposisiService';

export * from './arsipService';
export { default as arsipService } from './arsipService';

export * from './tugasService';
export { default as tugasService } from './tugasService';
