'use client';

import React from 'react';
import { useAuth } from '@/lib/authContext';
import { resetAllDataToDefault } from '@/lib/store';
import { ShieldAlert, RotateCcw, UserCheck, Shield } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const { currentUser, quickSwitch, refreshUsers } = useAuth();

  if (!currentUser) return null;

  const handleResetData = () => {
    if (confirm('Kembalikan seluruh data mahasiswa, dosen, tugas, nilai, dan forum ke data awal sintetis?')) {
      resetAllDataToDefault();
      refreshUsers();
      window.location.reload();
    }
  };

  return (
    <header className="header">
      {/* Left Title / Context */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Portal Akademik &bull;</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
              {currentUser.prodiOrDept}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
              Halo, {currentUser.name}
            </span>
            <span className={`badge badge-${currentUser.role}`}>
              {currentUser.role}
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls: Quick Switcher + Security Badge + Reset */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Quick Role Switcher for Evaluators / Lab */}
        <div className="quick-switcher-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', paddingLeft: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
            <UserCheck size={14} color="var(--primary-light)" />
            <span>Switch:</span>
          </div>

          <button
            onClick={() => quickSwitch('mhs-001')}
            className={`switcher-pill ${currentUser.id === 'mhs-001' ? 'active' : ''}`}
            title="Masuk sebagai Budi Santoso (Mahasiswa)"
          >
            Mahasiswa (Budi)
          </button>

          <button
            onClick={() => quickSwitch('dos-001')}
            className={`switcher-pill ${currentUser.id === 'dos-001' ? 'active' : ''}`}
            title="Masuk sebagai Dr. Hendra Gunawan (Dosen)"
          >
            Dosen (Dr. Hendra)
          </button>

          <button
            onClick={() => quickSwitch('adm-001')}
            className={`switcher-pill ${currentUser.id === 'adm-001' ? 'active' : ''}`}
            title="Masuk sebagai Admin Sistem Puskom"
          >
            Admin (Puskom)
          </button>
        </div>

        {/* Security Lab PoC Link Button */}
        <Link 
          href="/dashboard/security-lab" 
          className="btn btn-warning btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
        >
          <ShieldAlert size={14} />
          <span>Panduan Celah (PoC)</span>
        </Link>

        {/* Reset Database */}
        <button
          onClick={handleResetData}
          className="btn btn-secondary btn-sm"
          title="Reset semua perubahan data kembali ke data sintetis awal"
          style={{ padding: '0.45rem 0.65rem' }}
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </header>
  );
}
