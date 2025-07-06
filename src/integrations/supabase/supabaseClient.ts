
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://wicibyyfypcgldlzuxbk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpY2lieXlmeXBjZ2xkbHp1eGJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NzIzMzEsImV4cCI6MjA2NzA0ODMzMX0.SsGa0sedWeCgoplgtFQ7WbknbMbL_5ddRZjsinUrHDI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
