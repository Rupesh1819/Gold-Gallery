'use client';

import { useState, useEffect } from 'react';
import { Users, Shield, Trash2, Phone, Mail, RefreshCw, Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { downloadCsvFile } from '@/lib/export/csvExport';

interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalBookings: number;
  preferredLanguage: string;
  anonymized: boolean;
  isLive?: boolean;
}

const fallbackCustomers: CustomerRecord[] = [
  {
    id: 'c-demo-1',
    name: 'Rahul Sharma',
    phone: '+91 98201 12345',
    email: 'rahul.s@example.com',
    totalBookings: 3,
    preferredLanguage: 'English',
    anonymized: false,
    isLive: false,
  },
  {
    id: 'c-demo-2',
    name: 'Priya Mukherjee',
    phone: '+91 98192 34567',
    email: 'priya.m@example.com',
    totalBookings: 1,
    preferredLanguage: 'Marathi',
    anonymized: false,
    isLive: false,
  },
  {
    id: 'c-demo-3',
    name: 'Amit Kulkarni',
    phone: '+91 94220 56789',
    email: 'amit.k@example.com',
    totalBookings: 2,
    preferredLanguage: 'Hindi',
    anonymized: false,
    isLive: false,
  },
];

export default function CustomersAdminPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>(fallbackCustomers);
  const [loading, setLoading] = useState(true);
  const [anonymizing, setAnonymizing] = useState(false);
  const [anonymizeModalOpen, setAnonymizeModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const fetchLiveCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/customers');
      if (res.ok) {
        const json = await res.json();
        if (json.customers && json.customers.length > 0) {
          const liveList: CustomerRecord[] = json.customers.map((c: any) => ({
            id: c.id,
            name: c.name,
            phone: c.phone,
            email: c.email,
            totalBookings: c.totalBookings,
            preferredLanguage: c.preferredLanguage,
            anonymized: c.anonymized,
            isLive: true,
          }));
          setCustomers(liveList);
        }
      }
    } catch (e) {
      console.error('Failed to load live customers:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveCustomers();
  }, []);

  const confirmAnonymize = async () => {
    if (!selectedCustomerId) return;
    const target = customers.find((c) => c.id === selectedCustomerId);

    // Optimistic UI update
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === selectedCustomerId
          ? {
              ...c,
              name: 'Anonymized Seeker',
              phone: 'REDACTED',
              email: 'N/A',
              anonymized: true,
            }
          : c
      )
    );

    if (target?.isLive) {
      try {
        setAnonymizing(true);
        await fetch('/api/admin/customers', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedCustomerId, action: 'anonymize' }),
        });
      } catch (err) {
        console.error('Failed to anonymize customer record:', err);
      } finally {
        setAnonymizing(false);
      }
    }

    setAnonymizeModalOpen(false);
    setSelectedCustomerId(null);
  };

  const exportCustomersCsv = () => {
    const headers = ['Seeker ID', 'Full Name', 'Phone Number', 'Email Address', 'Total Consultations', 'Language', 'Status'];
    const rows = customers.map((c) => [
      c.id,
      c.name,
      c.phone,
      c.email,
      c.totalBookings,
      c.preferredLanguage,
      c.anonymized ? 'Anonymized (DPDP)' : 'Active Seeker',
    ]);
    downloadCsvFile('myguruji_seekers_directory', headers, rows);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#27304A]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#27304A] border border-[#D8B56D]/30 text-[#F6D186] text-[11px] font-semibold mb-2">
            <span>SEEKER PRIVACY &amp; DPDP ACT</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#F6D186] tracking-tight">
            Customer Records
          </h1>
          <p className="text-xs text-[#D0C5B4] mt-0.5">
            Seeker profiles, consultation histories, and DPDP-compliant data anonymisation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCustomersCsv}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141B2F] hover:bg-[#27304A] text-xs font-semibold text-[#DBE1FD] border border-[#27304A] transition-all cursor-pointer"
            title="Download CSV for Excel"
          >
            <Download className="h-3.5 w-3.5 text-[#D8B56D]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={fetchLiveCustomers}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#27304A] hover:bg-[#344062] text-xs font-semibold text-[#F6D186] border border-[#D8B56D]/30 transition-all cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-[#D8B56D]' : ''}`} />
            <span>Refresh Live</span>
          </button>
        </div>
      </div>

      <div className="bg-[#181F33] rounded-2xl border border-[#27304A] shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#27304A] flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-[#DBE1FD]">
            Seeker Registry ({customers.length})
          </h2>
          <span className="text-[11px] text-[#D8B56D] font-semibold flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Supabase DPDP Storage
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#141B2F] text-[11px] uppercase font-bold text-[#D0C5B4] tracking-wider border-b border-[#27304A]">
              <tr>
                <th className="px-6 py-3.5">Seeker Name</th>
                <th className="px-6 py-3.5">Phone Number</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Language</th>
                <th className="px-6 py-3.5">Total Consultations</th>
                <th className="px-6 py-3.5 text-right">Data Erasure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27304A]/60">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-[#27304A]/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#DBE1FD]">
                    {c.name}
                    {c.anonymized && (
                      <span className="text-[10px] text-red-400 ml-2 font-normal">(Anonymized)</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[#D0C5B4] font-mono text-xs">
                    {c.phone}
                  </td>
                  <td className="px-6 py-4 text-[#D0C5B4]/80 text-xs">
                    {c.email}
                  </td>
                  <td className="px-6 py-4 text-[#DBE1FD] text-xs">
                    {c.preferredLanguage}
                  </td>
                  <td className="px-6 py-4 text-[#F6D186] font-semibold text-xs">
                    {c.totalBookings}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!c.anonymized ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCustomerId(c.id);
                          setAnonymizeModalOpen(true);
                        }}
                        className="text-xs font-semibold text-red-400 hover:text-red-300 hover:underline cursor-pointer"
                      >
                        Anonymise (DPDP)
                      </button>
                    ) : (
                      <span className="text-xs text-[#D0C5B4]/40">Erased</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={anonymizeModalOpen}
        onClose={() => setAnonymizeModalOpen(false)}
        title="Anonymise Customer Personal Data?"
      >
        <div className="space-y-4 text-sm text-[#10172B]">
          <p>
            Under India&apos;s DPDP Act, executing this action will permanently overwrite the customer&apos;s name, phone, email, and notes with placeholders. Past financial totals will remain intact for bookkeeping.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setAnonymizeModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={confirmAnonymize} disabled={anonymizing}>
              {anonymizing ? 'Anonymising...' : 'Permanently Anonymise'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
