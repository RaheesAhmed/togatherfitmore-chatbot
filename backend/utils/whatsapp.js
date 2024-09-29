import axios from "axios";
import config from "../config/index.js";
import { supabaseClient } from "../lib/supabaseClient.js";
import { queryRAGSystem } from "../utils/langchain_rag.js";
const FACEBOOK_API_URL = "https://graph.facebook.com/v17.0";
const WHATSAPP_PHONE_NUMBER_ID = config.whatsappPhoneNumberId;
const WHATSAPP_ACCESS_TOKEN = config.whatsappAccessToken;

let isWhatsAppBotActive = false;
let isUserInvolved = false;

const sendWhatsAppMessage = async (to, message) => {
  if (!isWhatsAppBotActive) {
    console.log("WhatsApp bot is not active. Message not sent.");
    return;
  }

  try {
    const response = await axios.post(
      `${FACEBOOK_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    throw error;
  }
};

const toggleWhatsAppBot = async (enable) => {
  isWhatsAppBotActive = enable;
  console.log(`WhatsApp bot is now ${enable ? "active" : "inactive"}`);

  try {
    const { data, error } = await supabaseClient
      .from("whatsapp_status")
      .upsert({ id: 1, status: enable })
      .select();

    if (error) throw error;

    console.log("WhatsApp status updated in Supabase:", data);
  } catch (error) {
    console.error("Error updating WhatsApp status in Supabase:", error);
  }

  return isWhatsAppBotActive;
};

const setUserInvolvement = (involved) => {
  isUserInvolved = involved;
  console.log(`User involvement set to: ${involved}`);
};

const handleIncomingWhatsAppMessage = async (from, message) => {
  if (!isWhatsAppBotActive) {
    console.log("WhatsApp bot is not active. Ignoring incoming message.");
    return;
  }

  if (isUserInvolved) {
    console.log("User is involved in the conversation. Bot will not respond.");
    return;
  }

  try {
    // Check if the last message was from the bot
    const { data: lastMessage, error } = await supabaseClient
      .from("whatsapp_messages")
      .select("sender")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      throw error;
    }

    if (lastMessage.length > 0 && lastMessage[0].sender === "bot") {
      console.log("Waiting for user to respond. Bot will not send a message.");
      return;
    }

    const response = await queryRAGSystem(message);
    await sendWhatsAppMessage(from, response);

    // Save the bot's message to the database
    await supabaseClient
      .from("whatsapp_messages")
      .insert({ sender: "bot", message: response, recipient: from });
  } catch (error) {
    console.error("Error handling incoming WhatsApp message:", error);
  }
};

const saveUserMessage = async (from, message) => {
  try {
    await supabaseClient
      .from("whatsapp_messages")
      .insert({ sender: "user", message: message, recipient: "bot" });
  } catch (error) {
    console.error("Error saving user message:", error);
  }
};

const getWhatsAppBotStatus = async () => {
  try {
    const { data, error } = await supabaseClient
      .from("whatsapp_status")
      .select("status")
      .eq("id", 1)
      .single();

    if (error) throw error;

    isWhatsAppBotActive = data.status;
    return isWhatsAppBotActive;
  } catch (error) {
    console.error("Error fetching WhatsApp status from Supabase:", error);
    return false;
  }
};

export async function setWhatsAppInstructions(instructions) {
  try {
    // First, check if there's an existing row
    let { data, error } = await supabaseClient
      .from("instructions")
      .select("id")
      .limit(1);

    if (error) throw error;

    if (data && data.length > 0) {
      // If a row exists, update it
      const { data: updatedData, error: updateError } = await supabaseClient
        .from("instructions")
        .update({ whatsapp_prompt: instructions })
        .eq("id", data[0].id)
        .select();

      if (updateError) throw updateError;
      return updatedData;
    } else {
      // If no row exists, insert a new one
      const { data: insertedData, error: insertError } = await supabaseClient
        .from("instructions")
        .insert({ whatsapp_prompt: instructions })
        .select();

      if (insertError) throw insertError;
      return insertedData;
    }
  } catch (error) {
    console.error("Error setting WhatsApp instructions:", error);
    return null;
  }
}

export async function setSystemInstruction(instruction) {
  try {
    const { data, error } = await supabaseClient
      .from("instructions")
      .update({ system_prompt: instruction })
      .eq("id", 2)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error setting system instruction:", error);
    return null;
  }
}

export {
  sendWhatsAppMessage,
  toggleWhatsAppBot,
  setUserInvolvement,
  handleIncomingWhatsAppMessage,
  saveUserMessage,
  isWhatsAppBotActive,
  isUserInvolved,
  getWhatsAppBotStatus, // Add this new export
};
