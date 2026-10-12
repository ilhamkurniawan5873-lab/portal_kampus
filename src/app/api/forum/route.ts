import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_THREADS } from '@/lib/initialData';

// VULNERABLE ENDPOINT: Stored XSS
// In a vulnerable system, thread content and comments are saved without HTML sanitization/escaping!
export async function GET() {
  return NextResponse.json({
    success: true,
    threads: INITIAL_THREADS
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, authorName, authorRole, threadId } = body;

    // Notice: NO SANITIZATION IS PERFORMED!
    // Tags like <script>, <img onerror>, <iframe onload> are accepted directly as raw strings!
    return NextResponse.json({
      success: true,
      message: 'Postingan tersimpan ke database tanpa sanitasi (Vulnerable to Stored XSS)!',
      savedData: {
        id: `gen-${Date.now()}`,
        title,
        content,
        authorName,
        authorRole,
        threadId,
        createdAt: 'Baru saja'
      },
      securityNotice: {
        isVulnerable: true,
        vulnerabilityType: 'Stored XSS (Cross-Site Scripting)',
        cwe: 'CWE-79: Improper Neutralization of Input During Web Page Generation',
        explanation: 'Input disimpan apa adanya dan akan dieksekusi di browser pengguna lain ketika dirender tanpa escaping.'
      }
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }
}
