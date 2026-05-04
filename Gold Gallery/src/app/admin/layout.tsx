"use client";
import Navbar from "@/components/Navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="text-label-lg mb-8" style={{ color: "var(--color-gold)" }}>Vault Admin</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <a href="#dashboard" className="text-body-md" style={{ color: "var(--color-on-surface)" }}>Dashboard</a>
          <a href="#pricing" className="text-body-md text-muted hover:text-gold">Pricing Control</a>
          <a href="#inventory" className="text-body-md text-muted hover:text-gold">Inventory</a>
        </nav>
      </aside>
      <main className="admin-content">
        <Navbar />
        {children}
      </main>
    </div>
  );
}
