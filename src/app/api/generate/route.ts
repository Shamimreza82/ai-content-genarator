import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { prompt, tone } = await req.json();

    const finalPrompt = `Write a ${tone} blog, caption, or ad copy: ${prompt}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }); // or 'gemini-1.5-flash' if enabled
    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text || 'No response from Gemini.' });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json({ error: 'Failed to generate content.' }, { status: 500 });
  }
}
