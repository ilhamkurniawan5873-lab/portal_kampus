'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { 
  ShieldCheck, 
  GraduationCap, 
  User, 
  KeyRound, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Bug, 
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, quickSwitch, users } = useAuth();
  const [username, setUsername] = useState('budi.santoso');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(username, password);
    if (success) {
      router.push('/dashboard');
    } else {
      setError('Kredensial tidak valid! Silakan gunakan akun sintetis yang tersedia.');
    }
  };

  const handleQuickLogin = (userId: string) => {
    quickSwitch(userId);
    router.push('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'radial-gradient(ellipse at 50% 10%, rgba(99, 102, 241, 0.15) 0%, rgba(11, 15, 25, 1) 70%)',
      padding: '2rem 1rem'
    }}>
      {/* Top Banner Notice */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto 2.5rem',
        width: '100%',
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldAlert color="#f87171" size={20} />
          <span style={{ fontSize: '0.85rem', color: '#fca5a5', fontWeight: 500 }}>
            <strong>Portal Latihan Keamanan Siber:</strong> Dilengkapi 2 celah yang sengaja dibuat: 
            <span style={{ textDecoration: 'underline', marginLeft: '4px' }}>Stored XSS (Forum)</span> &amp; 
            <span style={{ textDecoration: 'underline', marginLeft: '4px' }}>IDOR (Unduh Tugas & Nilai)</span>.
          </span>
        </div>
        <button
          onClick={() => { quickSwitch('mhs-001'); router.push('/dashboard/security-lab'); }}
          className="btn btn-warning btn-sm"
          style={{ fontSize: '0.75rem' }}
        >
          Lihat Panduan PoC Lab &rarr;
        </button>
      </div>

      <div style={{
        maxWidth: '1100px',
        margin: 'auto',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '2.5rem',
        alignItems: 'center'
      }}>
        {/* Left Column: University Presentation */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '999px',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: 'var(--accent-cyan)',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '1.25rem'
          }}>
            <Sparkles size={14} />
            <span>SISTEM INFORMASI AKADEMIK DIGITAL</span>
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Universitas Digital Nusantara
          </h1>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            lineHeight: 1.6,
            marginBottom: '2rem'
          }}>
            Portal terpadu untuk civitas akademika: mahasiswa dapat melihat KHS, mengunggah tugas kuliah, dan berdiskusi interaktif; dosen dapat mengevaluasi dan memberi nilai; serta admin mengelola seluruh data akun sintetis.
          </p>

          {/* Quick Demo Login Cards */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem'
          }}>
            <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} color="var(--accent-emerald)" />
              1-Klik Akses Demo Akun Sintetis (Cepat):
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {/* Mahasiswa Budi */}
              <button
                onClick={() => handleQuickLogin('mhs-001')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--accent-cyan)')}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Budi Santoso</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mahasiswa &bull; NIM: 2301010042 &bull; TI</div>
                </div>
                <span className="badge badge-mahasiswa">Mahasiswa</span>
              </button>

              {/* Dosen Dr. Hendra */}
              <button
                onClick={() => handleQuickLogin('dos-001')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--accent-violet)')}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Dr. Hendra Gunawan, S.Kom., M.T.</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dosen &bull; NIP: 198204122008121003</div>
                </div>
                <span className="badge badge-dosen">Dosen</span>
              </button>

              {/* Admin Puskom */}
              <button
                onClick={() => handleQuickLogin('adm-001')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--accent-rose)')}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Super Admin Puskom</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Biro Sistem Informasi &bull; NIP: 198501012010011005</div>
                </div>
                <span className="badge badge-admin">Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Standard Login Form */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
              Masuk ke Akun Anda
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Silakan masukkan username/NIM dan kata sandi Anda.
            </p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              color: '#fca5a5',
              fontSize: '0.85rem',
              marginBottom: '1.25rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleManualLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">
                Username / NIM / NIP
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="username"
                  type="text"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="misal: budi.santoso atau 2301010042"
                  required
                />
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Kata Sandi
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
                <KeyRound size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', marginTop: '0.75rem' }}
            >
              <span>Masuk Sekarang</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            textAlign: 'center'
          }}>
            Kredensial Default: Mahasiswa/Dosen password <code>Password123!</code> | Admin password <code>AdminSecure2026!</code>
          </div>
        </div>
      </div>
    </div>
  );
}
