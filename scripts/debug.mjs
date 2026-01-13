import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envFile = readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
    envFile.split('\n')
        .filter(line => line.includes('=') && !line.startsWith('#'))
        .map(line => line.split('=').map(s => s.trim()))
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
    console.log("URL:", env.NEXT_PUBLIC_SUPABASE_URL);
    const { data, error } = await supabase.from('projects').select('*').limit(1);

    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Data:", data);
    }
}

check();
