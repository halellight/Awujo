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

if (!supabaseUrl || !serviceKey) {
    console.error("❌ Missing SUPABASE_SERVICE_ROLE_KEY or URL in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function resetPassword() {
    const adminEmail = 'praiseibec@gmail.com';
    const newPassword = 'AdminPassword2026!'; // Temporary secure password

    console.log(`🚀 Initiating password reset for: ${adminEmail}...`);

    try {
        // 1. Find the user by email
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

        if (listError) throw listError;

        let user = users.find(u => u.email === adminEmail);

        if (!user) {
            console.log(`User ${adminEmail} not found. Creating account...`);
            const { data: { user: newUser }, error: createError } = await supabase.auth.admin.createUser({
                email: adminEmail,
                password: newPassword,
                email_confirm: true
            });

            if (createError) throw createError;
            user = newUser;
            console.log("✅ User created successfully!");
        } else {
            console.log(`User ${adminEmail} found. Updating password...`);
            const { error: updateError } = await supabase.auth.admin.updateUserById(
                user.id,
                { password: newPassword }
            );
            if (updateError) throw updateError;
            console.log("✅ Password updated successfully!");
        }

        // 2. Update the password
        const { data, error: updateError } = await supabase.auth.admin.updateUserById(
            user.id,
            { password: newPassword }
        );

        if (updateError) throw updateError;

        console.log("✅ Password reset successful!");
        console.log("-----------------------------------------");
        console.log(`Email:    ${adminEmail}`);
        console.log(`Password: ${newPassword}`);
        console.log("-----------------------------------------");
        console.log("Please log in at /admin/login and change this immediately.");

    } catch (err) {
        console.error("💥 Critical Failure:", err.message);
        process.exit(1);
    }
}

resetPassword();
