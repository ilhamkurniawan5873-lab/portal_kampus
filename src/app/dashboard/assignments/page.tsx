'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { 
  getAllAssignments, 
  getAllSubmissions, 
  addSubmission, 
  updateSubmissionGrade 
} from '@/lib/store';
import { Assignment, Submission } from '@/lib/types';
import { 
  FileText, 
  Upload, 
  Download, 
  CheckCircle, 
  Clock, 
  ShieldAlert, 
  AlertTriangle,
  FileCheck,
  Eye,
  Check,
  X,
  MessageSquare,
  Lock,
  Unlock
} from 'lucide-react';

export default function AssignmentsPage() {
  const { currentUser } = useAuth();
  const [assignments] = useState<Assignment[]>(getAllAssignments());
  const [submissions, setSubmissions] = useState<Submission[]>(getAllSubmissions());

  // Upload Assignment Form State (Mahasiswa)
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(assignments[0]?.id || '');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadNotes, setUploadNotes] = useState('');
  const [uploadPreview, setUploadPreview] = useState('');

  // Grading Modal State (Dosen)
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(85);
  const [feedbackInput, setFeedbackInput] = useState<string>('Analisis sudah sangat komprehensif.');

  // IDOR Inspection Modal / State
  const [idorInspectedSubmission, setIdorInspectedSubmission] = useState<Submission | null>(null);
  const [manualIdorInput, setManualIdorInput] = useState<string>('sub-102');
  const [idorError, setIdorError] = useState<string>('');

  if (!currentUser) return null;

  const role = currentUser.role;

  // Filter submissions by student for Mahasiswa normal view
  const mySubmissions = submissions.filter(s => s.studentId === currentUser.id);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;

    const assignment = assignments.find(a => a.id === selectedAssignmentId);

    const newSub: Submission = {
      id: `sub-${Date.now().toString().slice(-4)}`,
      assignmentId: selectedAssignmentId,
      assignmentTitle: assignment?.title || 'Tugas Kuliah',
      courseName: assignment?.courseName || 'Keamanan Siber',
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentNim: currentUser.identifier,
      submittedAt: new Date().toLocaleString('id-ID'),
      fileName: uploadFileName,
      fileSize: '1.8 MB',
      fileContentPreview: uploadPreview || 'Jawaban tugas telah diunggah dan siap dievaluasi oleh dosen pengampu.',
      notes: uploadNotes,
      grade: null,
      feedback: null,
      status: 'submitted'
    };

    const updated = addSubmission(newSub);
    setSubmissions(updated);
    setShowUploadModal(false);
    setUploadFileName('');
    setUploadNotes('');
    setUploadPreview('');
    alert('Tugas berhasil diunggah!');
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    const updated = updateSubmissionGrade(gradingSubmission.id, Number(gradeInput), feedbackInput);
    setSubmissions(updated);
    setGradingSubmission(null);
  };

  const handleTriggerIdor = async (submissionIdToTest: string) => {
    setIdorError('');
    // Simulate direct endpoint request /api/submissions/[id]
    try {
      const res = await fetch(`/api/submissions/${submissionIdToTest}`);
      const json = await res.json();
      if (json.success && json.data) {
        setIdorInspectedSubmission(json.data);
      } else {
        // Fallback to local store if not on server yet
        const matched = submissions.find(s => s.id === submissionIdToTest);
        if (matched) {
          setIdorInspectedSubmission(matched);
        } else {
          setIdorError(`Submission dengan ID '${submissionIdToTest}' tidak ditemukan.`);
        }
      }
    } catch {
      const matched = submissions.find(s => s.id === submissionIdToTest);
      if (matched) {
        setIdorInspectedSubmission(matched);
      } else {
        setIdorError(`Submission dengan ID '${submissionIdToTest}' tidak ditemukan.`);
      }
    }
  };

  return (
    <div>
      {/* Title & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText color="var(--primary-light)" size={30} />
            <span>{role === 'mahasiswa' ? 'Pengumpulan Tugas Kuliah' : 'Koreksi & Penilaian Tugas Mahasiswa'}</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {role === 'mahasiswa' 
              ? 'Unggah berkas tugas Anda dan pantau evaluasi nilai dari dosen pengampu.' 
              : 'Periksa berkas tugas yang diunggah mahasiswa, masukkan nilai dan catatan evaluasi.'}
          </p>
        </div>

        {role === 'mahasiswa' && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Upload size={16} />
            <span>Unggah Tugas Baru</span>
          </button>
        )}
      </div>

      {/* IDOR Interactive Testing Bar */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Unlock size={22} color="#f87171" />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Simulasi Pengujian Celah IDOR (Insecure Direct Object Reference)</span>
                <span className="badge badge-security" style={{ fontSize: '0.65rem' }}>CWE-639</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Coba akses berkas tugas mahasiswa lain secara ilegal cukup dengan mengganti parameter ID:
              </p>
            </div>
          </div>

          {/* Quick ID buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Coba ID:</span>
            {submissions.map((s) => (
              <button
                key={s.id}
                onClick={() => handleTriggerIdor(s.id)}
                className="btn btn-secondary btn-sm"
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  borderColor: s.studentId !== currentUser.id ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-subtle)',
                  color: s.studentId !== currentUser.id ? '#fca5a5' : '#fff'
                }}
              >
                {s.id} ({s.studentName.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>

        {/* Input ID manual */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            className="form-input"
            style={{ maxWidth: '280px', padding: '0.45rem 0.85rem', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}
            value={manualIdorInput}
            onChange={(e) => setManualIdorInput(e.target.value)}
            placeholder="Masukkan ID, misal: sub-102"
          />
          <button
            onClick={() => handleTriggerIdor(manualIdorInput)}
            className="btn btn-warning btn-sm"
            style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
          >
            <ShieldAlert size={14} />
            <span>Eksploitasi IDOR API</span>
          </button>
        </div>

        {idorError && (
          <div style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.5rem' }}>
            {idorError}
          </div>
        )}
      </div>

      {/* Available Assignments list */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={18} color="var(--accent-amber)" />
          <span>Daftar Tugas Aktif Perkuliahan</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {assignments.map((asg) => (
            <div key={asg.id} className="glass-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="badge badge-dosen" style={{ fontSize: '0.7rem' }}>{asg.courseName}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', fontWeight: 600 }}>
                  Max: {asg.totalPoints} Poin
                </span>
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                {asg.title}
              </h3>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                {asg.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Batas Pengumpulan:</span>
                <strong style={{ color: '#fff' }}>{asg.deadline}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submissions Table */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileCheck size={18} color="var(--accent-emerald)" />
            <span>
              {role === 'mahasiswa' ? 'Riwayat Pengumpulan Tugas Saya' : 'Daftar Pengumpulan Seluruh Mahasiswa'}
            </span>
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Total: {role === 'mahasiswa' ? mySubmissions.length : submissions.length} berkas
          </span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID &amp; Mahasiswa</th>
                <th>Tugas &amp; Mata Kuliah</th>
                <th>Nama Berkas</th>
                <th>Waktu Pengumpulan</th>
                <th style={{ textAlign: 'center' }}>Status &amp; Nilai</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {(role === 'mahasiswa' ? mySubmissions : submissions).map((sub) => (
                <tr key={sub.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{sub.studentName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      NIM: {sub.studentNim} &bull; <code style={{ color: 'var(--accent-cyan)' }}>{sub.id}</code>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{sub.assignmentTitle}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-violet)' }}>{sub.courseName}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)' }}>
                      <FileText size={15} />
                      <span style={{ fontWeight: 600 }}>{sub.fileName}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{sub.fileSize}</div>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {sub.submittedAt}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {sub.grade !== null ? (
                      <div>
                        <span className="badge badge-success" style={{ fontSize: '0.8rem' }}>
                          Nilai: {sub.grade}
                        </span>
                        {sub.feedback && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            Feedback: {sub.feedback}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
                        Menunggu Penilaian
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleTriggerIdor(sub.id)}
                        className="btn btn-secondary btn-sm"
                        title="Buka detail berkas"
                      >
                        <Eye size={13} />
                        <span>Detail</span>
                      </button>

                      {role === 'dosen' && (
                        <button
                          onClick={() => {
                            setGradingSubmission(sub);
                            setGradeInput(sub.grade || 85);
                            setFeedbackInput(sub.feedback || 'Kinerja tugas sudah sangat baik.');
                          }}
                          className="btn btn-primary btn-sm"
                        >
                          <Check size={13} />
                          <span>Beri Nilai</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mahasiswa Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                  Unggah Tugas Mahasiswa
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Pengunggah: {currentUser.name} ({currentUser.identifier})
                </p>
              </div>
              <button 
                onClick={() => setShowUploadModal(false)} 
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.4rem' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="asgSelect">Pilih Tugas Kuliah</label>
                <select
                  id="asgSelect"
                  className="form-select"
                  value={selectedAssignmentId}
                  onChange={(e) => setSelectedAssignmentId(e.target.value)}
                >
                  {assignments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.courseName} - {a.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="filename">Nama Berkas / File Lampiran</label>
                <input
                  id="filename"
                  type="text"
                  className="form-input"
                  placeholder="misal: Laporan_Analisis_Budi_2301010042.pdf"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="preview">Ringkasan / Isi Tugas</label>
                <textarea
                  id="preview"
                  rows={3}
                  className="form-textarea"
                  placeholder="Ringkasan abstrak jawaban tugas praktikum..."
                  value={uploadPreview}
                  onChange={(e) => setUploadPreview(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="notes">Catatan Tambahan untuk Dosen</label>
                <textarea
                  id="notes"
                  rows={2}
                  className="form-textarea"
                  placeholder="Catatan pengumpulan jika ada kendala atau catatan khusus..."
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="btn btn-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <Upload size={16} />
                  <span>Kirim Tugas</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dosen Grading Modal */}
      {gradingSubmission && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                  Koreksi &amp; Beri Nilai Tugas
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Mahasiswa: {gradingSubmission.studentName} ({gradingSubmission.studentNim}) &bull; {gradingSubmission.assignmentTitle}
                </p>
              </div>
              <button 
                onClick={() => setGradingSubmission(null)} 
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.4rem' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleGradeSubmit}>
              <div style={{
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Berkas Lampiran Mahasiswa:</div>
                <div style={{ fontWeight: 700, color: 'var(--accent-cyan)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                  {gradingSubmission.fileName} ({gradingSubmission.fileSize})
                </div>
                {gradingSubmission.fileContentPreview && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                    &ldquo;{gradingSubmission.fileContentPreview}&rdquo;
                  </div>
                )}
                {gradingSubmission.notes && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Catatan Mahasiswa: {gradingSubmission.notes}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="gradeNum">Nilai Angka Tugas (0 - 100)</label>
                <input
                  id="gradeNum"
                  type="number"
                  min="0"
                  max="100"
                  className="form-input"
                  value={gradeInput}
                  onChange={(e) => setGradeInput(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="feedbackText">Catatan Masukan / Feedback Dosen</label>
                <textarea
                  id="feedbackText"
                  rows={3}
                  className="form-textarea"
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Tuliskan evaluasi perbaikan untuk mahasiswa..."
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="btn btn-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <Check size={16} />
                  <span>Simpan Nilai &amp; Feedback</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IDOR Detail / Inspection Modal */}
      {idorInspectedSubmission && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '2rem', maxWidth: '700px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                    Detail Berkas Pengumpulan Tugas
                  </h2>
                  <span className="badge badge-security">ID: {idorInspectedSubmission.id}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Data objek yang diambil langsung melalui parameter ID.
                </p>
              </div>
              <button 
                onClick={() => setIdorInspectedSubmission(null)} 
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.4rem' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* If IDOR was exploited by another student */}
            {currentUser.role === 'mahasiswa' && idorInspectedSubmission.studentId !== currentUser.id && (
              <div className="security-alert-box" style={{ marginBottom: '1.25rem' }}>
                <ShieldAlert size={22} color="#f87171" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#f87171', fontSize: '0.88rem' }}>
                    🚨 Eksploitasi IDOR Terverifikasi!
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#fca5a5', marginTop: '0.2rem' }}>
                    Anda ({currentUser.name}) berhasil mengintip berkas dan catatan rahasia milik <strong>{idorInspectedSubmission.studentName} ({idorInspectedSubmission.studentNim})</strong> karena endpoint <code>/api/submissions/{idorInspectedSubmission.id}</code> tidak memverifikasi kepemilikan!
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pemilik Tugas:</div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                      {idorInspectedSubmission.studentName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
                      NIM: {idorInspectedSubmission.studentNim}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mata Kuliah:</div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                      {idorInspectedSubmission.courseName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {idorInspectedSubmission.assignmentTitle}
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Berkas Unggahan:</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                      <FileText size={18} />
                      <span>{idorInspectedSubmission.fileName} ({idorInspectedSubmission.fileSize})</span>
                    </div>

                    <button
                      onClick={() => alert(`Simulasi Download Berkas: [${idorInspectedSubmission.fileName}] berhasil diunduh tanpa pemeriksaan otorisasi!`)}
                      className="btn btn-secondary btn-sm"
                    >
                      <Download size={14} />
                      <span>Unduh File</span>
                    </button>
                  </div>
                </div>

                {idorInspectedSubmission.fileContentPreview && (
                  <div style={{ marginTop: '1rem', background: '#070a13', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Isi / Cuplikan Berkas:</div>
                    <div style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                      {idorInspectedSubmission.fileContentPreview}
                    </div>
                  </div>
                )}

                {idorInspectedSubmission.notes && (
                  <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <strong>Catatan Pribadi Mahasiswa:</strong> &ldquo;{idorInspectedSubmission.notes}&rdquo;
                  </div>
                )}
              </div>

              {/* Grade & Feedback status */}
              <div style={{
                background: idorInspectedSubmission.grade !== null ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                border: `1px solid ${idorInspectedSubmission.grade !== null ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 700, color: idorInspectedSubmission.grade !== null ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                    {idorInspectedSubmission.grade !== null ? `Nilai Resmi Dosen: ${idorInspectedSubmission.grade} / 100` : 'Belum Dinilai oleh Dosen'}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Diserahkan: {idorInspectedSubmission.submittedAt}
                  </span>
                </div>
                {idorInspectedSubmission.feedback && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    <strong>Evaluasi Dosen:</strong> {idorInspectedSubmission.feedback}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                onClick={() => setIdorInspectedSubmission(null)}
                className="btn btn-secondary"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
