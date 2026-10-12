'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { getAllUsers, addUser, updateUser, deleteUser } from '@/lib/store';
import { User, UserRole } from '@/lib/types';
import { 
  Users, 
  UserPlus, 
  Edit2, 
  Trash2, 
  KeyRound, 
  Search, 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Sparkles,
  X,
  Check,
  Filter
} from 'lucide-react';

export default function AdminPage() {
  const { currentUser, refreshUsers } = useAuth();
  const [users, setUsers] = useState<User[]>(getAllUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');

  // Create User Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    identifier: '',
    username: '',
    role: 'mahasiswa' as UserRole,
    email: '',
    prodiOrDept: 'S1 Teknik Informatika',
    password: 'Password123!'
  });

  // Edit User Modal
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    identifier: '',
    role: 'mahasiswa' as UserRole,
    prodiOrDept: '',
    status: 'aktif' as 'aktif' | 'nonaktif' | 'cuti'
  });

  if (!currentUser) return null;

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      u.name.toLowerCase().includes(query) ||
      u.identifier.toLowerCase().includes(query) ||
      u.username.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query);
    return matchesRole && matchesQuery;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name || !createForm.identifier || !createForm.username) return;

    // Check duplicate identifier or username
    if (users.some(u => u.identifier === createForm.identifier || u.username === createForm.username)) {
      alert('NIM/NIP atau Username sudah terdaftar! Harap gunakan data sintetis yang unik.');
      return;
    }

    const newUser: User = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: createForm.name,
      identifier: createForm.identifier,
      username: createForm.username,
      role: createForm.role,
      email: createForm.email || `${createForm.username}@udikom.ac.id`,
      prodiOrDept: createForm.prodiOrDept,
      password: createForm.password,
      status: 'aktif',
      semester: createForm.role === 'mahasiswa' ? 5 : undefined,
      ipk: createForm.role === 'mahasiswa' ? 3.50 : undefined,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = addUser(newUser);
    setUsers(updated);
    refreshUsers();
    setShowCreateModal(false);
    setCreateForm({
      name: '',
      identifier: '',
      username: '',
      role: 'mahasiswa',
      email: '',
      prodiOrDept: 'S1 Teknik Informatika',
      password: 'Password123!'
    });
    alert(`Akun sintetis baru (${newUser.name}) berhasil ditambahkan!`);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      identifier: user.identifier,
      role: user.role,
      prodiOrDept: user.prodiOrDept,
      status: user.status
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updated = updateUser(editingUser.id, {
      name: editForm.name,
      identifier: editForm.identifier,
      role: editForm.role,
      prodiOrDept: editForm.prodiOrDept,
      status: editForm.status
    });

    setUsers(updated);
    refreshUsers();
    setEditingUser(null);
  };

  const handleDeleteUser = (user: User) => {
    if (user.id === currentUser.id) {
      alert('Anda tidak dapat menghapus akun Anda sendiri saat sedang aktif!');
      return;
    }

    if (confirm(`Hapus akun sintetis ${user.name} (${user.identifier}) dari sistem?`)) {
      const updated = deleteUser(user.id);
      setUsers(updated);
      refreshUsers();
    }
  };

  const handleResetPassword = (user: User) => {
    updateUser(user.id, { password: 'Password123!' });
    alert(`Kata sandi akun ${user.name} berhasil di-reset menjadi default 'Password123!'`);
  };

  const handleGenerateSyntheticAccount = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const sampleNames = ['Rian Adiputra', 'Nadia Safitri', 'Fajar Ramadhan', 'Maya Kusuma', 'Dewi Lestari'];
    const selectedName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const username = selectedName.toLowerCase().replace(' ', '.') + randomNum.toString().slice(-2);
    
    setCreateForm({
      name: selectedName,
      identifier: `230101${randomNum}`,
      username: username,
      role: 'mahasiswa',
      email: `${username}@mhs.udikom.ac.id`,
      prodiOrDept: 'S1 Teknik Informatika',
      password: 'Password123!'
    });
    setShowCreateModal(true);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Users color="var(--accent-rose)" size={30} />
            <span>Manajemen Akun Pengguna (Admin Panel)</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Kelola data akun mahasiswa, dosen, dan staf universitas. Seluruh data bersifat sintetis dan unik.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleGenerateSyntheticAccount}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Sparkles size={16} color="var(--accent-cyan)" />
            <span>Generate Akun Sintetis</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <UserPlus size={16} />
            <span>Tambah Akun Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
          <input
            type="text"
            className="form-input"
            style={{ width: '100%', paddingLeft: '2.5rem', fontSize: '0.875rem' }}
            placeholder="Cari berdasarkan nama, NIM, NIP, atau username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        {/* Role Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter Peran:</span>
          {(['all', 'mahasiswa', 'dosen', 'admin'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`switcher-pill ${roleFilter === r ? 'active' : ''}`}
              style={{ textTransform: 'capitalize' }}
            >
              {r === 'all' ? 'Semua Akun' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Identitas Pengguna</th>
              <th>NIM / NIP</th>
              <th>Peran Akun</th>
              <th>Program Studi / Departemen</th>
              <th style={{ textAlign: 'center' }}>Status Akun</th>
              <th style={{ textAlign: 'center' }}>Aksi Admin</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: user.role === 'admin' 
                        ? 'linear-gradient(135deg, #f43f5e, #be123c)' 
                        : user.role === 'dosen' 
                        ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' 
                        : 'linear-gradient(135deg, #06b6d4, #0284c7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      color: '#fff',
                      flexShrink: 0
                    }}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        @{user.username} &bull; {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <code style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.85rem' }}>
                    {user.identifier}
                  </code>
                </td>
                <td>
                  <span className={`badge badge-${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {user.prodiOrDept}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`badge ${user.status === 'aktif' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.72rem' }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    <button
                      onClick={() => handleOpenEdit(user)}
                      className="btn btn-secondary btn-sm"
                      title="Edit Akun"
                    >
                      <Edit2 size={13} />
                    </button>

                    <button
                      onClick={() => handleResetPassword(user)}
                      className="btn btn-warning btn-sm"
                      title="Reset Kata Sandi"
                    >
                      <KeyRound size={13} />
                    </button>

                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="btn btn-danger btn-sm"
                      title="Hapus Akun"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                  Tambah Akun Pengguna Sintetis Baru
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Isi data sintetis baru (NIM/NIP dan data tidak boleh sama dengan akun lain).
                </p>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)} 
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.4rem' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="namaUser">Nama Lengkap</label>
                  <input
                    id="namaUser"
                    type="text"
                    className="form-input"
                    placeholder="misal: Bagas Pratama"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="idNum">NIM / NIP (Harus Unik)</label>
                  <input
                    id="idNum"
                    type="text"
                    className="form-input"
                    placeholder="misal: 2301010199"
                    value={createForm.identifier}
                    onChange={(e) => setCreateForm({ ...createForm, identifier: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="usrName">Username</label>
                  <input
                    id="usrName"
                    type="text"
                    className="form-input"
                    placeholder="misal: bagas.pratama"
                    value={createForm.username}
                    onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="roleSelect">Peran Akun (Role)</label>
                  <select
                    id="roleSelect"
                    className="form-select"
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as UserRole })}
                  >
                    <option value="mahasiswa">Mahasiswa</option>
                    <option value="dosen">Dosen</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prodiText">Program Studi / Departemen Biro</label>
                <input
                  id="prodiText"
                  type="text"
                  className="form-input"
                  placeholder="misal: S1 Teknik Informatika"
                  value={createForm.prodiOrDept}
                  onChange={(e) => setCreateForm({ ...createForm, prodiOrDept: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pwd">Kata Sandi Awal</label>
                <input
                  id="pwd"
                  type="text"
                  className="form-input"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <UserPlus size={16} />
                  <span>Daftarkan Akun</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                  Edit Data Akun Pengguna
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Perbarui identitas akun @{editingUser.username}
                </p>
              </div>
              <button 
                onClick={() => setEditingUser(null)} 
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.4rem' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="editName">Nama Lengkap</label>
                <input
                  id="editName"
                  type="text"
                  className="form-input"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="editIdentifier">NIM / NIP</label>
                  <input
                    id="editIdentifier"
                    type="text"
                    className="form-input"
                    value={editForm.identifier}
                    onChange={(e) => setEditForm({ ...editForm, identifier: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="editRole">Peran Akun</label>
                  <select
                    id="editRole"
                    className="form-select"
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value as UserRole })}
                  >
                    <option value="mahasiswa">Mahasiswa</option>
                    <option value="dosen">Dosen</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="editDept">Prodi / Departemen</label>
                  <input
                    id="editDept"
                    type="text"
                    className="form-input"
                    value={editForm.prodiOrDept}
                    onChange={(e) => setEditForm({ ...editForm, prodiOrDept: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="editStatus">Status Akun</label>
                  <select
                    id="editStatus"
                    className="form-select"
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Non-Aktif</option>
                    <option value="cuti">Cuti Akademik</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="btn btn-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <Check size={16} />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
