import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, model = 'gpt-4o-mini' } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational content analyzer. Always respond with valid JSON format as requested.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      return NextResponse.json({ error: 'No response generated' }, { status: 500 });
    }

    // Try to parse as JSON, fallback if needed
    try {
      const jsonResponse = JSON.parse(responseContent);
      return NextResponse.json(jsonResponse);
    } catch (parseError) {
      // If not valid JSON, return the raw content
      return NextResponse.json({ 
        content: responseContent,
        warning: 'Response was not valid JSON'
      });
    }

  } catch (error) {
    console.error('Lesson analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze lesson content' },
      { status: 500 }
    );
  }
}
