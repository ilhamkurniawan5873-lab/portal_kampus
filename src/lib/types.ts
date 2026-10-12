export type UserRole = 'mahasiswa' | 'dosen' | 'admin';

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  identifier: string; // NIM for mahasiswa, NIP for dosen/admin
  role: UserRole;
  email: string;
  prodiOrDept: string;
  semester?: number;
  ipk?: number;
  avatar?: string;
  status: 'aktif' | 'nonaktif' | 'cuti';
  createdAt: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  sks: number;
  semester: number;
  dosenId: string;
  dosenName: string;
  room: string;
  schedule: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  deadline: string;
  totalPoints: number;
  dosenId: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  courseName: string;
  studentId: string;
  studentName: string;
  studentNim: string;
  submittedAt: string;
  fileName: string;
  fileSize: string;
  fileContentPreview?: string;
  notes: string;
  grade: number | null; // null if ungraded
  feedback: string | null;
  status: 'submitted' | 'graded';
}

export interface GradeItem {
  id: string;
  studentId: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  sks: number;
  kehadiran: number; // 0-100
  tugas: number; // 0-100
  uts: number; // 0-100
  uas: number; // 0-100
  nilaiAkhir: number; // calculated
  hurufMutu: string; // A, A-, B+, etc.
  bobot: number; // 4.0, 3.7, etc.
}

export interface ForumComment {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorIdentifier: string;
  content: string; // Vulnerable to Stored XSS
  createdAt: string;
}

export interface ForumThread {
  id: string;
  courseId?: string;
  courseName?: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorIdentifier: string;
  title: string;
  content: string; // Vulnerable to Stored XSS
  tags: string[];
  views: number;
  createdAt: string;
  comments: ForumComment[];
}
