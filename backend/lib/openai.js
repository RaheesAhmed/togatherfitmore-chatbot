import { OpenAI } from "openai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Check if the API key is available

export const openai = new OpenAI();
