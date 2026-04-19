import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// Try to load .env
if (fs.existsSync('.env')) {
  dotenv.config();
} else {
  console.log('⚠️  No .env file found. Testing via manual input...');
}

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

async function testConnection() {
  console.log('\n--- 🛠️  Supabase Connection Tester ---');
  
  if (!url || !key || url.includes('placeholder')) {
    console.error('❌ Error: Missing credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    console.log('Setup Guide:');
    console.log('1. Rename .env.example to .env');
    console.log('2. Copy your keys from Supabase Dashboard > Settings > API');
    return;
  }

  console.log(`Connecting to: ${url}`);
  const supabase = createClient(url, key);

  try {
    console.log('Testing Auth Service...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Auth Error:', authError.message);
    } else {
      console.log('✅ Auth Service: Accessible');
    }

    console.log('Testing Database Access (tasks table)...');
    const { data: dbData, error: dbError } = await supabase.from('tasks').select('*').limit(1);
    
    if (dbError) {
      console.error('❌ Database Error:', dbError.message);
      if (dbError.message.includes('not found')) {
        console.log('💡 Tip: Did you run the schema.sql in Supabase SQL editor?');
      }
    } else {
      console.log('✅ Database: Accessible');
      console.log('✅ TOTAL RESULT: Your configuration is VALID!');
    }

  } catch (err) {
    console.error('❌ Network Error: Failed to fetch. Is the URL correct?');
    console.error(err);
  }
}

testConnection();
