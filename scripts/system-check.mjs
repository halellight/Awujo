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

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function checkSystem() {
    console.log("--- Checking Petitions ---");
    const { data: petitions, error: pError } = await supabase.from('petitions').select('*');
    if (pError) console.error("Petitions Error:", pError.message);
    else console.log(`Found ${petitions?.length} petitions:`, JSON.stringify(petitions, null, 2));

    console.log("\n--- Checking Reports ---");
    const { data: reports, error: rError } = await supabase.from('project_reports').select('*');
    if (rError) console.error("Reports Error:", rError.message);
    else {
        console.log(`Found ${reports?.length} reports:`, JSON.stringify(reports, null, 2));
    }
}

checkSystem();
