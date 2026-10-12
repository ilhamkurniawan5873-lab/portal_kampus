import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_GRADES, INITIAL_USERS } from '@/lib/initialData';

// VULNERABLE ENDPOINT: IDOR / Weak Access Control on student grades
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');

  if (!studentId) {
    return NextResponse.json({
      success: true,
      allGrades: INITIAL_GRADES,
      note: 'Semua nilai mahasiswa dikembalikan tanpa otorisasi peran!'
    });
  }

  const studentGrades = INITIAL_GRADES.filter(g => g.studentId === studentId);
  const student = INITIAL_USERS.find(u => u.id === studentId);

  return NextResponse.json({
    success: true,
    student: student ? {
      name: student.name,
      nim: student.identifier,
      prodi: student.prodiOrDept,
      ipk: student.ipk
    } : null,
    grades: studentGrades,
    securityNotice: {
      isVulnerable: true,
      vulnerabilityType: 'IDOR / Broken Access Control on Grades',
      cwe: 'CWE-285: Improper Authorization',
      explanation: 'Endpoint nilai akademik dapat diakses oleh siapapun untuk melihat transkrip mahasiswa lain cukup dengan memodifikasi query param studentId.'
    }
  });
}
