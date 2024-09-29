import axios from "axios";
import config from "../config/index.js";

const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1";

export const cloneVoice = async (audioFile, voiceName) => {
  try {
    const formData = new FormData();
    formData.append("name", voiceName);
    formData.append("files", audioFile);

    const response = await axios.post(
      `${ELEVENLABS_API_URL}/voices/add`,
      formData,
      {
        headers: {
          "xi-api-key": config.elevenLabsApiKey,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.voice_id;
  } catch (error) {
    console.error("Error cloning voice:", error);
    throw error;
  }
};

export const textToSpeech = async (text, voiceId) => {
  try {
    const response = await axios.post(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
      { text },
      {
        headers: {
          "xi-api-key": config.elevenLabsApiKey,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error converting text to speech:", error);
    throw error;
  }
};
