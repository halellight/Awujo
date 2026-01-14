import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

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

async function checkQuery(name, query) {
    console.log(`\n--- ${name} ---`);
    // Using a trick: query a non-existent column to see the full table content in error if needed, 
    // or just try to select * if allowed via RPC or if it's a view.
    // Actually, we can try to query information_schema.
    const { data, error } = await supabase.from(query).select('*');
    if (error) {
        console.log(`Error: ${error.message}`);
    } else {
        console.log(JSON.stringify(data, null, 2));
    }
}

async function runAudit() {
    console.log("Auditing database for 'users' references...");

    // 1. List all policies
    const { data: policies, error } = await supabase
        .from('pg_policies')
        .select('schemaname, tablename, policyname, qual, with_check');

    if (error) {
        console.log("Could not access pg_policies directly. Error:", error.message);
    } else {
        console.log("Found policies:", policies.length);
        policies.filter(p => JSON.stringify(p).includes('users'))
            .forEach(p => console.log(`[POL_MATCH] ${p.tablename}: ${p.policyname} -> ${p.qual}`));
    }

    // 2. List triggers
    const { data: triggers, error: trigErr } = await supabase
        .from('pg_trigger')
        .select('tgname, tgrelid::regclass');

    if (trigErr) {
        console.log("Could not access pg_trigger directly. Error:", trigErr.message);
    } else {
        console.log("Found triggers:", triggers.length);
    }

    // 3. Check for foreign keys to anything resembling 'users'
    const { data: fks, error: fkErr } = await supabase
        .from('information_schema.key_column_usage')
        .select('table_name, column_name, constraint_name')
        .eq('table_schema', 'public');

    if (fkErr) {
        console.log("Could not access information_schema. Error:", fkErr.message);
    } else {
        console.log("Table structure check complete.");
    }
}

runAudit();
