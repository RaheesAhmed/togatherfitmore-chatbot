import { createClient } from "@supabase/supabase-js";
import config from "../config/index.js";

if (!config.supabaseUrl || !config.supabaseKey) {
  throw new Error("Missing Supabase URL or Key");
}

export const supabaseClient = createClient(
  config.supabaseUrl,
  config.supabaseKey
);
