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

async function deepAudit() {
    console.log("Starting deep schema audit...");

    // Check if there's an RPC we can use to run arbitrary SQL, or if we can query common views
    // Often information_schema is accessible to some extent depending on config.
    // However, the standard Supabase way is to check via PostgREST.

    // Let's try to query the search path or table list if possible
    const { data: tables, error: tableErr } = await supabase
        .from('pg_catalog.pg_tables')
        .select('schemaname, tablename')
        .ilike('tablename', '%users%');

    const { data: views, error: viewErr } = await supabase
        .from('pg_catalog.pg_views')
        .select('schemaname, viewname')
        .ilike('viewname', '%users%');

    const results = {
        scanResults: [],
        errors: []
    };

    if (tableErr) results.errors.push(`Table Scan Error: ${tableErr.message}`);
    else results.scanResults.push(...tables.map(t => `TABLE: ${t.schemaname}.${t.tablename}`));

    if (viewErr) results.errors.push(`View Scan Error: ${viewErr.message}`);
    else results.scanResults.push(...views.map(v => `VIEW: ${v.schemaname}.${v.viewname}`));

    // If both failed (likely due to permissions on pg_catalog), try information_schema
    if (results.scanResults.length === 0) {
        const { data: infoTables, error: infoErr } = await supabase
            .from('information_schema.tables')
            .select('table_schema, table_name')
            .ilike('table_name', '%users%');

        if (infoErr) results.errors.push(`Info Schema Error: ${infoErr.message}`);
        else results.scanResults.push(...infoTables.map(t => `INFO_TABLE: ${t.table_schema}.${t.table_name}`));
    }

    writeFileSync('deep_audit.json', JSON.stringify(results, null, 2));
    console.log("Audit complete. Results in deep_audit.json");
}

deepAudit();
