import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT,
  openAIApiKey: process.env.OPENAI_API_KEY,
  vectorStorePath: process.env.VECTOR_STORE_PATH || "vectorStore.index",
  uploadsDir: process.env.UPLOADS_DIR || "uploads",
  whatsappApiKey: process.env.WHATSAPP_API_KEY,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY,
  whatsappPhoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  whatsappAccessToken: process.env.WHATSAPP_ACCESS_TOKEN,
  spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
  spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
};
