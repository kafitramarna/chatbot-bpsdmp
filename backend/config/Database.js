import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_ANON_KEY
// );

export const supabase = createClient(
  "https://udmtrhrqfgdtwamxkdjz.supabase.co/",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkbXRyaHJxZmdkdHdhbXhrZGp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwNDY2OTQsImV4cCI6MjA0NjYyMjY5NH0.2m65fTFczqeIYwxBMnzbALrE28iQsS2Hf7vDHG59rwc"
);
