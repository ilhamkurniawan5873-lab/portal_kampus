'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Bug, 
  Unlock, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Code2, 
  FileCode,
  ShieldCheck,
  AlertOctagon,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function SecurityLabPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '999px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          <ShieldAlert size={14} />
          <span>SECURITY LAB DOCUMENTATION &amp; WRITEUP</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
          Dokumentasi Kerentanan &amp; Panduan Pengujian (PoC)
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.35rem', maxWidth: '850px' }}>
          Laporan teknis lengkap mengenai 2 kerentanan yang sengaja diimplementasikan pada portal kampus fiktif ini untuk keperluan latihan uji penetrasi web dan keamanan siber.
        </p>
      </div>

      {/* Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Vulnerability 1 Badge Card */}
        <div className="glass-card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)', background: 'linear-gradient(180deg, rgba(239, 68, 68, 0.08) 0%, var(--bg-card) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span className="badge badge-security">Celah #1</span>
            <span style={{ fontSize: '0.75rem', color: '#f87171', fontWeight: 700 }}>OWASP Top 10 (A03:2021)</span>
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
            Stored Cross-Site Scripting (XSS)
          </h2>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Ditemukan pada <strong>Forum Diskusi Kampus</strong>. Input judul, topik, dan komentar tidak disanitasi di backend maupun frontend, lalu dirender dengan injeksi DOM unescaped.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>CWE-79</span>
            <Link href="/dashboard/forum" className="btn btn-danger btn-sm">
              <span>Uji di Forum</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Vulnerability 2 Badge Card */}
        <div className="glass-card" style={{ borderColor: 'rgba(245, 158, 11, 0.3)', background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.08) 0%, var(--bg-card) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span className="badge badge-warning">Celah #2</span>
            <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 700 }}>OWASP Top 10 (A01:2021)</span>
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
            Insecure Direct Object Reference (IDOR)
          </h2>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Ditemukan pada <strong>Modul Berkas Tugas Mahasiswa &amp; KHS Nilai</strong>. Endpoint <code>/api/submissions/[id]</code> dan <code>/api/grades</code> tidak memvalidasi kepemilikan objek berdasarkan sesi.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-amber)', fontWeight: 600 }}>CWE-639 / CWE-285</span>
            <Link href="/dashboard/assignments" className="btn btn-warning btn-sm">
              <span>Uji di Tugas</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* Comprehensive Writeup Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {/* Writeup 1: Stored XSS */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Bug size={24} color="#f87171" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
              Writeup Celah 1: Stored XSS (Cross-Site Scripting)
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.4rem' }}>
                1. Deskripsi &amp; Titik Kelemahan
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Pada fitur <strong>Forum Diskusi Kampus</strong> (<code>/dashboard/forum</code>), aplikasi mengizinkan mahasiswa dan dosen mempublikasikan thread topik baru maupun komentar balasan. Server dan frontend menerima input tanpa melakukan encoding entitas HTML (seperti <code>&lt;</code>, <code>&gt;</code>, <code>&quot;</code>) ataupun pembersihan tag skrip. Saat halaman forum dibuka kembali oleh pengguna manapun, konten dirender menggunakan <code>dangerouslySetInnerHTML</code> tanpa sanitasi.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.4rem' }}>
                2. Langkah-Langkah Reproduksi (Proof of Concept - PoC)
              </h3>
              <ol style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                <li>Buka menu <strong>Forum Diskusi</strong> atau klik tautan cepat di dashboard.</li>
                <li>Klik tombol <strong>Buat Topik Baru</strong> atau gunakan form balasan pada topik yang sudah ada.</li>
                <li>Pada kolom isi teks (konten postingan), masukkan salah satu payload XSS berikut:</li>
              </ol>

              {/* Payload Code Blocks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
                <div className="security-code-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <code>&lt;img src=&quot;x&quot; onerror=&quot;alert(&#39;Stored XSS Terdeteksi! Cookie: &#39; + document.cookie)&quot;&gt;</code>
                  <button
                    onClick={() => copyText(`<img src="x" onerror="alert('Stored XSS Terdeteksi! Cookie: ' + document.cookie)">`, 'xss1')}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.72rem' }}
                  >
                    {copiedId === 'xss1' ? <Check size={12} color="var(--accent-emerald)" /> : <Copy size={12} />}
                    <span>{copiedId === 'xss1' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>

                <div className="security-code-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <code>&lt;div style=&quot;background:#dc2626;color:white;padding:12px;border-radius:8px;font-weight:bold;&quot;&gt;🚨 Forum Dibajak via XSS Defacement!&lt;/div&gt;</code>
                  <button
                    onClick={() => copyText(`<div style="background:#dc2626;color:white;padding:12px;border-radius:8px;font-weight:bold;">🚨 Forum Dibajak via XSS Defacement!</div>`, 'xss2')}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.72rem' }}
                  >
                    {copiedId === 'xss2' ? <Check size={12} color="var(--accent-emerald)" /> : <Copy size={12} />}
                    <span>{copiedId === 'xss2' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem', lineHeight: 1.6 }}>
                4. Klik <strong>Terbitkan Topik</strong>. Skrip JavaScript akan dieksekusi secara instan dan tersimpan permanen di database. Setiap kali pengguna lain (misalnya Dosen <strong>Dr. Hendra</strong> atau Admin) membuka halaman forum tersebut, alert dan skrip XSS otomatis berjalan di peramban mereka.
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.4rem' }}>
                3. Dampak Keamanan (Impact)
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Penyerang dapat mencuri cookie otentikasi sesi (Session Hijacking), menyuntikkan form login palsu (Credential Phishing), memodifikasi antarmuka visual portal secara tidak sah (Defacement), atau melakukan aksi atas nama dosen/admin (misal memberi nilai atau mengubah data akun).
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '0.4rem' }}>
                4. Rekomendasi Perbaikan &amp; Mitigasi (Remediation)
              </h3>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <ul style={{ paddingLeft: '1.25rem' }}>
                  <li><strong>Sanitasi Input:</strong> Gunakan library teruji seperti <code>DOMPurify</code> atau <code>sanitize-html</code> di backend dan frontend sebelum menyimpan/menampilkan konten berformat kaya (rich text).</li>
                  <li><strong>Output Encoding:</strong> Selalu lakukan context-aware HTML escaping secara default pada elemen React (jangan gunakan <code>dangerouslySetInnerHTML</code> tanpa sanitasi).</li>
                  <li><strong>Content Security Policy (CSP):</strong> Terapkan header HTTP <code>Content-Security-Policy: default-src &apos;self&apos;; script-src &apos;self&apos;</code> untuk mencegah eksekusi inline script tak berizin.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Writeup 2: IDOR */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Unlock size={24} color="#fbbf24" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
              Writeup Celah 2: Insecure Direct Object Reference (IDOR) / Broken Access Control
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.4rem' }}>
                1. Deskripsi &amp; Titik Kelemahan
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Pada modul <strong>Tugas Kuliah</strong> (<code>/dashboard/assignments</code>) dan endpoint API <code>/api/submissions/[id]</code>, sistem mengekspos pengenal objek secara langsung (misal: <code>sub-101</code>, <code>sub-102</code>, <code>sub-103</code>). Ketika klien meminta berkas pengumpulan tugas melalui parameter ID tersebut, backend <strong>tidak memverifikasi apakah akun yang sedang meminta adalah pemilik berkas tersebut</strong> atau dosen mata kuliah yang berwenang.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.4rem' }}>
                2. Langkah-Langkah Reproduksi (Proof of Concept - PoC)
              </h3>
              <ol style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                <li>Masuk sebagai Mahasiswa <strong>Budi Santoso</strong> (NIM: 2301010042, pemilik submission ID: <code>sub-101</code>).</li>
                <li>Buka halaman <strong>Pengumpulan Tugas Kuliah</strong>. Budi normalnya hanya boleh melihat berkas miliknya sendiri.</li>
                <li>Pada bagian atas tabel atau simulasi IDOR, ubah parameter ID menjadi <code>sub-102</code> (milik Siti Nur Aminah) atau <code>sub-103</code> (milik Reza Pratama).</li>
                <li>Atau lakukan pengujian request HTTP langsung melalui peramban / cURL:</li>
              </ol>

              <div className="security-code-box" style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <code>curl -X GET http://localhost:3000/api/submissions/sub-102</code>
                <button
                  onClick={() => copyText('curl -X GET http://localhost:3000/api/submissions/sub-102', 'idor1')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.72rem' }}
                >
                  {copiedId === 'idor1' ? <Check size={12} color="var(--accent-emerald)" /> : <Copy size={12} />}
                  <span>{copiedId === 'idor1' ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem', lineHeight: 1.6 }}>
                5. Sistem langsung mengembalikan respons JSON berisi nama file, cuplikan isi laporan rahasia milik Siti (<code>Laporan_AuditWeb_SitiAminah_2301010089.pdf</code>), catatan pribadi mahasiswa, dan nilai dari dosen tanpa dicegah!
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.4rem' }}>
                3. IDOR pada Transkrip Nilai Akademik
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Celah serupa juga terjadi pada halaman Transkrip Nilai (<code>/dashboard/grades</code>) dan endpoint <code>/api/grades?studentId=mhs-002</code>, di mana mahasiswa dapat mengintip seluruh riwayat IPK dan nilai mata kuliah teman sekelasnya cukup dengan mengganti parameter <code>studentId</code>.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '0.4rem' }}>
                4. Rekomendasi Perbaikan &amp; Mitigasi (Remediation)
              </h3>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <ul style={{ paddingLeft: '1.25rem' }}>
                  <li><strong>Verifikasi Otorisasi di Sisi Server (Object-Level Authorization):</strong> Sebelum mengembalikan data objek, backend wajib memvalidasi apakah ID pengguna di sesi token JWT sama dengan <code>submission.studentId</code> atau memiliki role <code>dosen</code> / <code>admin</code> yang mengampu mata kuliah tersebut.</li>
                  <li><strong>Contoh Kode Perbaikan:</strong></li>
                </ul>

                <div className="security-code-box" style={{ marginTop: '0.5rem' }}>
                  <pre style={{ margin: 0, fontFamily: 'inherit' }}>{`// CONTOH KODE MITIGASI SERVER-SIDE:
const sessionUser = await getAuthenticatedUser(request);
const submission = await db.findSubmission(id);

if (sessionUser.role !== 'dosen' && sessionUser.id !== submission.studentId) {
  return NextResponse.json({ error: '403 Forbidden: Akses ditolak' }, { status: 403 });
}`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
