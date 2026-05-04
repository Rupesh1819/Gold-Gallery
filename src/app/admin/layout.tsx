"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Menu, X, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { isAdmin, signInWithEmail, signOut } from "@/lib/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoadingAuth(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    try {
      const loggedUser = await signInWithEmail(email, password);
      setUser(loggedUser);
    } catch (err: any) {
      setLoginError(err.message || "Invalid credentials");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
  };

  if (loadingAuth) {
    return <div className="p-8 text-center text-muted mt-12">Verifying Vault Access...</div>;
  }

  if (!isAdmin(user)) {
    return (
      <div className="admin-layout" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-surface-container)" }}>
        <div className="card" style={{ maxWidth: "420px", width: "100%", padding: "var(--space-8)", margin: "var(--space-4)" }}>
          <h2 className="text-display-md mb-2 text-center" style={{ color: "var(--color-primary)" }}>Vault Access</h2>
          <p className="text-body-md text-center text-muted mb-6">Restricted to authorized personnel only.</p>
          
          {loginError && (
            <div className="mb-4 text-center" style={{ color: "var(--color-error)", background: "var(--color-error-container)", padding: "var(--space-2)" }}>
              {loginError}
            </div>
          )}
          
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div className="input-group">
              <label className="input-label">Admin Email</label>
              <input type="email" required className="input-field" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input type="password" required className="input-field" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary mt-4" disabled={isLoggingIn} style={{ width: "100%" }}>
              {isLoggingIn ? "Authenticating..." : "Unlock Vault"}
            </button>
          </form>
        </div>
      </div>
    );
  }

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
          
          <div className="divider" style={{ margin: "var(--space-4) 0" }}></div>
          <button onClick={handleLogout} className="text-body-md text-muted hover:text-gold" style={{ display: "flex", alignItems: "center", gap: "8px", textAlign: "left" }}>
            <LogOut size={16} /> Secure Logout
          </button>
        </nav>
      </aside>
      
      <main className="admin-content">
        <Navbar />
        {children}
      </main>
    </div>
  );
}
