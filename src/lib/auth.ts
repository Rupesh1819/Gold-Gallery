"use client";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL!;

export async function signInWithEmail(email: string, pass: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });
  if (error) throw error;
  if (!data.user) throw new Error("No user returned");
  return data.user;
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export function isAdmin(user: User | null): boolean {
  if (!user) return false;
  return user.email === ADMIN_EMAIL;
}
