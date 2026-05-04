import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zeowquchdsbljoujlhmr.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inplb3dxdWNoZHNibGpvdWpsaG1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NDA2MTEsImV4cCI6MjA5MzExNjYxMX0.oPdPaZ7NrHYo0ppbp4B3juBKXjBe5bCbtE63WLoZ-fg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
