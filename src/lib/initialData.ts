import { User, Course, Assignment, Submission, GradeItem, ForumThread } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'mhs-001',
    username: 'budi.santoso',
    password: 'Password123!',
    name: 'Budi Santoso',
    identifier: '2301010042',
    role: 'mahasiswa',
    email: 'budi.santoso@mhs.udikom.ac.id',
    prodiOrDept: 'S1 Teknik Informatika',
    semester: 5,
    ipk: 3.78,
    status: 'aktif',
    createdAt: '2023-09-01'
  },
  {
    id: 'mhs-002',
    username: 'siti.aminah',
    password: 'Password123!',
    name: 'Siti Nur Aminah',
    identifier: '2301010089',
    role: 'mahasiswa',
    email: 'siti.aminah@mhs.udikom.ac.id',
    prodiOrDept: 'S1 Sistem Informasi',
    semester: 5,
    ipk: 3.85,
    status: 'aktif',
    createdAt: '2023-09-01'
  },
  {
    id: 'mhs-003',
    username: 'reza.firmansyah',
    password: 'Password123!',
    name: 'Reza Pratama Firmansyah',
    identifier: '2301010115',
    role: 'mahasiswa',
    email: 'reza.firmansyah@mhs.udikom.ac.id',
    prodiOrDept: 'S1 Rekayasa Keamanan Siber',
    semester: 5,
    ipk: 3.65,
    status: 'aktif',
    createdAt: '2023-09-01'
  },
  {
    id: 'dos-001',
    username: 'dr.hendra',
    password: 'Password123!',
    name: 'Dr. Hendra Gunawan, S.Kom., M.T.',
    identifier: '198204122008121003',
    role: 'dosen',
    email: 'hendra.gunawan@dosen.udikom.ac.id',
    prodiOrDept: 'Departemen Keamanan Siber & Jaringan',
    status: 'aktif',
    createdAt: '2015-02-15'
  },
  {
    id: 'dos-002',
    username: 'prof.ratna',
    password: 'Password123!',
    name: 'Prof. Dr. Ratna Wulandari, M.Sc.',
    identifier: '197809152003122001',
    role: 'dosen',
    email: 'ratna.wulandari@dosen.udikom.ac.id',
    prodiOrDept: 'Departemen Rekayasa Perangkat Lunak',
    status: 'aktif',
    createdAt: '2012-08-20'
  },
  {
    id: 'adm-001',
    username: 'admin.puskom',
    password: 'AdminSecure2026!',
    name: 'Administrator Puskom (Pusat Komputer)',
    identifier: '198501012010011005',
    role: 'admin',
    email: 'admin.puskom@udikom.ac.id',
    prodiOrDept: 'Biro Administrasi & Sistem Informasi (BAPSI)',
    status: 'aktif',
    createdAt: '2018-01-10'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'crs-101',
    code: 'IF-3101',
    name: 'Keamanan Siber & Ethical Hacking',
    sks: 3,
    semester: 5,
    dosenId: 'dos-001',
    dosenName: 'Dr. Hendra Gunawan, S.Kom., M.T.',
    room: 'Lab Cyber Lt. 3 / D-304',
    schedule: 'Senin, 08:00 - 10:30 WIB'
  },
  {
    id: 'crs-102',
    code: 'IF-3102',
    name: 'Rekayasa Perangkat Lunak Berorientasi Objek',
    sks: 3,
    semester: 5,
    dosenId: 'dos-002',
    dosenName: 'Prof. Dr. Ratna Wulandari, M.Sc.',
    room: 'Gedung Rektorat R. 202',
    schedule: 'Selasa, 10:45 - 13:15 WIB'
  },
  {
    id: 'crs-103',
    code: 'SI-3205',
    name: 'Audit Sistem & Manajemen Risiko TI',
    sks: 3,
    semester: 5,
    dosenId: 'dos-001',
    dosenName: 'Dr. Hendra Gunawan, S.Kom., M.T.',
    room: 'Smart Classroom B-101',
    schedule: 'Rabu, 13:30 - 16:00 WIB'
  },
  {
    id: 'crs-104',
    code: 'IF-3108',
    name: 'Kriptografi & Perlindungan Data',
    sks: 2,
    semester: 5,
    dosenId: 'dos-001',
    dosenName: 'Dr. Hendra Gunawan, S.Kom., M.T.',
    room: 'Lab Jaringan Komputer D-201',
    schedule: 'Kamis, 08:00 - 09:40 WIB'
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-01',
    courseId: 'crs-101',
    courseName: 'Keamanan Siber & Ethical Hacking',
    title: 'Tugas Praktikum 1: Analisis Kerentanan Web & OWASP Top 10',
    description: 'Lakukan pemindaian dan analisis mendalam terhadap celah Stored XSS dan IDOR pada aplikasi target. Susun laporan analisis berformat PDF beserta langkah mitigasi mitigasinya.',
    deadline: '2026-10-25 23:59 WIB',
    totalPoints: 100,
    dosenId: 'dos-001',
    createdAt: '2026-10-01'
  },
  {
    id: 'asg-02',
    courseId: 'crs-102',
    courseName: 'Rekayasa Perangkat Lunak Berorientasi Objek',
    title: 'Tugas Besar Milestone 1: Analisis Kebutuhan & Desain Arsitektur Clean Code',
    description: 'Buat dokumen Software Architecture Document (SAD) yang mencakup Class Diagram, Sequence Diagram, dan perancangan RESTful API sesuai spesifikasi portal akademik.',
    deadline: '2026-10-30 23:59 WIB',
    totalPoints: 100,
    dosenId: 'dos-002',
    createdAt: '2026-10-05'
  },
  {
    id: 'asg-03',
    courseId: 'crs-104',
    courseName: 'Kriptografi & Perlindungan Data',
    title: 'Tugas 2: Implementasi Algoritma Hash & Digital Signature',
    description: 'Implementasikan simulasi hashing SHA-256 dan RSA signature verification untuk integritas dokumen kelulusan mahasiswa.',
    deadline: '2026-11-05 23:59 WIB',
    totalPoints: 100,
    dosenId: 'dos-001',
    createdAt: '2026-10-10'
  }
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-101',
    assignmentId: 'asg-01',
    assignmentTitle: 'Tugas Praktikum 1: Analisis Kerentanan Web & OWASP Top 10',
    courseName: 'Keamanan Siber & Ethical Hacking',
    studentId: 'mhs-001',
    studentName: 'Budi Santoso',
    studentNim: '2301010042',
    submittedAt: '2026-10-10 14:22 WIB',
    fileName: 'Laporan_OWASP_BudiSantoso_2301010042.pdf',
    fileSize: '2.4 MB',
    fileContentPreview: 'LAPORAN RESMI: Pengujian kerentanan web mengidentifikasi risiko Stored XSS pada forum diskusi dan potensi IDOR pada endpoint pengambilan submission tanpa verifikasi kepemilikan JWT/session.',
    notes: 'Pak Hendra, saya telah menyelesaikan pengujian di lingkungan lab dan mencantumkan PoC serta mitigasi sanitasi input.',
    grade: 88,
    feedback: 'Analisis sangat baik dan terstruktur! Pada bagian IDOR, berikan juga contoh implementasi role-based access control di middleware.',
    status: 'graded'
  },
  {
    id: 'sub-102',
    assignmentId: 'asg-01',
    assignmentTitle: 'Tugas Praktikum 1: Analisis Kerentanan Web & OWASP Top 10',
    courseName: 'Keamanan Siber & Ethical Hacking',
    studentId: 'mhs-002',
    studentName: 'Siti Nur Aminah',
    studentNim: '2301010089',
    submittedAt: '2026-10-11 09:15 WIB',
    fileName: 'Laporan_AuditWeb_SitiAminah_2301010089.pdf',
    fileSize: '3.1 MB',
    fileContentPreview: 'DOKUMEN RAHASIA AUDIT: Analisis celah kontrol akses (Broken Access Control) pada modul nilai mahasiswa dan demonstrasi pengubahan nilai via direct object reference manipulation.',
    notes: 'Tugas praktikum lengkap beserta capture screen proxy Burp Suite.',
    grade: 95,
    feedback: 'Luar biasa! Metodologi pengujian black-box dan white-box dijelaskan sangat rinci. Pertahankan prestasi ini.',
    status: 'graded'
  },
  {
    id: 'sub-103',
    assignmentId: 'asg-01',
    assignmentTitle: 'Tugas Praktikum 1: Analisis Kerentanan Web & OWASP Top 10',
    courseName: 'Keamanan Siber & Ethical Hacking',
    studentId: 'mhs-003',
    studentName: 'Reza Pratama Firmansyah',
    studentNim: '2301010115',
    submittedAt: '2026-10-12 11:40 WIB',
    fileName: 'Research_ExploitPoC_RezaFirmansyah_2301010115.zip',
    fileSize: '4.8 MB',
    fileContentPreview: 'CATATAN LAB: Berisi script PoC payload Stored XSS untuk injeksi cookie dan skenario IDOR traversal antar parameter id submission.',
    notes: 'Mohon masukan Pak Dosen jika ada bagian rekomendasi arsitektur pertahanan yang masih perlu disempurnakan.',
    grade: null, // Belum dinilai, siap untuk dicoba dinilai oleh Dosen!
    feedback: null,
    status: 'submitted'
  }
];

