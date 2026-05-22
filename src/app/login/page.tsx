"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmail, isAdmin, signOut } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import { useToast } from "@/context/ToastContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await signInWithEmail(email, password);
      if (isAdmin(user)) {
        showToast("Welcome back!", "success");
        router.push("/admin");
      } else {
        showToast("Access denied. Admin only.", "error");
        await signOut();
      }
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Check your credentials.";
      showToast("Login failed: " + message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container section" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div className="card" style={{ padding: "var(--space-8)", maxWidth: "400px", width: "100%", textAlign: "center" }}>
          <h1 className="text-headline-md mb-6">Vault Access</h1>
          <p className="text-body-md text-muted mb-8">
            Please sign in with your authorized admin account to manage the catalog.
          </p>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", textAlign: "left" }}>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input type="email" required className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="input-group mb-4">
              <label className="input-label">Password</label>
              <input type="password" required className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary w-full justify-center" disabled={loading}>
              {loading ? "Authenticating..." : "Sign in"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
