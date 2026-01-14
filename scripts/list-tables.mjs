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

async function listTables() {
    console.log("Listing tables in public schema...");
    const { data: tables, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

    if (error) {
        console.error("Error fetching tables from info_schema:", error);
        // Fallback: try common tables
        const commonTables = ['projects', 'project_reports', 'policies', 'petitions', 'representatives', 'users', 'profiles'];
        for (const table of commonTables) {
            const { error: tableError } = await supabase.from(table).select('*', { count: 'exact', head: true });
            if (!tableError) console.log(`[EXIST] ${table}`);
            else console.log(`[MISS]  ${table} - ${tableError.message}`);
        }
    } else {
        tables.forEach(t => console.log(`[EXIST] ${t.table_name}`));
    }

    console.log("\nChecking for triggers on representatives...");
    const { data: triggers, error: triggerError } = await supabase
        .from('information_schema.triggers')
        .select('trigger_name, event_manipulation, action_statement')
        .eq('event_object_table', 'representatives');

    if (triggerError) {
        console.log("Could not fetch triggers:", triggerError.message);
    } else {
        triggers.forEach(tr => console.log(`[TRIGGER] ${tr.trigger_name} - ${tr.event_manipulation} - ${tr.action_statement}`));
    }
}

listTables();
