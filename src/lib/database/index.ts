import { createClient } from '@supabase/supabase-js';

const key: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const url: string = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

console.log('Supabase URL:', url);
console.log('Supabase Key:', key ? 'Configured' : 'Missing');

const supabase = createClient(url, key);

export default supabase;
