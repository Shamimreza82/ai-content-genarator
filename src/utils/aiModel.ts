'use server'

import { GoogleGenerativeAI } from '@google/generative-ai';
import { systemPrompt } from './constant/blogPrompth';



const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const aiModel = async (userPrompt: string) => {
  try {
    const prompt = `
SYSTEM:
${systemPrompt}

USER:
${userPrompt}
  `.trim()

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }); // or 'gemini-1.5-flash' if enabled
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text)
    return text
  } catch (error) {
    console.log(error)
  }
}