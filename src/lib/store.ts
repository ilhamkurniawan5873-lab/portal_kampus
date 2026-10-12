import { 
  User, Course, Assignment, Submission, GradeItem, ForumThread, ForumComment 
} from './types';
import { 
  INITIAL_USERS, INITIAL_COURSES, INITIAL_ASSIGNMENTS, 
  INITIAL_SUBMISSIONS, INITIAL_GRADES, INITIAL_THREADS 
} from './initialData';

const STORAGE_KEYS = {
  USERS: 'siakad_users_v1',
  COURSES: 'siakad_courses_v1',
  ASSIGNMENTS: 'siakad_assignments_v1',
  SUBMISSIONS: 'siakad_submissions_v1',
  GRADES: 'siakad_grades_v1',
  THREADS: 'siakad_threads_v1',
  CURRENT_USER: 'siakad_current_user_v1',
};

// Safe localStorage helper
export function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

// User operations
export function getAllUsers(): User[] {
  return getFromStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
}

export function saveUsers(users: User[]): void {
  saveToStorage(STORAGE_KEYS.USERS, users);
}

export function addUser(user: User): User[] {
  const users = getAllUsers();
  const updated = [user, ...users];
  saveUsers(updated);
  return updated;
}

export function updateUser(id: string, updates: Partial<User>): User[] {
  const users = getAllUsers();
  const updated = users.map(u => u.id === id ? { ...u, ...updates } : u);
  saveUsers(updated);
  return updated;
}

export function deleteUser(id: string): User[] {
  const users = getAllUsers();
  const updated = users.filter(u => u.id !== id);
  saveUsers(updated);
  return updated;
}

// Course operations
export function getAllCourses(): Course[] {
  return getFromStorage<Course[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
}

// Assignment & Submissions
export function getAllAssignments(): Assignment[] {
  return getFromStorage<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
}

export function getAllSubmissions(): Submission[] {
  return getFromStorage<Submission[]>(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
}

export function saveSubmissions(subs: Submission[]): void {
  saveToStorage(STORAGE_KEYS.SUBMISSIONS, subs);
}

export function addSubmission(sub: Submission): Submission[] {
  const subs = getAllSubmissions();
  const updated = [sub, ...subs];
  saveSubmissions(updated);
  return updated;
}

export function updateSubmissionGrade(
  id: string, 
  grade: number, 
  feedback: string
): Submission[] {
  const subs = getAllSubmissions();
  const updated = subs.map(s => s.id === id ? { 
    ...s, 
    grade, 
    feedback, 
    status: 'graded' as const 
  } : s);
  saveSubmissions(updated);
  return updated;
}

// Grades
export function getAllGrades(): GradeItem[] {
  return getFromStorage<GradeItem[]>(STORAGE_KEYS.GRADES, INITIAL_GRADES);
}

export function saveGrades(grades: GradeItem[]): void {
  saveToStorage(STORAGE_KEYS.GRADES, grades);
}

export function updateGrade(id: string, updates: Partial<GradeItem>): GradeItem[] {
  const grades = getAllGrades();
  const updated = grades.map(g => {
    if (g.id !== id) return g;
    const merged = { ...g, ...updates };
    // Recalculate final score & letter grade
    const na = (merged.kehadiran * 0.1) + (merged.tugas * 0.25) + (merged.uts * 0.3) + (merged.uas * 0.35);
    const rounded = Math.round(na * 10) / 10;
    let huruf = 'E';
    let bobot = 0.0;
    if (rounded >= 85) { huruf = 'A'; bobot = 4.0; }
    else if (rounded >= 80) { huruf = 'A-'; bobot = 3.7; }
    else if (rounded >= 75) { huruf = 'B+'; bobot = 3.3; }
    else if (rounded >= 70) { huruf = 'B'; bobot = 3.0; }
    else if (rounded >= 65) { huruf = 'B-'; bobot = 2.7; }
    else if (rounded >= 60) { huruf = 'C+'; bobot = 2.3; }
    else if (rounded >= 55) { huruf = 'C'; bobot = 2.0; }
    else if (rounded >= 40) { huruf = 'D'; bobot = 1.0; }

    return {
      ...merged,
      nilaiAkhir: rounded,
      hurufMutu: huruf,
      bobot: bobot
    };
  });
  saveGrades(updated);
  return updated;
}

// Forum (Vulnerable to Stored XSS)
export function getAllThreads(): ForumThread[] {
  return getFromStorage<ForumThread[]>(STORAGE_KEYS.THREADS, INITIAL_THREADS);
}

export function saveThreads(threads: ForumThread[]): void {
  saveToStorage(STORAGE_KEYS.THREADS, threads);
}

export function addThread(thread: ForumThread): ForumThread[] {
  const threads = getAllThreads();
  const updated = [thread, ...threads];
  saveThreads(updated);
  return updated;
}

export function addComment(threadId: string, comment: ForumComment): ForumThread[] {
  const threads = getAllThreads();
  const updated = threads.map(t => {
    if (t.id === threadId) {
      return {
        ...t,
        comments: [...t.comments, comment]
      };
    }
    return t;
  });
  saveThreads(updated);
  return updated;
}

// Reset data to initial synthetic seed
export function resetAllDataToDefault(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEYS.USERS);
  window.localStorage.removeItem(STORAGE_KEYS.COURSES);
  window.localStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS);
  window.localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
  window.localStorage.removeItem(STORAGE_KEYS.GRADES);
  window.localStorage.removeItem(STORAGE_KEYS.THREADS);
}
