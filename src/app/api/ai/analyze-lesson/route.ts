import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Only create OpenAI client if API key is available (not during build)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

export async function POST(request: NextRequest) {
  try {
    if (!openai) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const { lessonContent, documentId, lessonNumber } = await request.json();

    if (!lessonContent) {
      return NextResponse.json({ error: 'Lesson content is required' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational content analyzer. Always respond with valid JSON format as requested.'
        },
        {
          role: 'user',
          content: `Analyze this lesson content from document ${documentId}, lesson ${lessonNumber}:\n\n${lessonContent}\n\nProvide a detailed educational analysis including key concepts, learning objectives, prerequisites, and assessment suggestions.`
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
