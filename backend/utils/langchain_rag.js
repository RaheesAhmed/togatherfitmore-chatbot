import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatOpenAI } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { supabaseClient } from "../lib/supabaseClient.js";
import { Document } from "langchain/document";
import { loadQAStuffChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";
import { BufferMemory } from "langchain/memory";
import { LLMChain } from "langchain/chains";
import { readFile } from "fs/promises";

// Function to split documents
export async function splitDocuments(docs) {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  return await textSplitter.splitDocuments(docs);
}

// Function to create and store embeddings in Supabase
export async function createAndStoreEmbeddings(docs) {
  const embeddings = new OpenAIEmbeddings();
  return await SupabaseVectorStore.fromDocuments(docs, embeddings, {
    client: supabaseClient,
    tableName: "documents",
    queryName: "match_documents",
  });
}

// Function to query the vectorstore
export async function queryVectorStore(vectorStore, query) {
  return await vectorStore.similaritySearch(query, 4);
}

// Updated function to generate answer using ChatOpenAI with Prompt Template and Memory
export async function generateAnswer(docs, query, memory, custom_instructions) {
  const model = new ChatOpenAI({ model: "gpt-4o-mini" });

  const template = `${custom_instructions} Use the following pieces of context to answer the question at the end.
  If you don't know the answer, just say that you don't know, don't try to make up an answer.

  Context: {context}

  Previous conversation:
  {chat_history}

  Human: {question}
  AI: `;

  const prompt = PromptTemplate.fromTemplate(template);

  const chain = new LLMChain({
    llm: model,
    prompt: prompt,
    memory: memory,
  });

  const context = docs.map((doc) => doc.pageContent).join("\n\n");

  const result = await chain.call({
    context: context,
    question: query,
  });

  return result.text;
}

// Modified function to process file content and save to Supabase
export async function processFileAndSaveToSupabase(filePath) {
  const content = await readFile(filePath, "utf-8");
  const doc = new Document(
    { pageContent: content },
    { metadata: { source: filePath } }
  );
  const splitDocs = await splitDocuments([doc]);
  return await createAndStoreEmbeddings(splitDocs);
}

// Updated main function to query the RAG system with memory
export async function queryRAGSystem(query, existingMemory = null, chatType) {
  const vectorStore = await SupabaseVectorStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    {
      client: supabaseClient,
      tableName: "documents",
      queryName: "match_documents",
    }
  );

  const relevantDocs = await queryVectorStore(vectorStore, query);

  const memory =
    existingMemory ||
    new BufferMemory({
      memoryKey: "chat_history",
      inputKey: "question",
    });

  const custom_instructions = await getCustomInstructions(chatType);
  console.log(custom_instructions);
  const answer = await generateAnswer(
    relevantDocs,
    query,
    memory,
    custom_instructions
  );

  return { answer, memory };
}

// New function to start a conversation
export async function startConversation() {
  return new BufferMemory({
    memoryKey: "chat_history",
    inputKey: "question",
  });
}

export async function getCustomInstructions(chatType) {
  try {
    const { data, error } = await supabaseClient
      .from("instructions")
      .select("system_prompt, whatsapp_prompt")
      .single();

    if (error) throw error;

    if (!data) {
      console.error("No instructions found in the database");
      return null;
    }

    if (chatType === "whatsapp") {
      console.log("WhatsApp prompt:", data.whatsapp_prompt);
      return data.whatsapp_prompt || "Default WhatsApp instructions";
    } else {
      return data.system_prompt || "Default system instructions";
    }
  } catch (error) {
    console.error("Error in getCustomInstructions:", error);
    return null;
  }
}