export const INITIAL_GRADES: GradeItem[] = [
  // Budi Santoso (mhs-001)
  {
    id: 'grd-01',
    studentId: 'mhs-001',
    courseId: 'crs-101',
    courseCode: 'IF-3101',
    courseName: 'Keamanan Siber & Ethical Hacking',
    sks: 3,
    kehadiran: 100,
    tugas: 88,
    uts: 85,
    uas: 90,
    nilaiAkhir: 88.5,
    hurufMutu: 'A',
    bobot: 4.0
  },
  {
    id: 'grd-02',
    studentId: 'mhs-001',
    courseId: 'crs-102',
    courseCode: 'IF-3102',
    courseName: 'Rekayasa Perangkat Lunak Berorientasi Objek',
    sks: 3,
    kehadiran: 95,
    tugas: 82,
    uts: 80,
    uas: 84,
    nilaiAkhir: 82.7,
    hurufMutu: 'A-',
    bobot: 3.7
  },
  {
    id: 'grd-03',
    studentId: 'mhs-001',
    courseId: 'crs-103',
    courseCode: 'SI-3205',
    courseName: 'Audit Sistem & Manajemen Risiko TI',
    sks: 3,
    kehadiran: 90,
    tugas: 85,
    uts: 78,
    uas: 82,
    nilaiAkhir: 81.8,
    hurufMutu: 'A-',
    bobot: 3.7
  },
  {
    id: 'grd-04',
    studentId: 'mhs-001',
    courseId: 'crs-104',
    courseCode: 'IF-3108',
    courseName: 'Kriptografi & Perlindungan Data',
    sks: 2,
    kehadiran: 100,
    tugas: 90,
    uts: 88,
    uas: 92,
    nilaiAkhir: 90.8,
    hurufMutu: 'A',
    bobot: 4.0
  },

  // Siti Nur Aminah (mhs-002)
  {
    id: 'grd-05',
    studentId: 'mhs-002',
    courseId: 'crs-101',
    courseCode: 'IF-3101',
    courseName: 'Keamanan Siber & Ethical Hacking',
    sks: 3,
    kehadiran: 100,
    tugas: 95,
    uts: 92,
    uas: 96,
    nilaiAkhir: 95.0,
    hurufMutu: 'A',
    bobot: 4.0
  },
  {
    id: 'grd-06',
    studentId: 'mhs-002',
    courseId: 'crs-102',
    courseCode: 'IF-3102',
    courseName: 'Rekayasa Perangkat Lunak Berorientasi Objek',
    sks: 3,
    kehadiran: 100,
    tugas: 90,
    uts: 88,
    uas: 90,
    nilaiAkhir: 89.8,
    hurufMutu: 'A',
    bobot: 4.0
  },

  // Reza Pratama Firmansyah (mhs-003)
  {
    id: 'grd-07',
    studentId: 'mhs-003',
    courseId: 'crs-101',
    courseCode: 'IF-3101',
    courseName: 'Keamanan Siber & Ethical Hacking',
    sks: 3,
    kehadiran: 90,
    tugas: 80,
    uts: 79,
    uas: 85,
    nilaiAkhir: 82.1,
    hurufMutu: 'A-',
    bobot: 3.7
  }
];

