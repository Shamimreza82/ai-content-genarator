
import { aiModel } from '@/utils/aiModel';

import { NextRequest, NextResponse } from 'next/server';




export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();


    const promptText = `Write a blog for me : ${prompt}`;

    const result = await aiModel(promptText)

    // const result = await openAiModel(prompt)

    const cleanResult = result? JSON.parse(result.replace(/```json\s*([\s\S]*?)\s*```/, '$1')): null;


    console.log(cleanResult)



    return NextResponse.json({
      success: true,
      message: "generate blog successfully",
      status: 200,
      result: cleanResult || 'No response from Gemini.'
    });


  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json({ error: 'Failed to generate content.' }, { status: 500 });
  }
}


/////gpt-image-1