import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load env vars from frontend/.env.local
dotenv.config({ path: 'frontend/.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in frontend/.env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const users = [
  { email: 'austinmck17@gmail.com', password: 'BigCarly!' },
  { email: 'cobbalivia@gmail.com', password: 'BigCarly!' },
];

async function createUsers() {
  console.log('Creating users...');

  for (const user of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true, // Auto-confirm email
    });

    if (error) {
      console.error(`Failed to create ${user.email}:`, error.message);
    } else {
      console.log(`Successfully created user: ${user.email} (ID: ${data.user.id})`);
    }
  }
}

createUsers();

