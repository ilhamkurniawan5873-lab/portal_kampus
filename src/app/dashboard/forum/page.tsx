'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/authContext';
import { getAllThreads, addThread, addComment } from '@/lib/store';
import { ForumThread, ForumComment } from '@/lib/types';
import { 
  MessagesSquare, 
  Plus, 
  Send, 
  ShieldAlert, 
  Sparkles, 
  Bug, 
  Copy, 
  Check, 
  MessageCircle, 
  Clock, 
  User, 
  Tag, 
  AlertTriangle,
  X,
  Code
} from 'lucide-react';

export default function ForumPage() {
  const { currentUser } = useAuth();
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<ForumThread | null>(null);

  // New thread modal
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('Keamanan Siber');

  // New comment
  const [commentContent, setCommentContent] = useState('');

  // Vulnerability Toggle for Demonstration: Rentan vs Terproteksi
  const [isProtectionEnabled, setIsProtectionEnabled] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState<string | null>(null);

  useEffect(() => {
    const list = getAllThreads();
    setThreads(list);
    if (list.length > 0 && !selectedThread) {
      setSelectedThread(list[0]);
    }
  }, [selectedThread]);

  if (!currentUser) return null;

  const role = currentUser.role;

  const samplePayloads = [
    {
      title: 'Cookie Stealer & Alert PoC',
      payload: `<img src="x" onerror="alert('🚨 Stored XSS Berhasil! Cookie: ' + document.cookie)">`
    },
    {
      title: 'Visual Defacement Banner',
      payload: `<div style="background:#dc2626;color:white;padding:12px;border-radius:8px;font-weight:bold;margin:8px 0;">⚠️ PERINGATAN: Halaman forum ini berhasil diinjeksi via Stored XSS!</div>`
    },
    {
      title: 'Phishing Credential Link',
      payload: `<a href="javascript:alert('Simulasi Phishing: Token Sesi Tercuri!');" style="color:#38bdf8;font-weight:bold;text-decoration:underline;">👉 Klik di sini untuk Klaim Bantuan Kuota Kampus Gratis</a>`
    },
    {
      title: 'Direct Script Tag',
      payload: `<script>alert('Stored XSS Execution via Script Tag!');</script><p>Halo rekan-rekan mahasiswa!</p>`
    }
  ];

  const handleCopyPayload = (payload: string) => {
    navigator.clipboard.writeText(payload);
    setCopiedPayload(payload);
    setTimeout(() => setCopiedPayload(null), 2500);
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const threadObj: ForumThread = {
      id: `thr-${Date.now().toString().slice(-4)}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorIdentifier: currentUser.identifier,
      title: newTitle,
      content: newContent, // Intentionally unescaped raw string!
      tags: [newTag],
      views: 1,
      createdAt: new Date().toLocaleString('id-ID'),
      comments: []
    };

    const updated = addThread(threadObj);
    setThreads(updated);
    setSelectedThread(threadObj);
    setShowNewThreadModal(false);
    setNewTitle('');
    setNewContent('');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || !selectedThread) return;

    const commentObj: ForumComment = {
      id: `cmt-${Date.now().toString().slice(-4)}`,
      threadId: selectedThread.id,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorIdentifier: currentUser.identifier,
      content: commentContent, // Intentionally unescaped raw string!
      createdAt: new Date().toLocaleString('id-ID')
    };

    const updated = addComment(selectedThread.id, commentObj);
    setThreads(updated);
    const refreshed = updated.find(t => t.id === selectedThread.id);
    if (refreshed) setSelectedThread(refreshed);
    setCommentContent('');
  };

  // Helper to render content safely or dangerously depending on vulnerability toggle
  const renderVulnerableContent = (rawHtml: string) => {
    if (isProtectionEnabled) {
      // Safe mode: text content escaped
      return <div>{rawHtml}</div>;
    }

    // Vulnerable mode: dangerously set HTML directly into the DOM
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: rawHtml }} 
        ref={(node) => {
          // If node contains <script> tags, execute them for guaranteed demonstration
          if (node) {
            const scripts = node.getElementsByTagName('script');
            for (let i = 0; i < scripts.length; i++) {
              const script = scripts[i];
              if (!script.dataset.executed) {
                script.dataset.executed = 'true';
                try {
                  const fn = new Function(script.innerText);
                  fn();
                } catch (err) {
                  console.error('XSS script error:', err);
                }
              }
            }
          }
        }}
      />
    );
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <MessagesSquare color="var(--primary-light)" size={30} />
            <span>Forum Diskusi Akademik Kampus</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Ruang komunikasi dan tanya-jawab antara mahasiswa dan dosen mata kuliah.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Mitigation Toggle */}
          <button
            onClick={() => setIsProtectionEnabled(!isProtectionEnabled)}
            className={`btn btn-sm ${isProtectionEnabled ? 'btn-secondary' : 'btn-danger'}`}
            style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ShieldAlert size={14} />
            <span>Mode: {isProtectionEnabled ? '🛡️ Terproteksi (XSS Sanitized)' : '⚠️ Rentan (Stored XSS Active)'}</span>
          </button>

          <button
            onClick={() => setShowNewThreadModal(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={16} />
            <span>Buat Topik Baru</span>
          </button>
        </div>
      </div>

      {/* Stored XSS Lab Helper Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(99, 102, 241, 0.08) 100%)',
        border: '1px solid rgba(239, 68, 68, 0.35)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <Bug color="#f87171" size={20} />
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
            Laboratorium Pengujian Celah Stored XSS (Cross-Site Scripting)
          </h2>
          <span className="badge badge-security">CWE-79</span>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
          Input judul, isi topik diskusi, dan komentar pada forum ini <strong>tidak difilter</strong> sebelum disimpan di database dan dirender dengan injeksi DOM langsung. Coba salin payload berikut untuk membuktikan celah kerentanan:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
          {samplePayloads.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.5rem'
              }}
            >
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  {item.title}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: '#94a3b8',
                  wordBreak: 'break-all',
                  marginTop: '0.25rem',
                  background: '#070a13',
                  padding: '0.35rem 0.5rem',
                  borderRadius: '4px'
                }}>
                  {item.payload}
                </div>
              </div>

              <button
                onClick={() => handleCopyPayload(item.payload)}
                className="btn btn-secondary btn-sm"
                style={{ alignSelf: 'flex-start', fontSize: '0.72rem', padding: '0.3rem 0.65rem' }}
              >
                {copiedPayload === item.payload ? (
                  <>
                    <Check size={12} color="var(--accent-emerald)" />
                    <span style={{ color: 'var(--accent-emerald)' }}>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Salin Payload</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Forum Grid (List on left, Thread view on right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left: Threads List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
            Daftar Topik Diskusi ({threads.length})
          </h2>

          {threads.map((thread) => {
            const isSelected = selectedThread?.id === thread.id;
            return (
              <div
                key={thread.id}
                onClick={() => setSelectedThread(thread)}
                className="glass-card glass-card-interactive"
                style={{
                  borderColor: isSelected ? 'var(--primary-light)' : 'var(--border-subtle)',
                  background: isSelected ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                  padding: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className={`badge badge-${thread.authorRole}`} style={{ fontSize: '0.65rem' }}>
                    {thread.authorRole}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {thread.createdAt}
                  </span>
                </div>

                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem', lineHeight: 1.4 }}>
                  {thread.title}
                </h3>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', maxHeight: '42px', overflow: 'hidden' }}>
                  {thread.content.replace(/<[^>]*>?/gm, '')}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Oleh: <strong style={{ color: '#fff' }}>{thread.authorName}</strong></span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MessageCircle size={13} />
                    <span>{thread.comments.length} Balasan</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Active Thread Viewer & Comments */}
        {selectedThread ? (
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <span className={`badge badge-${selectedThread.authorRole}`} style={{ fontSize: '0.7rem', marginBottom: '0.4rem' }}>
                  {selectedThread.authorRole} &bull; {selectedThread.authorIdentifier}
                </span>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>
                  {selectedThread.title}
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  Dipublikasikan oleh <strong>{selectedThread.authorName}</strong> pada {selectedThread.createdAt}
                </div>
              </div>
            </div>

            {/* Thread Body (Vulnerable to Stored XSS) */}
            <div style={{
              fontSize: '0.92rem',
              color: '#e2e8f0',
              lineHeight: 1.7,
              marginBottom: '2rem',
              padding: '1rem',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              {renderVulnerableContent(selectedThread.content)}
            </div>

            {/* Comments List */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageCircle size={16} color="var(--primary-light)" />
                <span>Balasan Komentar ({selectedThread.comments.length})</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {selectedThread.comments.map((comment) => (
                  <div
                    key={comment.id}
                    style={{
                      background: 'var(--bg-card-hover)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>
                          {comment.authorName}
                        </span>
                        <span className={`badge badge-${comment.authorRole}`} style={{ fontSize: '0.62rem' }}>
                          {comment.authorRole}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {comment.createdAt}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                      {renderVulnerableContent(comment.content)}
                    </div>
                  </div>
                ))}

                {selectedThread.comments.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Belum ada balasan pada topik ini. Jadilah yang pertama berkomentar!
                  </div>
                )}
              </div>

              {/* Reply Form (Vulnerable to Stored XSS) */}
              <form onSubmit={handleAddComment}>
                <div className="form-group">
                  <label className="form-label" htmlFor="commentBox">
                    Kirim Balasan Diskusi (Mendukung Raw HTML &amp; Script Payload):
                  </label>
                  <textarea
                    id="commentBox"
                    rows={3}
                    className="form-textarea"
                    placeholder="Tulis pendapat atau tempel payload XSS pengujian di sini..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    <Send size={14} />
                    <span>Kirim Balasan</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Pilih topik diskusi di sebelah kiri untuk membaca dan membalas.
          </div>
        )}
      </div>

      {/* New Thread Modal */}
      {showNewThreadModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                  Buat Topik Diskusi Baru
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Penulis: {currentUser.name} ({currentUser.role})
                </p>
              </div>
              <button 
                onClick={() => setShowNewThreadModal(false)} 
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.4rem' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateThread}>
              <div className="form-group">
                <label className="form-label" htmlFor="topicTitle">Judul Topik Diskusi</label>
                <input
                  id="topicTitle"
                  type="text"
                  className="form-input"
                  placeholder="misal: Pertanyaan materi kriptografi atau payload XSS"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="topicCategory">Kategori / Mata Kuliah</label>
                <select
                  id="topicCategory"
                  className="form-select"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                >
                  <option value="Keamanan Siber">Keamanan Siber &amp; Ethical Hacking</option>
                  <option value="Rekayasa Perangkat Lunak">Rekayasa Perangkat Lunak</option>
                  <option value="Sistem Informasi">Audit Sistem Informasi</option>
                  <option value="Kriptografi">Kriptografi &amp; Keamanan Data</option>
                  <option value="Umum">Pengumuman Umum Kampus</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="topicContent">
                  Isi Postingan Topik (Menerima HTML Mentah &amp; Skrip XSS)
                </label>
                <textarea
                  id="topicContent"
                  rows={5}
                  className="form-textarea"
                  placeholder="Tuliskan pertanyaan Anda atau coba tempelkan script XSS untuk pengujian..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowNewThreadModal(false)}
                  className="btn btn-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <Send size={16} />
                  <span>Terbitkan Topik</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
