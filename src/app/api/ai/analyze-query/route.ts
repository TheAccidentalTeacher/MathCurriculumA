import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Disable static generation for this route since it requires runtime environment variables
export const dynamic = 'force-dynamic';

// Lazy initialization to prevent build-time errors
const getOpenAIClient = () => {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📥 [API] Received request body:', JSON.stringify(body, null, 2));
    
    const { prompt, model = 'o1-mini' } = body;
    
    // Initialize OpenAI client only when needed
    const openai = getOpenAIClient();

    if (!prompt) {
      console.error('❌ [API] No prompt provided in request');
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // For o1 models, we need to use a different approach
    let completion;
    
    if (model.startsWith('o1')) {
      completion = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
        // Note: o1 models don't support temperature, max_tokens, or system messages
      });
    } else {
      completion = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert query analyzer for educational AI tutoring systems. Always respond with valid JSON format as requested.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1, // Low temperature for consistent analysis
        max_tokens: 800
      });
    }

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      return NextResponse.json({ error: 'No response generated' }, { status: 500 });
    }

    // Try to parse as JSON, fallback if needed
    try {
      const jsonResponse = JSON.parse(responseContent);
      return NextResponse.json(jsonResponse);
    } catch (parseError) {
      console.warn('Query analysis response was not valid JSON:', responseContent);
      
      // Attempt to extract JSON from the response
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const extractedJson = JSON.parse(jsonMatch[0]);
          return NextResponse.json(extractedJson);
        } catch (extractError) {
          // Still not valid JSON
        }
      }
      
      // Return a default analysis structure
      return NextResponse.json({
        intent: 'explain',
        topics: ['general'],
        recommendedTools: ['ShapeExplorer'],
        complexity: 2,
        reasoning: 'Fallback analysis due to parsing error',
        rawResponse: responseContent
      });
    }

  } catch (error) {
    console.error('Query analysis error:', error);
    
    // Check if it's a model availability error
    if (error instanceof Error && error.message.includes('model')) {
      // Fallback to gpt-4o-mini if o1 is not available
      try {
        const fallbackOpenai = getOpenAIClient();
        const fallbackCompletion = await fallbackOpenai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert query analyzer. Respond with valid JSON format.'
            },
            {
              role: 'user',
              content: (await request.json()).prompt
            }
          ],
          temperature: 0.1,
          max_tokens: 800
        });

        const fallbackContent = fallbackCompletion.choices[0]?.message?.content;
        if (fallbackContent) {
          try {
            const jsonResponse = JSON.parse(fallbackContent);
            return NextResponse.json(jsonResponse);
          } catch (parseError) {
            // Continue to error response below
          }
        }
      } catch (fallbackError) {
        console.error('Fallback analysis also failed:', fallbackError);
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to analyze user query' },
      { status: 500 }
    );
  }
}
