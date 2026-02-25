import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// ✅ クライアント側用（ブラウザ）
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // ✅ Cookie 自動保存を無効化
    autoRefreshToken: false, // ✅ 自動リフレッシュを無効化
    detectSessionInUrl: false, // ✅ URL からのセッション検出を無効化
  },
});

// ✅ サーバー側用（API ルート用）
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
