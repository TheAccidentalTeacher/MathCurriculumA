// Test OpenAI API key availability and basic functionality
console.log('Testing OpenAI API key availability...');

// Check if the key is available in environment variables
const openaiKey = process.env.OPENAI_API_KEY;
console.log('OpenAI API key present:', !!openaiKey);
console.log('Key length:', openaiKey ? openaiKey.length : 0);
console.log('Key prefix:', openaiKey ? openaiKey.substring(0, 7) + '...' : 'none');

// Test a simple API call
async function testOpenAI() {
    if (!openaiKey) {
        console.log('❌ No OpenAI API key found');
        return;
    }

    try {
        const response = await fetch('https://api.openai.com/v1/models', {
            headers: {
                'Authorization': `Bearer ${openaiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ OpenAI API key is valid');
            console.log('Available models count:', data.data?.length || 0);
            
            // Check for vision model availability
            const visionModels = data.data?.filter(model => 
                model.id.includes('gpt-4') && model.id.includes('vision')
            ) || [];
            console.log('Vision models available:', visionModels.length);
            if (visionModels.length > 0) {
                console.log('Vision models:', visionModels.map(m => m.id));
            }
        } else {
            console.log('❌ OpenAI API key is invalid or expired');
            console.log('Response status:', response.status);
            const errorText = await response.text();
            console.log('Error:', errorText);
        }
    } catch (error) {
        console.log('❌ Error testing OpenAI API:', error.message);
    }
}

testOpenAI();
