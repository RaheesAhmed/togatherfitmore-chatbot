import express from "express";
import multer from "multer";
import cors from "cors";
import { fileURLToPath } from "url";
import http from "http";
import path from "path";
import os from "os";
import { processPodcast } from "./utils/proceesPodcast.js";
import { processFileAndSaveToSupabase } from "./utils/langchain_rag.js";
import { writeFile, unlink, readFile } from "fs/promises";
import { processUrl } from "./utils/process_url.js";
import { queryRAGSystem } from "./utils/langchain_rag.js";
import { get_all_training } from "./utils/get_all_files.js";
import {
  isWhatsAppBotActive,
  toggleWhatsAppBot,
  setWhatsAppInstructions,
  getWhatsAppBotStatus,
} from "./utils/whatsapp.js";
import {
  getSpotifyPodcastInfo,
  downloadSpotifyPodcast,
} from "./utils/download_podcast.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { generateContent } from "./utils/generate_content.js";
import {
  getLocalWhatsapp,
  destroyWhatsAppClient,
  whatsappClient,
} from "./utils/local_whatsapp.js";
import { getCustomInstructions } from "./utils/langchain_rag.js";
import {
  createFineTuningJob,
  getFineTuningJobStatus,
} from "./utils/finetune.js";

import { prepareTrainingFile } from "./utils/prepare_files.js";
import { setSystemInstruction } from "./utils/whatsapp.js";
import { delete_file, delete_all_files } from "./utils/delete_files.js";
import {
  metricsCalculator,
  trackMetrics,
} from "./utils/apiMetricsCalculator.js";
import { rateLimit } from "express-rate-limit";

const app = express();
const server = http.createServer(app);
const upload = multer();
app.set("trust proxy", 1);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
  origin: "http://localhost:3001",
  methods: ["GET", "POST"],
  credentials: true,
};