export const INITIAL_THREADS: ForumThread[] = [
  {
    id: 'thr-01',
    courseId: 'crs-101',
    courseName: 'Keamanan Siber & Ethical Hacking',
    authorId: 'dos-001',
    authorName: 'Dr. Hendra Gunawan, S.Kom., M.T.',
    authorRole: 'dosen',
    authorIdentifier: '198204122008121003',
    title: 'Pengumuman & Diskusi Modul 4: Pentingnya Pertahanan Terhadap Stored XSS',
    content: 'Selamat siang rekan-rekan mahasiswa. Pada pertemuan minggu depan kita akan menguji bagaimana injeksi skrip HTML mentah yang tersimpan di basis data dapat dieksekusi oleh browser klien lain tanpa filter. Silakan pelajari perbedaan Stored XSS, Reflected XSS, dan DOM XSS.',
    tags: ['Keamanan Web', 'Stored XSS', 'OWASP'],
    views: 142,
    createdAt: '2026-10-08 10:15 WIB',
    comments: [
      {
        id: 'cmt-01',
        threadId: 'thr-01',
        authorId: 'mhs-001',
        authorName: 'Budi Santoso',
        authorRole: 'mahasiswa',
        authorIdentifier: '2301010042',
        content: 'Terima kasih informasinya Pak Hendra. Apakah sanitasi menggunakan library DOMPurify di sisi frontend sudah cukup aman atau wajib divalidasi juga di backend server?',
        createdAt: '2026-10-08 11:20 WIB'
      },
      {
        id: 'cmt-02',
        threadId: 'thr-01',
        authorId: 'dos-001',
        authorName: 'Dr. Hendra Gunawan, S.Kom., M.T.',
        authorRole: 'dosen',
        authorIdentifier: '198204122008121003',
        content: 'Pertanyaan bagus Budi! Prinsip "Defense in Depth" mengharuskan validasi dan sanitasi ketat di backend server sebelum data disimpan, serta context-aware escaping saat data dirender di frontend.',
        createdAt: '2026-10-08 12:05 WIB'
      }
    ]
  },
  {
    id: 'thr-02',
    courseId: 'crs-101',
    courseName: 'Keamanan Siber & Ethical Hacking',
    authorId: 'mhs-002',
    authorName: 'Siti Nur Aminah',
    authorRole: 'mahasiswa',
    authorIdentifier: '2301010089',
    title: 'Pertanyaan Seputar IDOR pada RESTful API Berbasis ID Numerik/UUID',
    content: 'Halo teman-teman, saat menguji endpoint pengambilan data profil atau tugas kuliah, jika endpoint hanya mengandalkan identifier seperti id=sub-101 tanpa mencocokkan user session token, apakah penggantian ke UUID acak sudah cukup aman atau tetap harus ada access control check?',
    tags: ['IDOR', 'Access Control', 'API Security'],
    views: 98,
    createdAt: '2026-10-09 16:30 WIB',
    comments: [
      {
        id: 'cmt-03',
        threadId: 'thr-02',
        authorId: 'mhs-003',
        authorName: 'Reza Pratama Firmansyah',
        authorRole: 'mahasiswa',
        authorIdentifier: '2301010115',
        content: 'Menurut saya UUID hanya menaikkan kesulitan tebakan (security through obscurity), tapi celah kontrol aksesnya tetap ada jika backend tidak memeriksa relasi kepemilikan data (ownership verification).',
        createdAt: '2026-10-09 17:10 WIB'
      }
    ]
  }
];
