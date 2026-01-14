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

async function testRpc() {
    const { data: petitions } = await supabase.from('petitions').select('id').limit(1);
    if (!petitions || petitions.length === 0) {
        console.log("No petitions to test.");
        return;
    }

    const id = petitions[0].id;
    console.log(`Testing RPC for petition: ${id}`);

    const { error } = await supabase.rpc('increment_petition_signatures', { petition_id: id });

    if (error) {
        console.error("RPC Error:", error.message);
        console.error("Full Error:", JSON.stringify(error, null, 2));
    } else {
        console.log("✅ RPC success!");
    }
}

testRpc();
