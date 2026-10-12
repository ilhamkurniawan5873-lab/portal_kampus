'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { getAllGrades, updateGrade, getAllUsers } from '@/lib/store';
import { GradeItem } from '@/lib/types';
import { 
  GraduationCap, 
  Edit3, 
  Check, 
  X, 
  ShieldAlert, 
  Eye, 
  Download, 
  Layers,
  Sparkles,
  Search,
  BookOpen
} from 'lucide-react';

export default function GradesPage() {
  const { currentUser } = useAuth();
  const [grades, setGrades] = useState<GradeItem[]>(getAllGrades());
  const users = getAllUsers();
  const students = users.filter(u => u.role === 'mahasiswa');

  // IDOR simulation state: Mahasiswa viewing someone else's grades
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    currentUser?.role === 'mahasiswa' ? currentUser.id : students[0]?.id || ''
  );

  // Edit Modal State for Dosen
  const [editingGrade, setEditingGrade] = useState<GradeItem | null>(null);
  const [editForm, setEditForm] = useState({
    kehadiran: 100,
    tugas: 85,
    uts: 80,
    uas: 85
  });

  if (!currentUser) return null;

  const role = currentUser.role;

  // Filter grades to display
  const displayedGrades = grades.filter(g => g.studentId === selectedStudentId);
  const targetStudent = users.find(u => u.id === selectedStudentId);

  // Calculate GPA for the selected student
  const totalSks = displayedGrades.reduce((sum, g) => sum + g.sks, 0);
  const totalPoints = displayedGrades.reduce((sum, g) => sum + (g.bobot * g.sks), 0);
  const calculatedIpk = totalSks > 0 ? (totalPoints / totalSks).toFixed(2) : '0.00';

  const handleOpenEdit = (grade: GradeItem) => {
    setEditingGrade(grade);
    setEditForm({
      kehadiran: grade.kehadiran,
      tugas: grade.tugas,
      uts: grade.uts,
      uas: grade.uas
    });
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGrade) return;

    const updatedList = updateGrade(editingGrade.id, {
      kehadiran: Number(editForm.kehadiran),
      tugas: Number(editForm.tugas),
      uts: Number(editForm.uts),
      uas: Number(editForm.uas)
    });

    setGrades(updatedList);
    setEditingGrade(null);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <GraduationCap color="var(--primary-light)" size={30} />
            <span>{role === 'mahasiswa' ? 'Kartu Hasil Studi & Transkrip Nilai' : 'Pengelolaan & Penilaian Nilai Mahasiswa'}</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Daftar nilai semester, bobot SKS, komponen tugas, UTS, UAS, dan huruf mutu.
          </p>
        </div>

        {/* IDOR Indicator & Selector */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.5rem 0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Lihat Transkrip Mahasiswa:
          </div>
          <select
            className="form-select"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
          >
            {students.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name} ({st.identifier}) {st.id === currentUser.id ? '(Saya)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* IDOR Warning Banner if student is viewing another student's grade */}
      {role === 'mahasiswa' && selectedStudentId !== currentUser.id && (
        <div className="security-alert-box">
          <ShieldAlert size={24} color="#f87171" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 700, color: '#f87171', fontSize: '0.9rem' }}>
              🚨 Eksploitasi IDOR / Broken Access Control Berhasil!
            </div>
            <div style={{ fontSize: '0.82rem', color: '#fca5a5', marginTop: '0.25rem', lineHeight: 1.5 }}>
              Anda sedang login sebagai <strong>{currentUser.name}</strong>, namun Anda berhasil melihat seluruh catatan nilai rahasia milik <strong>{targetStudent?.name} ({targetStudent?.identifier})</strong> tanpa verifikasi kepemilikan token dari server.
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#e2e8f0', fontFamily: 'var(--font-mono)' }}>
              API Request: <code>GET /api/grades?studentId={selectedStudentId}</code> [HTTP 200 OK]
            </div>
          </div>
        </div>
      )}

      {/* Student Academic Summary Card */}
      <div className="glass-card" style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Informasi Mahasiswa
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>
            {targetStudent?.name}
          </h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            NIM: <strong>{targetStudent?.identifier}</strong> &bull; Prodi: <strong>{targetStudent?.prodiOrDept}</strong> &bull; Semester: <strong>5</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL SKS</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{totalSks} SKS</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>IPK SEMESTER</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
              {calculatedIpk}
            </div>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Kode &amp; Mata Kuliah</th>
              <th style={{ textAlign: 'center' }}>SKS</th>
              <th style={{ textAlign: 'center' }}>Kehadiran (10%)</th>
              <th style={{ textAlign: 'center' }}>Tugas (25%)</th>
              <th style={{ textAlign: 'center' }}>UTS (30%)</th>
              <th style={{ textAlign: 'center' }}>UAS (35%)</th>
              <th style={{ textAlign: 'center' }}>Nilai Akhir</th>
              <th style={{ textAlign: 'center' }}>Huruf Mutu</th>
              <th style={{ textAlign: 'center' }}>Bobot</th>
              {role === 'dosen' && <th style={{ textAlign: 'center' }}>Aksi Dosen</th>}
            </tr>
          </thead>
          <tbody>
            {displayedGrades.map((g) => (
              <tr key={g.id}>
                <td>
                  <div style={{ fontWeight: 700, color: '#fff' }}>{g.courseName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{g.courseCode}</div>
                </td>
                <td style={{ textAlign: 'center', fontWeight: 600 }}>{g.sks}</td>
                <td style={{ textAlign: 'center' }}>{g.kehadiran}%</td>
                <td style={{ textAlign: 'center' }}>{g.tugas}</td>
                <td style={{ textAlign: 'center' }}>{g.uts}</td>
                <td style={{ textAlign: 'center' }}>{g.uas}</td>
                <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  {g.nilaiAkhir}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`badge ${g.hurufMutu.startsWith('A') ? 'badge-success' : 'badge-warning'}`} style={{ padding: '0.2rem 0.6rem' }}>
                    {g.hurufMutu}
                  </span>
                </td>
                <td style={{ textAlign: 'center', fontWeight: 600 }}>{g.bobot.toFixed(1)}</td>
                {role === 'dosen' && (
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => handleOpenEdit(g)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem' }}
                    >
                      <Edit3 size={13} />
                      <span>Input/Ubah</span>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dosen Edit Grade Modal */}
      {editingGrade && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                  Input &amp; Perbarui Nilai Mahasiswa
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {editingGrade.courseName} &bull; Mahasiswa: {targetStudent?.name} ({targetStudent?.identifier})
                </p>
              </div>
              <button 
                onClick={() => setEditingGrade(null)} 
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.4rem' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveGrade}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="kehadiran">Nilai Kehadiran (0-100)</label>
                  <input
                    id="kehadiran"
                    type="number"
                    min="0"
                    max="100"
                    className="form-input"
                    value={editForm.kehadiran}
                    onChange={(e) => setEditForm({ ...editForm, kehadiran: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="tugas">Nilai Tugas (0-100)</label>
                  <input
                    id="tugas"
                    type="number"
                    min="0"
                    max="100"
                    className="form-input"
                    value={editForm.tugas}
                    onChange={(e) => setEditForm({ ...editForm, tugas: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="uts">Nilai UTS (0-100)</label>
                  <input
                    id="uts"
                    type="number"
                    min="0"
                    max="100"
                    className="form-input"
                    value={editForm.uts}
                    onChange={(e) => setEditForm({ ...editForm, uts: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="uas">Nilai UAS (0-100)</label>
                  <input
                    id="uas"
                    type="number"
                    min="0"
                    max="100"
                    className="form-input"
                    value={editForm.uas}
                    onChange={(e) => setEditForm({ ...editForm, uas: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div style={{
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                margin: '1.25rem 0',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>Rumus Penilaian Otomatis:</div>
                NA = (10% &times; Hadir) + (25% &times; Tugas) + (30% &times; UTS) + (35% &times; UAS)
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingGrade(null)}
                  className="btn btn-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <Check size={16} />
                  <span>Simpan Nilai Akhir</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
