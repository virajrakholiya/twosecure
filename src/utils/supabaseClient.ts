import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabaseClient = async (supabaseToken: any) => {
  
  const supabase = createClient(supabaseURL, supabaseKEY, {
    global: { headers: { Authorization: `Bearer ${supabaseToken}` } },
  });
  return supabase
};

