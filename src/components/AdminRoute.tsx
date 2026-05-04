"use client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { isAdmin } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user || null;
      if (currentUser && isAdmin(currentUser)) {
        setUser(currentUser);
      } else if (currentUser && !isAdmin(currentUser)) {
        alert("You do not have admin access.");
        router.push("/");
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user || null;
      if (currentUser && isAdmin(currentUser)) {
        setUser(currentUser);
      } else if (currentUser && !isAdmin(currentUser)) {
        alert("You do not have admin access.");
        router.push("/");
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return <div className="container section text-center">Loading admin...</div>;
  }

  if (!user) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
