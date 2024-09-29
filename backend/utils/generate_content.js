import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateContent(
  title_or_topic,
  keywords,
  tone,
  style,
  word_count,
  target_audience
) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `Create a unique, SEO-optimized article in Markdown format based on these inputs:
          
          ${title_or_topic}
          ${keywords}
          ${tone}
          ${style}
          ${word_count}
          ${target_audience}
          
          Guidelines:
          1. Structure: Use proper Markdown syntax for headings, lists, and emphasis.
          2. Title: Craft compelling, keyword-rich main heading (H1).
          3. Intro: Hook readers, set context, outline purpose.
          4. Body: 
             - Organize logically with clear section headings
             - Use keywords naturally (optimal density)
             - Maintain consistent tone/style
             - Include data, examples, case studies
             - Vary content (paragraphs, lists, blockquotes)
          5. Conclusion: Summarize key points, add call-to-action if relevant.
          6. Length: Target word count ±10%.
          
          Enhance uniqueness:
          - Generate fresh metaphors or analogies
          - Offer unconventional perspectives
          - Create original examples or scenarios
          - Develop unique frameworks or models
          - Coin new terms or phrases
          - Propose innovative solutions
          - Draw unexpected connections
          
          SEO best practices:
          - Use keywords in headings, meta description, content
          - Optimize heading structure (H1, H2, H3, etc.)
          - Include suggestions for internal/external links
          - Suggest alt text for images
          - Create a meta description
          
          Ensure:
          - Originality and value
          - Smooth transitions
          - Grammatical accuracy
          - Clear, readable Markdown formatting
          
          Output Format:
          markdown
          # [Title]
          
          [Meta description suggestion]
          
          ## Introduction
          
          [Engaging opening paragraph]
          
          ## [Main Section 1]
          
          [Content with proper Markdown formatting]
          
          ### [Subsection]
          
          [More detailed content]
          
          ## [Main Section 2]
          
          [Content with lists, emphasis, etc.]
          
          ## Conclusion
          
          [Summary and closing thoughts]
          
        
          
          [Image suggestions with alt text]
          [Internal/external link suggestions]
          
          
          Generate a distinctive article in Markdown using these guidelines and inputs.`,
      },
      {
        role: "user",
        content: `Generate a distinctive article using title_or_topic: ${title_or_topic}, keywords: ${keywords}, tone: ${tone}, style: ${style}, word_count: ${word_count}, target_audience: ${target_audience}.`,
      },
    ],
    max_tokens: 10000,
  });
  return response.choices[0].message.content;
}
