import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
    'https://fmawnrfwepqksamtepfh.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtYXducmZ3ZXBxa3NhbXRlcGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTg0MzA5ODMsImV4cCI6MTk3NDAwNjk4M30.gAAc53JoGodoqFUdcIwcFLT8InM8c3e3ouRd5kHbaWY')

export default supabase;

