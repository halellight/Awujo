import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envFile = readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
    envFile.split('\n')
        .filter(line => line.includes('=') && !line.startsWith('#'))
        .map(line => {
            const [key, ...valueParts] = line.split('=');
            let value = valueParts.join('=').trim();
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
            else if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
            return [key.trim(), value];
        })
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
    console.log("Checking database records...");
    const { count: reps, error: e1 } = await supabase.from('representatives').select('*', { count: 'exact', head: true });
    const { count: projects, error: e2 } = await supabase.from('projects').select('*', { count: 'exact', head: true });
    const { count: policies, error: e3 } = await supabase.from('policies').select('*', { count: 'exact', head: true });
    const { count: reports, error: e4 } = await supabase.from('project_reports').select('*', { count: 'exact', head: true });

    if (e1) console.error("Reps Error:", e1.message);
    if (e2) console.error("Projects Error:", e2.message);
    if (e3) console.error("Policies Error:", e3.message);
    if (e4) console.error("Reports Error:", e4.message);

    console.log(`Representatives: ${reps}`);
    console.log(`Projects: ${projects}`);
    console.log(`Policies: ${policies}`);
    console.log(`Project Reports: ${reports}`);
}

check();
