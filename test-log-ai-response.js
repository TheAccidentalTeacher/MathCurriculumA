// Test script to check AI response for logarithmic function
const testLogFunction = async () => {
    try {
        console.log('🧪 Testing logarithmic function AI response...');
        
        const response = await fetch('http://localhost:3000/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Can you plot y = log(x) and explain its properties?',
                character: 'somers',
                lesson: JSON.stringify({
                    lessonId: 'test-log',
                    lessonTitle: 'Logarithmic Functions',
                    gradeLevel: 9,
                    unit: 'Advanced Functions',
                    volume: 1
                })
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        console.log('✅ AI Response received:');
        console.log('Content:', data.content);
        console.log('Character:', data.character);
        console.log('Tokens used:', data.tokens);
        
        // Check if response contains [GRAPH:] pattern
        const hasGraphPattern = /\[GRAPH:[^\]]+\]/.test(data.content);
        const graphMatches = data.content.match(/\[GRAPH:[^\]]+\]/g);
        
        console.log('\n🔍 Pattern Analysis:');
        console.log('Contains [GRAPH:] pattern:', hasGraphPattern);
        console.log('Graph patterns found:', graphMatches);
        
        if (hasGraphPattern) {
            console.log('✅ SUCCESS: AI generated graph pattern for logarithmic function!');
            console.log('Graph syntax:', graphMatches[0]);
        } else {
            console.log('❌ PROBLEM: AI did not generate [GRAPH:] pattern');
            console.log('This means the AI prompts need further enhancement');
        }
        
        // Check for logarithmic content
        const hasLogContent = /log\(|logarithm|logarithmic/i.test(data.content);
        console.log('Contains logarithmic content:', hasLogContent);
        
        console.log('\n📝 Full AI Response:');
        console.log(data.content);
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
};

// Run the test
testLogFunction();
