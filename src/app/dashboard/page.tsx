'use client';

import React from 'react';
import { useAuth } from '@/lib/authContext';
import { 
  getAllCourses, 
  getAllAssignments, 
  getAllSubmissions, 
  getAllGrades,
  getAllUsers
} from '@/lib/store';
import { 
  GraduationCap, 
  BookOpen, 
  FileText, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  Award, 
  ShieldAlert,
  Calendar,
  Layers
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const role = currentUser.role;
  const submissions = getAllSubmissions();
  const assignments = getAllAssignments();
  const allUsers = getAllUsers();
  const allGrades = getAllGrades();

  // Student specific data
  const mySubmissions = submissions.filter(s => s.studentId === currentUser.id);
  const myGrades = allGrades.filter(g => g.studentId === currentUser.id);
  const pendingAssignments = assignments.filter(
    a => !mySubmissions.some(s => s.assignmentId === a.id)
  );

  // Lecturer specific data
  const ungradedSubmissions = submissions.filter(s => s.status === 'submitted');

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(124, 58, 237, 0.1) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className={`badge badge-${role}`}>{role}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Semester Ganjil 2026/2027
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Selamat Datang di Portal, {currentUser.name}!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {currentUser.prodiOrDept} &bull; Identitas ({role === 'mahasiswa' ? 'NIM' : 'NIP'}): <strong>{currentUser.identifier}</strong>
          </p>
        </div>

        {/* Security Lab Hint Banner */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          maxWidth: '360px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontSize: '0.8rem', fontWeight: 700 }}>
            <ShieldAlert size={16} />
            <span>Mode Latihan Cyber Security</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.4 }}>
            Sistem memiliki celah sengaja <strong>Stored XSS</strong> pada Forum &amp; <strong>IDOR</strong> pada berkas tugas/nilai.
          </p>
          <Link href="/dashboard/security-lab" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600, marginTop: '0.4rem' }}>
            Buka Panduan Eksploitasi &rarr;
          </Link>
        </div>
      </div>

      {/* Role-Specific Metric Stats */}
      {role === 'mahasiswa' && (
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
              <Award size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Indeks Prestasi Kumulatif</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>{currentUser.ipk || '3.78'}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>Status: Sangat Memuaskan</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary-light)' }}>
              <Layers size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>SKS Terdaftar</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>11 SKS</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Semester {currentUser.semester || 5}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
              <CheckCircle size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tugas Dikumpulkan</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>{mySubmissions.length}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                {mySubmissions.filter(s => s.status === 'graded').length} Sudah Dinilai
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
              <Clock size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tugas Perlu Diunggah</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>{pendingAssignments.length}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-amber)' }}>Batas waktu aktif</div>
            </div>
          </div>
        </div>
      )}

      {role === 'dosen' && (
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-violet)' }}>
              <BookOpen size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Mata Kuliah Diampu</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>3 Kelas</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>Ganjil 2026/2027</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
              <AlertCircle size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tugas Menunggu Nilai</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fbbf24' }}>{ungradedSubmissions.length}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-amber)' }}>Perlu koreksi &amp; feedback</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
              <Users size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Mahasiswa</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>3 Mahasiswa</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Kelas Paralel A</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
              <CheckCircle size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tugas Selesai Dinilai</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
                {submissions.filter(s => s.status === 'graded').length}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)' }}>Sudah terbit di KHS</div>
            </div>
          </div>
        </div>
      )}

      {role === 'admin' && (
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)' }}>
              <Users size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Akun Pengguna</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>{allUsers.length}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-rose)' }}>Akun Sintetis Aktif</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
              <GraduationCap size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Mahasiswa Terdaftar</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
                {allUsers.filter(u => u.role === 'mahasiswa').length}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>NIM Unik</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-violet)' }}>
              <BookOpen size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Dosen Pengampu</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
                {allUsers.filter(u => u.role === 'dosen').length}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>NIP Unik</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
              <CheckCircle size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status Keamanan Portal</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>Lab Simulation</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-rose)' }}>2 Celah Terbuka untuk Latihan</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Action Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
        {/* Section 1: Quick Action Cards */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} color="var(--primary-light)" />
            <span>Aktivitas Utama &amp; Pintasan Cepat</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link
              href="/dashboard/assignments"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                  {role === 'mahasiswa' ? 'Unggah / Kelola Pengumpulan Tugas' : 'Periksa & Beri Nilai Tugas Mahasiswa'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {role === 'mahasiswa' 
                    ? 'Submit tugas praktikum dan lihat feedback dosen' 
                    : `${ungradedSubmissions.length} pengumpulan tugas mahasiswa menunggu penilaian`}
                </div>
              </div>
              <ArrowRight size={16} color="var(--primary-light)" />
            </Link>

            <Link
              href="/dashboard/grades"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                  {role === 'mahasiswa' ? 'Kartu Hasil Studi (KHS) & Nilai' : 'Manajemen Nilai & KHS Mahasiswa'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Lihat rincian tugas, UTS, UAS, dan huruf mutu akademik
                </div>
              </div>
              <ArrowRight size={16} color="var(--primary-light)" />
            </Link>

            <Link
              href="/dashboard/forum"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px dashed rgba(239, 68, 68, 0.3)',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f87171' }}>
                  Forum Diskusi Kuliah (Celah Stored XSS)
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Diskusikan materi kuliah atau uji eksekusi skrip payload XSS
                </div>
              </div>
              <ArrowRight size={16} color="#f87171" />
            </Link>

            {role === 'admin' && (
              <Link
                href="/dashboard/admin"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                    Kelola Seluruh Akun Pengguna (CRUD)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Tambah, perbarui, dan reset akun Mahasiswa/Dosen/Admin
                  </div>
                </div>
                <ArrowRight size={16} color="var(--accent-rose)" />
              </Link>
            )}
          </div>
        </div>

        {/* Section 2: Recent Activity / Submission Overview */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} color="var(--accent-cyan)" />
            <span>Pengumpulan Tugas Terakhir di Portal</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {submissions.slice(0, 3).map((sub) => (
              <div
                key={sub.id}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>
                    {sub.studentName} ({sub.studentNim})
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    {sub.courseName} &bull; {sub.fileName}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  {sub.grade !== null ? (
                    <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                      Nilai: {sub.grade}
                    </span>
                  ) : (
                    <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
                      Belum Dinilai
                    </span>
                  )}
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    ID: <code>{sub.id}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <Link
              href="/dashboard/assignments"
              className="btn btn-secondary btn-sm"
              style={{ width: '100%' }}
            >
              Lihat Seluruh Pengumpulan Tugas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
