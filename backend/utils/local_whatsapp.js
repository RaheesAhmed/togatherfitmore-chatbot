import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import { Server } from "socket.io";
import { queryRAGSystem } from "./langchain_rag.js";
import fs from "fs/promises";
import path from "path";

let whatsappClient = null;
let io = null;

const getLocalWhatsapp = (httpServer) => {
  if (io) {
    return io;
  }

  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  const initializeWhatsAppClient = () => {
    if (whatsappClient) {
      whatsappClient.destroy();
    }

    whatsappClient = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        args: ["--no-sandbox"],
      },
    });

    whatsappClient.on("qr", (qr) => {
      console.log("QR RECEIVED");
      io.emit("qr", qr);
    });

    whatsappClient.on("ready", () => {
      console.log("Client is ready!");
      io.emit("ready");
    });

    whatsappClient.on("message", async (msg) => {
      if (msg.body) {
        console.log("Received message:", msg.body);
        try {
          const response = await queryRAGSystem(msg.body, null, "whatsapp");
          console.log("Sending response:", response.answer);
          await msg.reply(response.answer);
        } catch (error) {
          console.error("Error processing message:", error);
          await msg.reply(
            "Sorry, I encountered an error while processing your message."
          );
        }
      }
    });

    whatsappClient.on("disconnected", async (reason) => {
      console.log("Client was disconnected", reason);
      io.emit("disconnected", reason);

      try {
        const sessionDir = path.join(process.cwd(), ".wwebjs_auth", "session");
        await fs.rm(sessionDir, { recursive: true, force: true });
      } catch (error) {
        console.error("Error cleaning up session directory:", error);
      }

      setTimeout(() => {
        console.log("Reinitializing WhatsApp client...");
        initializeWhatsAppClient();
      }, 5000);
    });

    whatsappClient.initialize().catch((err) => {
      console.error("Failed to initialize WhatsApp client:", err);
      io.emit("error", "Failed to initialize WhatsApp client");
    });
  };

  initializeWhatsAppClient();

  io.on("connection", (socket) => {
    console.log("New client connected");

    if (whatsappClient && whatsappClient.pupPage) {
      whatsappClient.pupPage.screenshot({ type: "png" }).then((qrImage) => {
        socket.emit(
          "qr",
          `data:image/png;base64,${qrImage.toString("base64")}`
        );
      });
    }

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};

const destroyWhatsAppClient = async () => {
  if (whatsappClient) {
    await whatsappClient.destroy();
    whatsappClient = null;
  }
  if (io) {
    io.close();
    io = null;
  }
};

export { whatsappClient, getLocalWhatsapp, destroyWhatsAppClient };
