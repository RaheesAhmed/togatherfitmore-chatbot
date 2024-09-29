import fs from "fs/promises";
import { OpenAI } from "openai";

const openai = new OpenAI();

export async function prepareTrainingFile(inputPath, outputPath) {
  try {
    // Read the input file
    const content = await fs.readFile(inputPath, "utf8");
    console.log(`Read ${content.length} characters from ${inputPath}`);

    // Split content into manageable chunks
    const chunks = content.match(/[^.!?]+([.!?]|\.\.\.|$)/g) || [content];
    console.log(`Split content into ${chunks.length} chunks`);

    // Process each chunk
    const trainingData = await Promise.all(
      chunks.map(async (chunk, index) => {
        console.log(
          `Processing chunk ${index + 1}/${chunks.length}: "${chunk.slice(
            0,
            50
          )}..."`
        );
        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "Convert the following text into a conversation format suitable for fine-tuning. Respond with a JSON object containing a 'messages' array with 'role' and 'content' for each message.",
              },
              { role: "user", content: chunk.trim() },
            ],
          });

          const responseContent = completion.choices[0].message.content;
          console.log(`Chunk ${index + 1} response:`, responseContent);

          // Attempt to parse the JSON response
          const parsedResponse = JSON.parse(responseContent);

          // Validate the structure of the parsed response
          if (
            !Array.isArray(parsedResponse.messages) ||
            parsedResponse.messages.length === 0
          ) {
            throw new Error("Invalid response structure");
          }

          console.log(
            `Chunk ${index + 1} parsed response:`,
            JSON.stringify(parsedResponse)
          );
          return parsedResponse;
        } catch (error) {
          console.error(`Error processing chunk ${index + 1}:`, error);
          // Return null for invalid entries
          return null;
        }
      })
    );

    // Filter out any invalid entries and save as JSONL
    const jsonlData = trainingData
      .filter(
        (entry) =>
          entry && Array.isArray(entry.messages) && entry.messages.length > 0
      )
      .map((entry) => JSON.stringify(entry))
      .join("\n");

    console.log(
      `Prepared ${jsonlData.split("\n").length} valid entries, ${
        jsonlData.length
      } characters to write`
    );

    if (jsonlData.length === 0) {
      console.error("No valid data to write to file");
      return null;
    }

    await fs.writeFile(outputPath, jsonlData);
    console.log(`Training file prepared and saved to ${outputPath}`);

    // Verify file contents
    const writtenContent = await fs.readFile(outputPath, "utf8");
    console.log(
      `Verified ${writtenContent.length} characters written to ${outputPath}`
    );

    return outputPath;
  } catch (error) {
    console.error("Error preparing training file:", error);
    throw error;
  }
}
