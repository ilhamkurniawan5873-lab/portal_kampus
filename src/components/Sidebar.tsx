'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { 
  LayoutDashboard, 
  GraduationCap, 
  FileText, 
  MessagesSquare, 
  Users, 
  ShieldAlert, 
  LogOut,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { currentUser, logout } = useAuth();

  if (!currentUser) return null;

  const role = currentUser.role;

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['mahasiswa', 'dosen', 'admin']
    },
    {
      label: role === 'mahasiswa' ? 'Transkrip & Nilai' : 'Pengelolaan Nilai',
      href: '/dashboard/grades',
      icon: GraduationCap,
      roles: ['mahasiswa', 'dosen', 'admin']
    },
    {
      label: role === 'mahasiswa' ? 'Tugas Kuliah' : 'Koreksi & Nilai Tugas',
      href: '/dashboard/assignments',
      icon: FileText,
      roles: ['mahasiswa', 'dosen', 'admin']
    },
    {
      label: 'Forum Diskusi',
      href: '/dashboard/forum',
      icon: MessagesSquare,
      roles: ['mahasiswa', 'dosen', 'admin'],
      badge: 'XSS Lab'
    },
    {
      label: 'Manajemen Akun',
      href: '/dashboard/admin',
      icon: Users,
      roles: ['admin', 'dosen', 'mahasiswa'], // Accessible for demo purposes with admin badge
      adminOnly: true
    },
    {
      label: 'Security Lab & PoC',
      href: '/dashboard/security-lab',
      icon: ShieldAlert,
      roles: ['mahasiswa', 'dosen', 'admin'],
      badge: '2 Celah',
      isHighlight: true
    }
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)'
          }}>
            <BookOpen size={22} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
              CyberCampus
            </h1>
            <p style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
              UDIKOM Nusantara
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ padding: '1.25rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto' }}>
        <div style={{ padding: '0 0.5rem 0.5rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
          Menu Portal
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.7rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.86rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#fff' : (item.isHighlight ? '#f87171' : 'var(--text-secondary)'),
                background: isActive 
                  ? 'linear-gradient(90deg, rgba(79, 70, 229, 0.25) 0%, rgba(99, 102, 241, 0.1) 100%)' 
                  : (item.isHighlight ? 'rgba(239, 68, 68, 0.08)' : 'transparent'),
                border: isActive 
                  ? '1px solid rgba(99, 102, 241, 0.4)' 
                  : (item.isHighlight ? '1px dashed rgba(239, 68, 68, 0.3)' : '1px solid transparent'),
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={18} color={isActive ? 'var(--primary-light)' : (item.isHighlight ? '#f87171' : 'currentColor')} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span style={{
                  fontSize: '0.65rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px',
                  fontWeight: 700,
                  background: item.isHighlight ? 'rgba(239, 68, 68, 0.25)' : 'rgba(99, 102, 241, 0.2)',
                  color: item.isHighlight ? '#fca5a5' : '#a5b4fc',
                  border: `1px solid ${item.isHighlight ? 'rgba(239, 68, 68, 0.4)' : 'rgba(99, 102, 241, 0.4)'}`
                }}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Switcher in Sidebar Footer */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: currentUser.role === 'admin' 
              ? 'linear-gradient(135deg, #f43f5e, #be123c)' 
              : currentUser.role === 'dosen' 
              ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' 
              : 'linear-gradient(135deg, #06b6d4, #0284c7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.9rem',
            color: '#fff',
            flexShrink: 0
          }}>
            {currentUser.name.charAt(0)}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {currentUser.name}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
              <span className={`badge badge-${currentUser.role}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                {currentUser.role}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {currentUser.identifier}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--accent-rose)',
            background: 'rgba(244, 63, 94, 0.08)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            transition: 'all 0.15s ease'
          }}
        >
          <LogOut size={14} />
          <span>Keluar Sesi</span>
        </button>
      </div>
    </aside>
  );
}
