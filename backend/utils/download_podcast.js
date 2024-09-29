import fs from "fs";
import config from "../config/index.js";
import axios from "axios";
import { processPodcast } from "./proceesPodcast.js";

export const getSpotifyPodcastInfo = async (episodeId) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/episodes/${episodeId}`,
      {
        headers: {
          Authorization: `Bearer ${config.spotifyAccessToken}`,
        },
      }
    );

    const episodeInfo = {
      name: response.data.name,
      description: response.data.description,
      release_date: response.data.release_date,
      duration_ms: response.data.duration_ms,
      external_urls: response.data.external_urls,
    };

    return episodeInfo;
  } catch (error) {
    console.error("Error fetching Spotify podcast info:", error);
    throw error;
  }
};

export const downloadSpotifyPodcast = async (episodeId) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${config.spotifyAccessToken}`,
      },
    });

    const audioFile = response.data.audio_preview_url;
    const audioFilePath = `./downloads/${episodeId}.mp3`;
    const audioFileStream = fs.createWriteStream(audioFilePath);
    const audioResponse = await axios({
      method: "GET",
      url: audioFile,
      responseType: "stream",
    });

    audioResponse.data.pipe(audioFileStream);
    await new Promise((resolve, reject) => {
      audioFileStream.on("finish", resolve);
      audioFileStream.on("error", reject);
    });

    console.log("Spotify podcast downloaded successfully");
    const audioText = await processPodcast(audioFilePath, episodeId);
    return audioText;
  } catch (error) {
    console.error("Error downloading Spotify podcast:", error);
    throw error;
  }
};
