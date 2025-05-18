/* eslint-disable @typescript-eslint/no-explicit-any */
import OpenAI from "openai";
import { systemPrompt } from "./constant/blogPrompth";
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const openAiModel = async (userPrompt: string) => {
try {
        const prompt = `
SYSTEM:
${systemPrompt}

USER:
${userPrompt}
  `.trim()


  async function listModels() {
  const res = await client.models.list()
  res.data.forEach(m => console.log(m.id))
}

console.log(listModels())
    const response = await client.responses.create({
        model: "gpt-4.1-mini",
        input: prompt
    });

    console.log(response.output_text);
    return response.output_text
} catch (err) {
    if (
      typeof err === "object" &&
      err !== null &&
      ("code" in err || "status" in err) &&
      ((err as any).code === 'insufficient_quota' || (err as any).status === 429)
    ) {
      console.error("Quota exceeded – please check your billing plan.")
      // fallback behavior:
      // – Notify the user
      // – Use a simpler local model
      // – Queue the request to retry after some time
      return "⚠️ Sorry, I’m temporarily out of quota. Please try again later."
    }
    // re-throw unexpected errors
    throw err
}
}