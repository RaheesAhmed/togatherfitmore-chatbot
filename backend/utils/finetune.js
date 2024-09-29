import { OpenAI } from "openai";
import fs from "fs/promises";

const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Function to create a fine-tuning job
export async function createFineTuningJob(
  trainingFilePath,
  model = "gpt-4o-mini-2024-07-18",
  hyperparameters = {}
) {
  try {
    // Upload the training file
    const file = await openai.files.create({
      file: await fs.readFile(trainingFilePath),
      purpose: "fine-tune",
    });

    // Create the fine-tuning job
    const fineTuningJob = await openai.fineTuning.jobs.create({
      training_file: file.id,
      model: model,
      hyperparameters: hyperparameters,
    });

    console.log("Fine-tuning job created:", fineTuningJob);
    return fineTuningJob;
  } catch (error) {
    console.error("Error creating fine-tuning job:", error);
    throw error;
  }
}

// Function to list fine-tuning jobs
export async function listFineTuningJobs(limit = 10) {
  try {
    const jobs = await openai.fineTuning.jobs.list({ limit: limit });
    console.log("Fine-tuning jobs:", jobs);
    return jobs;
  } catch (error) {
    console.error("Error listing fine-tuning jobs:", error);
    throw error;
  }
}

// Function to retrieve the status of a fine-tuning job
export async function getFineTuningJobStatus(jobId) {
  try {
    const job = await openai.fineTuning.jobs.retrieve(jobId);
    console.log("Fine-tuning job status:", job.status);
    return job;
  } catch (error) {
    console.error("Error retrieving fine-tuning job status:", error);
    throw error;
  }
}

// Function to cancel a fine-tuning job
export async function cancelFineTuningJob(jobId) {
  try {
    const cancelledJob = await openai.fineTuning.jobs.cancel(jobId);
    console.log("Fine-tuning job cancelled:", cancelledJob);
    return cancelledJob;
  } catch (error) {
    console.error("Error cancelling fine-tuning job:", error);
    throw error;
  }
}

// Function to list events for a fine-tuning job
export async function listFineTuningEvents(jobId, limit = 10) {
  try {
    const events = await openai.fineTuning.jobs.listEvents(jobId, {
      limit: limit,
    });
    console.log("Fine-tuning job events:", events);
    return events;
  } catch (error) {
    console.error("Error listing fine-tuning job events:", error);
    throw error;
  }
}

// Function to use a fine-tuned model
export async function useFineTunedModel(modelId, messages) {
  try {
    const completion = await openai.chat.completions.create({
      model: modelId,
      messages: messages,
    });
    console.log("Fine-tuned model response:", completion.choices[0].message);
    return completion.choices[0].message;
  } catch (error) {
    console.error("Error using fine-tuned model:", error);
    throw error;
  }
}


