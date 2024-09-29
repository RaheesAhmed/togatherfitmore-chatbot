import { openai } from "../lib/openai.js";
import { processFileAndSaveToSupabase } from "./langchain_rag.js";

export async function processPodcast(audioData, fileName) {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: new Blob([audioData], { type: "audio/mpeg" }),
      model: "whisper-1",
      response_format: "text",
    });

    if (!transcription) {
      throw new Error("Transcription failed or returned unexpected data");
    }

    // Process the transcription directly without saving to a file
    const response = await processFileAndSaveToSupabase(transcription);

    return response;
  } catch (error) {
    console.error("Error in processPodcast:", error);
    throw error;
  }
}
