'use client';

import { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  ShieldCheck,
  KeyRound,
  UserPlus,
  Mail,
  Send,
  Trash2,
  Check,
  AlertCircle,
  Lock,
  UserCheck,
  Sparkles,
  Phone,
  RefreshCw,
  X,
} from 'lucide-react';
import { siteConfig } from '@/config/site';

interface AdminAccountItem {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
}

export default function SettingsAdminPage() {
  // General Site Settings
  const [approvalMode, setApprovalMode] = useState('manual');
  const [phone, setPhone] = useState(siteConfig.contact.phone);
  const [email, setEmail] = useState(siteConfig.contact.email);
  const [saved, setSaved] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Admin Team Accounts State
  const [accounts, setAccounts] = useState<AdminAccountItem[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('Consultant Astrologer');
  const [addingAdmin, setAddingAdmin] = useState(false);

  // Test Email State
  const [testEmailRecipient, setTestEmailRecipient] = useState(siteConfig.contact.email);
  const [emailStatus, setEmailStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [emailSending, setEmailSending] = useState(false);

  // Load Admin Accounts
  const loadAccounts = async () => {
    try {
      setAccountsLoading(true);
      const res = await fetch('/api/admin/accounts');
      const data = await res.json();
      if (data.accounts) {
        setAccounts(data.accounts);
      }
    } catch (err) {
      console.error('Failed to load admin accounts:', err);
    } finally {
      setAccountsLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordStatus({ type: 'error', message: 'New password must be at least 8 characters long.' });
      return;
    }

    try {
      setPasswordLoading(true);
      const primaryId = accounts[0]?.id || 'admin-primary-1';
      const res = await fetch('/api/admin/accounts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: primaryId,
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setPasswordStatus({ type: 'success', message: 'Master admin credentials updated securely!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordStatus({ type: 'error', message: data.error || 'Failed to update password.' });
      }
    } catch (err: any) {
      setPasswordStatus({ type: 'error', message: err.message || 'Connection error' });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Add New Team Admin
  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAddingAdmin(true);
      const res = await fetch('/api/admin/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAdminName,
          email: newAdminEmail,
          password: newAdminPassword,
          role: newAdminRole,
        }),
      });
      const data = await res.json();

      if (data.success && data.account) {
        setAccounts((prev) => [...prev, data.account]);
        setIsAddAccountOpen(false);
        setNewAdminName('');
        setNewAdminEmail('');
        setNewAdminPassword('');
      } else {
        alert(data.error || 'Failed to add administrator.');
      }
    } catch (err: any) {
      alert('Error creating account: ' + err.message);
    } finally {
      setAddingAdmin(false);
    }
  };

  // Toggle Account Active / Inactive
  const toggleAccountStatus = async (account: AdminAccountItem) => {
    if (account.id === 'admin-primary-1') {
      alert('Primary Super Admin cannot be deactivated.');
      return;
    }
    const nextStatus = !account.active;
    try {
      await fetch('/api/admin/accounts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: account.id,
          toggleActive: nextStatus,
        }),
      });
      setAccounts((prev) =>
        prev.map((a) => (a.id === account.id ? { ...a, active: nextStatus } : a))
      );
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  // Delete Admin Account
  const handleDeleteAccount = async (id: string) => {
    if (id === 'admin-primary-1') {
      alert('Primary Super Admin cannot be deleted.');
      return;
    }
    if (!confirm('Remove this administrator access?')) return;

    try {
      const res = await fetch(`/api/admin/accounts?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAccounts((prev) => prev.filter((a) => a.id !== id));
      } else {
        alert(data.error || 'Failed to delete account');
      }
    } catch (err) {
      alert('Error deleting account');
    }
  };

  // Send Test Email
  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailStatus(null);
    try {
      setEmailSending(true);
      const res = await fetch('/api/admin/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: testEmailRecipient }),
      });
      const data = await res.json();

      if (data.success) {
        setEmailStatus({
          type: 'success',
          message: data.message,
        });
      } else {
        setEmailStatus({
          type: 'error',
          message: data.error || 'Failed to dispatch test email',
        });
      }
    } catch (err: any) {
      setEmailStatus({ type: 'error', message: err.message || 'Connection error' });
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Title */}
      <div className="pb-2 border-b border-[#27304A]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#27304A] border border-[#D8B56D]/30 text-[#F6D186] text-[11px] font-semibold mb-2">
          <span>SYSTEM &amp; SECURITY CONFIGURATION</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#F6D186] tracking-tight">
          Settings &amp; Admin Management
        </h1>
        <p className="text-xs text-[#D0C5B4] mt-0.5">
          Manage credentials, multi-admin access, transactional email delivery, and sanctuary contact details.
        </p>
      </div>

      {/* SECTION 1: CHANGE MASTER PASSWORD */}
      <div className="bg-[#181F33] rounded-2xl p-6 sm:p-7 border border-[#27304A] shadow-sm space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#D8B56D]/15 text-[#F6D186]">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-[#DBE1FD]">
              Admin Credentials &amp; Password
            </h2>
            <p className="text-xs text-[#D0C5B4]/70">
              Update password for the primary administrator account (<span className="text-[#F6D186]">admin@astroveda.com</span>).
            </p>
          </div>
        </div>

        {passwordStatus && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              passwordStatus.type === 'success'
                ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                : 'bg-red-500/15 text-red-400 border border-red-500/30'
            }`}
          >
            {passwordStatus.type === 'success' ? (
              <Check className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{passwordStatus.message}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#D0C5B4] mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                placeholder="••••••••"
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B2F] border border-[#27304A] text-xs text-[#DBE1FD] focus:outline-none focus:border-[#D8B56D]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#D0C5B4] mb-1.5">
                New Secure Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                placeholder="Min 8 characters"
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B2F] border border-[#27304A] text-xs text-[#DBE1FD] focus:outline-none focus:border-[#D8B56D]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#D0C5B4] mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                placeholder="Re-type new password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B2F] border border-[#27304A] text-xs text-[#DBE1FD] focus:outline-none focus:border-[#D8B56D]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={passwordLoading}
              className="px-5 py-2 rounded-xl bg-[#D8B56D] hover:bg-[#F6D186] text-[#10172B] font-bold text-xs transition-colors cursor-pointer"
            >
              {passwordLoading ? 'Updating...' : 'Update Admin Password'}
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: MULTI-ADMIN TEAM ACCOUNTS */}
      <div className="bg-[#181F33] rounded-2xl border border-[#27304A] shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#27304A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#27304A] text-[#F6D186]">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-[#DBE1FD]">
                Administrator &amp; Consultant Accounts
              </h2>
              <p className="text-xs text-[#D0C5B4]/70">
                Authorized team members with access to the MyGuruji management portal.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddAccountOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#D8B56D] hover:bg-[#F6D186] text-[#10172B] font-bold text-xs transition-colors cursor-pointer w-fit"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Admin Account</span>
          </button>
        </div>

        <div className="divide-y divide-[#27304A]/60">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#27304A]/30 transition-colors text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#DBE1FD] text-sm">{acc.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#27304A] text-[#F6D186] border border-[#D8B56D]/30">
                    {acc.role}
                  </span>
                  {acc.id === 'admin-primary-1' && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] uppercase font-bold bg-green-500/20 text-green-300">
                      Primary
                    </span>
                  )}
                </div>
                <p className="text-[#D0C5B4]">{acc.email}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleAccountStatus(acc)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                    acc.active
                      ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                      : 'bg-[#27304A] text-[#D0C5B4]/60'
                  }`}
                >
                  {acc.active ? 'Active' : 'Disabled'}
                </button>

                {acc.id !== 'admin-primary-1' && (
                  <button
                    onClick={() => handleDeleteAccount(acc.id)}
                    className="p-1.5 rounded-lg bg-red-600/15 text-red-400 hover:bg-red-600/30 transition-colors cursor-pointer"
                    title="Remove Account"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: TRANSACTIONAL EMAIL DISPATCHER */}
      <div className="bg-[#181F33] rounded-2xl p-6 sm:p-7 border border-[#27304A] shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#27304A] text-[#F6D186]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-[#DBE1FD]">
                Automated Email Dispatcher (Resend API)
              </h2>
              <p className="text-xs text-[#D0C5B4]/70">
                Sends branded booking confirmations and astrological reminders to seeker inboxes.
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#27304A] text-[#F6D186] border border-[#D8B56D]/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D8B56D]" />
            Dispatcher Active
          </span>
        </div>

        {emailStatus && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              emailStatus.type === 'success'
                ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                : 'bg-red-500/15 text-red-400 border border-red-500/30'
            }`}
          >
            {emailStatus.type === 'success' ? (
              <Check className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{emailStatus.message}</span>
          </div>
        )}

        <form onSubmit={handleSendTestEmail} className="space-y-3">
          <label className="block text-xs font-semibold text-[#D0C5B4]">
            Send Verification Test Email
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="email"
              required
              value={testEmailRecipient}
              onChange={(e) => setTestEmailRecipient(e.target.value)}
              placeholder="Enter your email to test (e.g. astrologer@gmail.com)"
              className="flex-1 w-full px-3.5 py-2.5 rounded-xl bg-[#141B2F] border border-[#27304A] text-xs text-[#DBE1FD] focus:outline-none focus:border-[#D8B56D]"
            />
            <button
              type="submit"
              disabled={emailSending}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#27304A] hover:bg-[#344062] border border-[#D8B56D]/30 text-[#F6D186] font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{emailSending ? 'Dispatching...' : 'Send Test Email'}</span>
            </button>
          </div>
          <p className="text-[11px] text-[#D0C5B4]/60">
            To enable real inbox delivery via custom domain, configure <code className="text-[#F6D186]">RESEND_API_KEY</code> in your environment file.
          </p>
        </form>
      </div>

      {/* SECTION 4: GENERAL SANCTUARY SETTINGS */}
      <form onSubmit={handleSaveGeneral} className="bg-[#181F33] rounded-2xl p-6 sm:p-7 border border-[#27304A] shadow-sm space-y-6">
        <div>
          <h2 className="font-heading text-lg font-bold text-[#DBE1FD]">
            Appointment Approval Rules
          </h2>
          <p className="text-xs text-[#D0C5B4]/70 mt-0.5">
            Decide whether new booking requests need manual astrologer review or confirm immediately.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#D0C5B4] mb-1.5">
            Booking Approval Mode
          </label>
          <select
            value={approvalMode}
            onChange={(e) => setApprovalMode(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[#27304A] text-xs font-semibold text-[#F6D186] bg-[#141B2F] focus:outline-none focus:border-[#D8B56D]"
          >
            <option value="manual">Manual Approval (Recommended - Holds slot as pending)</option>
            <option value="auto">Automatic Approval (Immediate confirmation)</option>
          </select>
        </div>

        <div className="pt-4 border-t border-[#27304A] space-y-4">
          <h2 className="font-heading text-lg font-bold text-[#DBE1FD]">
            Public Business Contact Info
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#D0C5B4] mb-1.5">
                Public Phone &amp; WhatsApp
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#141B2F] border border-[#27304A] text-xs text-[#DBE1FD] focus:outline-none focus:border-[#D8B56D]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#D0C5B4] mb-1.5">
                Official Sanctuary Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#141B2F] border border-[#27304A] text-xs text-[#DBE1FD] focus:outline-none focus:border-[#D8B56D]"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#27304A] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-green-400">
            {saved && (
              <span className="flex items-center gap-1 font-semibold">
                <ShieldCheck className="h-4 w-4" /> Contact parameters updated!
              </span>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#D62839] hover:bg-[#B81F2F] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Contact Settings</span>
          </button>
        </div>
      </form>

      {/* MODAL: ADD ADMIN ACCOUNT */}
      {isAddAccountOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleAddAccount}
            className="bg-[#181F33] border border-[#27304A] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-xs sm:text-sm"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#27304A]">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#D8B56D]" />
                <h3 className="font-heading text-lg font-bold text-[#F6D186]">
                  Add Administrator or Consultant
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddAccountOpen(false)}
                className="p-1 text-[#D0C5B4] hover:text-[#DBE1FD] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#DBE1FD] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pandit Rajesh Sharma"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B2F] border border-[#27304A] text-xs text-[#DBE1FD] focus:outline-none focus:border-[#D8B56D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#DBE1FD] mb-1">
                  Email Address (Login)
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rajesh@astroveda.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B2F] border border-[#27304A] text-xs text-[#DBE1FD] focus:outline-none focus:border-[#D8B56D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#DBE1FD] mb-1">
                  Initial Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Min 8 characters"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B2F] border border-[#27304A] text-xs text-[#DBE1FD] focus:outline-none focus:border-[#D8B56D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#DBE1FD] mb-1">
                  Portal Role
                </label>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B2F] border border-[#27304A] text-xs text-[#F6D186] font-semibold focus:outline-none focus:border-[#D8B56D]"
                >
                  <option value="Consultant Astrologer">Consultant Astrologer</option>
                  <option value="Ashram Coordinator">Ashram Coordinator</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#27304A]">
              <button
                type="button"
                onClick={() => setIsAddAccountOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#D0C5B4] hover:bg-[#27304A] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addingAdmin}
                className="px-5 py-2 rounded-xl bg-[#D8B56D] hover:bg-[#F6D186] text-[#10172B] font-bold text-xs transition-colors cursor-pointer"
              >
                {addingAdmin ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
