import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Users,
  Shield,
  Search,
  RefreshCw,
  X,
  ArrowUp,
  ArrowDown,
  KeyRound,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import PageLayout from './components/PageLayout';
import './UserManagement.css';

const API_BASE = 'http://localhost:5000';
const PAGE_SIZE = 10;

const AVATAR_TONES = [
  { bg: '#e8eef8', color: '#1e40af' },
  { bg: '#e8f5ee', color: '#166534' },
  { bg: '#f3eef8', color: '#6b21a8' },
  { bg: '#fdf4e8', color: '#b45309' },
  { bg: '#eef2f6', color: '#334155' }
];

function getInitials(name) {
  if (!name) return '?';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

function getAvatarTone(userId) {
  return AVATAR_TONES[Number(userId) % AVATAR_TONES.length];
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('clinician')) || {};
  } catch {
    return {};
  }
}

function ConfirmModal({ open, title, message, confirmLabel, confirmTone, onConfirm, onCancel, loading }) {
  if (!open) return null;

  return (
    <div className="um-modal-overlay" role="presentation" onClick={onCancel}>
      <div
        className="um-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="um-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="um-modal-header">
          <h3 id="um-modal-title">{title}</h3>
          <button type="button" className="um-modal-close" onClick={onCancel} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <p className="um-modal-message">{message}</p>
        <div className="um-modal-actions">
          <button type="button" className="um-btn um-btn-secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button
            type="button"
            className={`um-btn um-btn-${confirmTone}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processing…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div className="um-toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`um-toast um-toast-${toast.type}`}>
          <div className="um-toast-copy">
            <strong>{toast.title}</strong>
            {toast.message ? <span>{toast.message}</span> : null}
          </div>
          <button type="button" className="um-toast-dismiss" onClick={() => onDismiss(toast.id)} aria-label="Dismiss">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null);

  const currentUser = useMemo(() => getCurrentUser(), []);

  const addToast = useCallback((type, title, message = '') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/user`);
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      addToast('error', 'Failed to load users', 'Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter]);

  useEffect(() => {
    const closeMenu = () => setOpenMenuId(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.full_name?.toLowerCase().includes(query) ||
        String(user.user_id).includes(query) ||
        user.role?.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === 'All' || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, page]);

  const stats = useMemo(() => ({
    total: users.length,
    admins: users.filter((u) => u.role === 'Admin').length
  }), [users]);

  const paginationLabel = useMemo(() => {
    if (filteredUsers.length === 0) return 'Showing 0 of 0 users';
    const start = (page - 1) * PAGE_SIZE + 1;
    const end = Math.min(page * PAGE_SIZE, filteredUsers.length);
    return `Showing ${start} to ${end} of ${filteredUsers.length} users`;
  }, [filteredUsers.length, page]);

  const closeModal = () => setModal(null);

  const runAction = async (actionFn) => {
    setActionLoading(true);
    try {
      await actionFn();
      await loadUsers();
      closeModal();
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || err.response?.data || err.message || 'Something went wrong.';
      addToast('error', 'Action failed', typeof message === 'string' ? message : 'Unable to complete the request.');
    } finally {
      setActionLoading(false);
    }
  };

  const openPromoteModal = (user) => {
    setModal({
      type: 'promote',
      user,
      title: 'Promote to Admin',
      message: `Grant administrator privileges to ${user.full_name}? They will be able to manage users and admit patients.`,
      confirmLabel: 'Promote',
      confirmTone: 'primary'
    });
  };

  const openDemoteModal = (user) => {
    setModal({
      type: 'demote',
      user,
      title: 'Demote to Clinician',
      message: `Remove administrator privileges from ${user.full_name}? They will retain clinician access only.`,
      confirmLabel: 'Demote',
      confirmTone: 'warning'
    });
  };

  const openResetModal = (user) => {
    setModal({
      type: 'reset',
      user,
      title: 'Reset Password',
      message: `Reset the password for ${user.full_name}? A temporary password will be assigned.`,
      confirmLabel: 'Reset Password',
      confirmTone: 'accent'
    });
  };

  const openDeleteModal = (user) => {
    setModal({
      type: 'delete',
      user,
      title: 'Delete User',
      message: `Permanently delete ${user.full_name}? This action cannot be undone.`,
      confirmLabel: 'Delete User',
      confirmTone: 'danger'
    });
  };

  const handleModalConfirm = () => {
    if (!modal?.user) return;
    const { user, type } = modal;

    if (type === 'promote') {
      runAction(async () => {
        await axios.put(`${API_BASE}/user/promote/${user.user_id}`);
        addToast('success', 'User promoted', `${user.full_name} is now an Admin.`);
      });
      return;
    }

    if (type === 'demote') {
      runAction(async () => {
        await axios.put(`${API_BASE}/user/demote/${user.user_id}`);
        addToast('success', 'User demoted', `${user.full_name} is now a Clinician.`);
      });
      return;
    }

    if (type === 'reset') {
      runAction(async () => {
        await axios.put(`${API_BASE}/user/reset-password/${user.user_id}`);
        addToast('success', 'Password reset', `Temporary password for ${user.full_name}: User@123`);
      });
      return;
    }

    if (type === 'delete') {
      runAction(async () => {
        await axios.delete(`${API_BASE}/user/${user.user_id}`);
        addToast('success', 'User deleted', `${user.full_name} has been removed.`);
      });
    }
  };

  const copyUserId = async (userId) => {
    try {
      await navigator.clipboard.writeText(String(userId));
      addToast('success', 'Copied', `User ID ${userId} copied to clipboard.`);
    } catch {
      addToast('error', 'Copy failed', 'Unable to copy user ID.');
    }
    setOpenMenuId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('clinician');
    window.location.hash = '#/';
  };

  const isSelf = (userId) => Number(userId) === Number(currentUser.user_id);

  return (
    <PageLayout
      activeItem="User Management"
      onNavigate={(item) => {
        if (item === 'Dashboard') window.location.hash = '#/dashboard';
        if (item === 'Patients') window.location.hash = '#/dashboard';
        if (item === 'Alerts') window.location.hash = '#/dashboard';
        if (item === 'Reports') window.location.hash = '#/reports';
        if (item === 'User Management') window.location.hash = '#/users';
        if (item === 'Settings') window.location.hash = '#/settings';
        if (item === 'Logout') handleLogout();
      }}
    >
      <div className="um-page">
        <header className="um-page-header">
          <div className="um-page-header-copy">
            <span className="um-kicker">Administration</span>
            <h1>User Management</h1>
            <p>Manage clinician and administrator accounts</p>
          </div>
          <div className="um-page-header-actions">
            <button type="button" className="um-btn um-btn-secondary" onClick={loadUsers} disabled={loading}>
              <RefreshCw size={16} className={loading ? 'um-spin' : ''} />
              Refresh
            </button>
            <button type="button" className="um-btn um-btn-primary" onClick={() => (window.location.hash = '#/dashboard')}>
              Back to Dashboard
            </button>
          </div>
        </header>

        <section className="um-stats-card">
          <div className="um-stat-item">
            <div className="um-stat-icon">
              <Users size={20} strokeWidth={2} />
            </div>
            <div>
              <span className="um-stat-label">Total Users</span>
              <strong className="um-stat-value">{stats.total}</strong>
            </div>
          </div>
          <div className="um-stat-divider" aria-hidden="true" />
          <div className="um-stat-item">
            <div className="um-stat-icon">
              <Shield size={20} strokeWidth={2} />
            </div>
            <div>
              <span className="um-stat-label">Admin Users</span>
              <strong className="um-stat-value">{stats.admins}</strong>
            </div>
          </div>
        </section>

        <section className="um-toolbar-card">
          <div className="um-search-wrap">
            <Search size={18} className="um-search-icon" aria-hidden="true" />
            <input
              type="search"
              className="um-search-input"
              placeholder="Search by name, ID, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search users"
            />
          </div>
          <div className="um-toolbar-controls">
            <label className="um-filter-wrap">
              <span className="um-filter-label">Role:</span>
              <select
                className="um-filter-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                aria-label="Filter by role"
              >
                <option value="All">All</option>
                <option value="Admin">Admin</option>
                <option value="Clinician">Clinician</option>
              </select>
            </label>
            <button
              type="button"
              className="um-icon-btn"
              onClick={loadUsers}
              disabled={loading}
              aria-label="Refresh users"
              title="Refresh"
            >
              <RefreshCw size={18} className={loading ? 'um-spin' : ''} />
            </button>
          </div>
        </section>

        <section className="um-table-card">
          <div className="um-table-scroll">
            {loading ? (
              <div className="um-empty-state">
                <RefreshCw size={28} className="um-spin" />
                <p>Loading user directory…</p>
              </div>
            ) : paginatedUsers.length === 0 ? (
              <div className="um-empty-state">
                <Users size={28} />
                <p>{search || roleFilter !== 'All' ? 'No users match your filters.' : 'No users found.'}</p>
              </div>
            ) : (
              <table className="um-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>User ID</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => {
                    const tone = getAvatarTone(user.user_id);
                    return (
                      <tr key={user.user_id}>
                        <td>
                          <div className="um-user-profile">
                            <span
                              className="um-avatar"
                              style={{ background: tone.bg, color: tone.color }}
                              aria-hidden="true"
                            >
                              {getInitials(user.full_name)}
                            </span>
                            <span className="um-user-name">{user.full_name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="um-user-id">#{user.user_id}</span>
                        </td>
                        <td>
                          <span
                            className={`um-role-badge ${
                              user.role === 'Admin' ? 'um-role-admin' : 'um-role-clinician'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <div className="um-actions">
                            {user.role === 'Clinician' ? (
                              <button
                                type="button"
                                className="um-action-outline um-action-outline-blue"
                                onClick={() => openPromoteModal(user)}
                              >
                                <ArrowUp size={15} />
                                Promote
                              </button>
                            ) : (
                              !isSelf(user.user_id) && (
                                <button
                                  type="button"
                                  className="um-action-outline um-action-outline-blue"
                                  onClick={() => openDemoteModal(user)}
                                >
                                  <ArrowDown size={15} />
                                  Demote
                                </button>
                              )
                            )}
                            <button
                              type="button"
                              className="um-action-outline um-action-outline-gold"
                              onClick={() => openResetModal(user)}
                            >
                              <KeyRound size={15} />
                              Reset Password
                            </button>
                            {!isSelf(user.user_id) && (
                              <button
                                type="button"
                                className="um-action-outline um-action-outline-red"
                                onClick={() => openDeleteModal(user)}
                              >
                                <Trash2 size={15} />
                                Delete
                              </button>
                            )}
                            <div className="um-menu-wrap">
                              <button
                                type="button"
                                className="um-icon-btn um-menu-trigger"
                                aria-label={`More actions for ${user.full_name}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId((current) => (current === user.user_id ? null : user.user_id));
                                }}
                              >
                                <MoreVertical size={18} />
                              </button>
                              {openMenuId === user.user_id && (
                                <div className="um-menu" role="menu">
                                  <button type="button" role="menuitem" onClick={() => copyUserId(user.user_id)}>
                                    Copy User ID
                                  </button>
                                  <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      openResetModal(user);
                                    }}
                                  >
                                    Reset Password
                                  </button>
                                  {!isSelf(user.user_id) && (
                                    <button
                                      type="button"
                                      role="menuitem"
                                      className="um-menu-danger"
                                      onClick={() => {
                                        setOpenMenuId(null);
                                        openDeleteModal(user);
                                      }}
                                    >
                                      Delete User
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <footer className="um-table-footer">
            <span>{paginationLabel}</span>
            <div className="um-pagination">
              <button
                type="button"
                className="um-icon-btn"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="um-page-indicator">{page}</span>
              <button
                type="button"
                className="um-icon-btn"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </footer>
        </section>

        <footer className="um-copyright">
          © {new Date().getFullYear()} IAF Vital Monitoring System. All rights reserved.
        </footer>
      </div>

      <ConfirmModal
        open={Boolean(modal)}
        title={modal?.title}
        message={modal?.message}
        confirmLabel={modal?.confirmLabel}
        confirmTone={modal?.confirmTone}
        onConfirm={handleModalConfirm}
        onCancel={closeModal}
        loading={actionLoading}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </PageLayout>
  );
}