app.use(trackMetrics);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//middleware
app.use(apiLimiter);
app.use(errorHandler);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Serve Socket.IO client script
app.get("/socket.io/socket.io.js", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "node_modules",
      "socket.io",
      "client-dist",
      "socket.io.js"
    )
  );
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/whatsapp", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "whatsapp.html"));
});

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  console.log("recieved message:", message);
  try {
    const response = await queryRAGSystem(message, null, "open");
    console.log("response:", response);
    const { answer, memory } = response;
    res.json({ response: answer, memory: memory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/upload-training", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Use the OS temp directory instead of a hardcoded path
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, file.originalname);

    // Save the file temporarily
    await writeFile(tempFilePath, file.buffer);

    // Process the file and save to Supabase
    await processFileAndSaveToSupabase(tempFilePath);

    // Clean up the temporary file
    await unlink(tempFilePath);

    metricsCalculator.recordTrainingDataUpload(file.size);

    return res.json({ message: "File processed and saved successfully" });
  } catch (error) {
    console.error("Error in upload-training endpoint:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/delete-training", async (req, res) => {
  try {
    const { fileId } = req.body;
    console.log("recieved file ID:", fileId);

    if (!fileId) {
      return res.status(400).send({ error: "File ID is required" });
    }

    await delete_file(fileId);
    return res.send({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return res.status(500).send({ error: "Failed to delete file" });
  }
});

app.delete("/api/delete-all-training", async (req, res) => {
  try {
    const { ids } = req.body;
    console.log("recieved file IDs:", ids);
    await delete_all_files(ids);
    return res.json({ message: "File deleted successfully" });
  } catch (error) {
    return res.json({ error: "Failed to delete file" }, { status: 500 });
  }
});

app.post("/api/podcast", async (req, res) => {
  const start = performance.now();
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return res.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const response = await processPodcast(arrayBuffer, file.name);
    const duration = performance.now() - start;
    metricsCalculator.recordPodcastProcessing(duration);

    return res.json({ response: "Podcast processed successfully" });
  } catch (error) {
    console.error("Error processing podcast:", error);
    return res.json({
      error: "Failed to process podcast",
      details: error instanceof Error ? error.message : error,
    });
  }
});

app.post("/api/url", async (req, res) => {
  const { url } = req.body;
  try {
    const response = await processUrl(url);
    return res.json({ response: "URL processed successfully" });
  } catch (error) {
    return res.json({ error: "Failed to process URL" }, { status: 500 });
  }
});

app.post("/api/whatsapp-chat", async (req, res) => {
  try {
    const { from, message } = req.body;
    console.log("Incoming WhatsApp message:", { from, message });

    if (isWhatsAppBotActive()) {
      console.log("WhatsApp bot is active, processing message...");
      const response = await queryRAGSystem(message, "whatsapp");
      console.log("AI response:", response);

      await sendWhatsAppMessage(from, response);
      console.log("WhatsApp message sent successfully");
      metricsCalculator.recordWhatsAppMessage();
    } else {
      console.log("WhatsApp bot is not active");
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error handling WhatsApp message:", error);
    res.status(500).json({ error: "Failed to process WhatsApp message" });
  }
});

app.post("/api/whatsapp-instructions", async (req, res) => {
  try {
    const { instructions } = req.body;
    const response = await setWhatsAppInstructions(instructions);
    if (response) {
      res.json({
        message: "WhatsApp instructions set successfully",
        data: response,
      });
    } else {
      res.status(500).json({ error: "Failed to set WhatsApp instructions" });
    }
  } catch (error) {
    console.error("Error setting WhatsApp instructions:", error);
    res.status(500).json({ error: "Failed to set WhatsApp instructions" });
  }
});

app.post("/api/set-system-instruction", async (req, res) => {
  try {
    const { instruction } = req.body;
    console.log(instruction);
    const response = await setSystemInstruction(instruction);
    res.json({ message: "System instruction set successfully" });
  } catch (error) {
    console.error("Error setting system instruction:", error);
    res.status(500).json({ error: "Failed to set system instruction" });
  }
});

app.get("/api/get-all-training", async (req, res) => {
  try {
    const response = await get_all_training();
    //console.log(response);
    res.json({ response: response });
  } catch (error) {
    console.error("Error in get-all-training endpoint:", error);
    res.status(500).json({ error: "Failed to get all training data" });
  }
});

app.post("/api/download-podcast", async (req, res) => {
  const { episodeId } = req.body;
  try {
    const response = await downloadSpotifyPodcast(episodeId);
    res.json({ response: "Podcast downloaded successfully" });
  } catch (error) {
    console.error("Error downloading podcast:", error);
    res.status(500).json({ error: "Failed to download podcast" });
  }
});

app.post("/api/get-podcast-info", async (req, res) => {
  const { episodeId } = req.body;
  try {
    const response = await getSpotifyPodcastInfo(episodeId);
    res.json({ response: response });
  } catch (error) {
    console.error("Error getting podcast info:", error);
    res.status(500).json({ error: "Failed to get podcast info" });
  }
});

app.post("/api/generate-content", async (req, res) => {
  const start = performance.now();
  try {
    const {
      title_or_topic,
      keywords,
      tone,
      style,
      word_count,
      target_audience,
    } = req.body;
    const response = await generateContent(
      title_or_topic,
      keywords,
      tone,
      style,
      word_count,
      target_audience
    );
    const duration = performance.now() - start;
    metricsCalculator.recordContentGeneration(duration);
    res.json({ response: response });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

app.get("/api/whatsapp-status", async (req, res) => {
  try {
    const isEnabled = await getWhatsAppBotStatus();
    const isConnected = whatsappClient ? whatsappClient.isConnected : false;
    res.json({ isEnabled, isConnected });
  } catch (error) {
    console.error("Error checking WhatsApp status:", error);
    res.status(500).json({ error: "Failed to check WhatsApp status" });
  }
});

app.post("/api/whatsapp-toggle", async (req, res) => {
  let whatsappIO;
  try {
    const { enable } = req.body;
    await toggleWhatsAppBot(enable);

    if (enable) {
      if (!whatsappIO) {
        whatsappIO = getLocalWhatsapp(server);
      }
      res.json({ message: "WhatsApp bot enabled" });
    } else {
      if (whatsappIO) {
        whatsappIO.close();
        whatsappIO = null;
      }
      res.json({ message: "WhatsApp bot disabled" });
    }
  } catch (error) {
    console.error("Error toggling WhatsApp bot:", error);
    res.status(500).json({ error: "Failed to toggle WhatsApp bot" });
  }
});

app.post("/api/finetune", async (req, res) => {
  const { model, training_file, validation_file } = req.body;
  try {
    const response = await createFineTuningJob(
      model,
      training_file,
      validation_file
    );
    metricsCalculator.recordFineTuningJob();
    res.json({ response: response });
  } catch (error) {
    console.error("Error creating fine-tuning job:", error);
    res.status(500).json({ error: "Failed to create fine-tuning job" });
  }
});

app.get("/api/finetune-status", async (req, res) => {
  const { job_id } = req.body;
  const response = await getFineTuningJobStatus(job_id);
  res.json({ response: response });
});

app.post("/api/prepare-training", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Use the OS temp directory
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, req.file.originalname);

    // Write the file buffer to the temp file
    await writeFile(tempFilePath, req.file.buffer);

    const outputPath = path.join(tempDir, "training_data.jsonl");
    const response = await prepareTrainingFile(tempFilePath, outputPath);

    if (response) {
      // Read the generated file
      const fileContent = await readFile(outputPath, "utf8");

      res.json({
        response: response,
        generatedFile: fileContent,
      });

      // Clean up the temporary files
      await unlink(tempFilePath);
      await unlink(outputPath);
    } else {
      res.status(500).json({ error: "Failed to prepare training file" });
    }
  } catch (error) {
    console.error("Error preparing training file:", error);
    res.status(500).json({ error: "Failed to prepare training file" });
  }
});

app.get("/api/metrics", (req, res) => {
  const metrics = metricsCalculator.getMetrics();
  res.json(metrics);
});

// Add this function to initialize the WhatsApp bot status when the server starts
const initializeWhatsAppBotStatus = async () => {
  try {
    const status = await getWhatsAppBotStatus();
    if (status) {
      getLocalWhatsapp(server);
    }
    console.log(
      `WhatsApp bot initial status: ${status ? "active" : "inactive"}`
    );
  } catch (error) {
    console.error("Error initializing WhatsApp bot status:", error);
  }
};

const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await initializeWhatsAppBotStatus();
});
