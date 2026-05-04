"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="admin-layout">
      {/* Mobile Hamburger Button */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        <h2 className="text-label-lg mb-8" style={{ color: "var(--color-gold)" }}>Vault Admin</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <a href="#dashboard" onClick={() => setIsOpen(false)} className="text-body-md" style={{ color: "var(--color-on-surface)" }}>Dashboard</a>
          <a href="#pricing" onClick={() => setIsOpen(false)} className="text-body-md text-muted hover:text-gold">Pricing Control</a>
          <a href="#inventory" onClick={() => setIsOpen(false)} className="text-body-md text-muted hover:text-gold">Inventory</a>
        </nav>
      </aside>
      
      <main className="admin-content">
        <Navbar />
        {children}
      </main>
    </div>
  );
}
