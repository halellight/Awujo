import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';

// Load env from .env.local
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

async function diagnose() {
    const results = {
        probes: [],
        insertTest: null,
    };

    // Attempt to probe for a 'users' table in common schemas
    const probes = [
        { schema: 'public', table: 'users' },
        { schema: 'auth', table: 'users' },
        { schema: 'public', table: 'profiles' }
    ];

    for (const probe of probes) {
        const { error } = await supabase.from(probe.table).select('count', { count: 'exact', head: true });
        results.probes.push({
            target: `${probe.schema}.${probe.table}`,
            status: error ? `Error: ${error.message}` : 'FOUND & ACCESSIBLE'
        });
    }

    // Attempt dry-run insertion
    const { error: insertError } = await supabase.from('petitions').insert([{
        title: 'DIAGNOSTIC_PROBE',
        description: 'Testing for hidden triggers',
        target_authority: 'SYSTEM_AUDIT'
    }]);

    if (insertError) {
        results.insertTest = { success: false, error: insertError };
    } else {
        results.insertTest = { success: true };
        await supabase.from('petitions').delete().eq('title', 'DIAGNOSTIC_PROBE');
    }

    writeFileSync('diag_results.json', JSON.stringify(results, null, 2));
}

diagnose();
