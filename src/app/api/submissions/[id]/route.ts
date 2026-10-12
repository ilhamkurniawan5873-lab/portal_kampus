import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_SUBMISSIONS } from '@/lib/initialData';

// VULNERABLE ENDPOINT: IDOR (Insecure Direct Object Reference) / Broken Access Control
// This endpoint receives an ID and directly serves the submission details and file content preview
// WITHOUT validating whether the requesting user is the student owner or the assigned lecturer!
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Try to find the submission
  const submission = INITIAL_SUBMISSIONS.find(s => s.id === id);

  if (!submission) {
    return NextResponse.json(
      { 
        success: false, 
        error: `Submission with ID '${id}' was not found in the system.` 
      }, 
      { status: 404 }
    );
  }

  // Intentionally returns private student submission without ownership validation (IDOR)
  return NextResponse.json({
    success: true,
    data: submission,
    securityNotice: {
      isVulnerable: true,
      vulnerabilityType: 'IDOR (Insecure Direct Object Reference) / Broken Access Control',
      cwe: 'CWE-639: Authorization Bypass Through User-Controlled Key',
      explanation: 'Sistem langsung mengembalikan berkas dan catatan tugas milik mahasiswa lain hanya dengan mengganti parameter ID tanpa memvalidasi sesi/token kepemilikan.',
      testedId: id
    }
  });
}
