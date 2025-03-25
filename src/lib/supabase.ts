
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kdvyhirsdauyqvsiqjgy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkdnloaXJzZGF1eXF2c2lxamd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUzNTk3MDgsImV4cCI6MjAzMDkzNTcwOH0.jEmJkuN3_EFXHm_dFIrQYHWGQVuFpgKRvZfZJr59LRQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
