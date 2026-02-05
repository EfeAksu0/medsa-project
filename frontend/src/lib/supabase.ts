import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tmkhxlhacwfpspmmuevd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRta2h4bGhhY3dmcHNwbW11ZXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MDcwNzksImV4cCI6MjA4Mzk4MzA3OX0._ENYh_xa64aGWngysYz1oGqGvpB-U93oMBBjecjrn2w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
