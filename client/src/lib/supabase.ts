import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://oplgegstlksgtfpalghf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wbGdlZ3N0bGtzZ3RmcGFsZ2hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyOTI1NzIsImV4cCI6MjA4NTg2ODU3Mn0.bL76AdgI6vzZd8mzJoZ-UPIcg4eX6WfCg1sFNSQj6nE";

export const supabase = createClient(supabaseUrl, supabaseKey);
