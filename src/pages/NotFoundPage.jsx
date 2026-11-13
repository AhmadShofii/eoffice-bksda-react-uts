import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="page-container">
      <section className="placeholder-card" style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
        <div className="placeholder-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
          <AlertTriangle size={48} />
        </div>
        <h1 className="placeholder-title" style={{ fontSize: '1.75rem', marginTop: '1rem' }}>
          404 - Halaman Tidak Ditemukan
        </h1>
        <p className="placeholder-desc">
          Alamat URL yang Anda tuju tidak terdaftar di sistem E-Office BKSDA Jawa Tengah.
        </p>
        <Link to="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', textDecoration: 'none' }}>
          <Home size={18} /> Kembali ke Dashboard
        </Link>
      </section>
    </div>
  );
}
