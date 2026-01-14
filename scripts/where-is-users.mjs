import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';

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

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey);

async function probe() {
    const targets = [
        'users',
        'public.users',
        'auth.users',
        'public."Users"',
        '"Users"',
        'profiles',
        'public.profiles'
    ];

    const results = [];

    for (const target of targets) {
        // Try a select count to see if it exists
        try {
            const { data, error } = await supabase.from(target).select('count', { count: 'exact', head: true });
            results.push({
                target,
                status: error ? `Error: ${error.message} (Code: ${error.code})` : 'ACCESSIBLE'
            });
        } catch (e) {
            results.push({
                target,
                status: `Thrown Error: ${e.message}`
            });
        }
    }

    writeFileSync('probe_results.json', JSON.stringify(results, null, 2));
    console.log("Probe complete.");
}

probe();
