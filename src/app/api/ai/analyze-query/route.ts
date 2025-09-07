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
    
    // Handle both formats: direct prompt or query analysis request
    let prompt;
    let model = 'o1-mini';
    
    if (body.prompt) {
      // Direct prompt format
      prompt = body.prompt;
      model = body.model || 'o1-mini';
    } else if (body.query && body.lessonAnalysis) {
      // Query analysis format  
      const { query, lessonAnalysis } = body;
      prompt = `Analyze this student query in the context of the lesson:

Query: "${query}"
Lesson Analysis: ${JSON.stringify(lessonAnalysis, null, 2)}

Please return a JSON response with the following structure:
{
  "text": "${query}",
  "intent": "explain|practice|clarify|visualize|calculate",
  "topics": ["topic1", "topic2"],
  "toolNeeds": ["tool1", "tool2"],
  "complexity": 1-5
}`;
    } else {
      console.error('❌ [API] Invalid request format - need either prompt or query+lessonAnalysis');
      return NextResponse.json({ error: 'Either prompt or query+lessonAnalysis is required' }, { status: 400 });
    }
    
    // Initialize OpenAI client only when needed
    const openai = getOpenAIClient();

    if (!prompt) {
      console.error('❌ [API] No valid prompt could be constructed');
      return NextResponse.json({ error: 'Unable to construct prompt from request' }, { status: 400 });
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
      
      // Ensure we have the expected structure for query analysis
      if (jsonResponse.intent || jsonResponse.topics) {
        console.log('✅ [API] Parsed JSON response:', jsonResponse);
        return NextResponse.json(jsonResponse);
      }
      
      // If it's not in the expected format, create a wrapper
      console.log('⚠️ [API] Response not in expected format, wrapping:', jsonResponse);
      return NextResponse.json({
        text: jsonResponse.query || 'Unknown query',
        intent: jsonResponse.intent || 'explain',
        topics: jsonResponse.topics || ['general'],
        toolNeeds: jsonResponse.toolNeeds || jsonResponse.recommendedTools || ['ShapeExplorer'],
        complexity: jsonResponse.complexity || 2
      });
      
    } catch (parseError) {
      console.warn('⚠️ [API] Query analysis response was not valid JSON:', responseContent);
      
      // Attempt to extract JSON from the response
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const extractedJson = JSON.parse(jsonMatch[0]);
          console.log('✅ [API] Extracted JSON from response:', extractedJson);
          return NextResponse.json({
            text: extractedJson.query || 'Unknown query',
            intent: extractedJson.intent || 'explain',
            topics: extractedJson.topics || ['general'],
            toolNeeds: extractedJson.toolNeeds || extractedJson.recommendedTools || ['ShapeExplorer'],
            complexity: extractedJson.complexity || 2
          });
        } catch (extractError) {
          console.error('❌ [API] Failed to extract JSON:', extractError);
        }
      }
      
      // Return a default analysis structure
      console.log('🔄 [API] Using fallback analysis structure');
      return NextResponse.json({
        text: 'Fallback query',
        intent: 'explain' as const,
        topics: ['general'],
        toolNeeds: ['ShapeExplorer'],
        complexity: 2
      });
    }

  } catch (error) {
    console.error('Query analysis error:', error);
    
    // Check if it's a model availability error
    if (error instanceof Error && error.message.includes('model')) {
      // Fallback to gpt-5 if o1 is not available
      try {
        const fallbackOpenai = getOpenAIClient();
        const fallbackCompletion = await fallbackOpenai.chat.completions.create({
          model: 'gpt-5',
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
