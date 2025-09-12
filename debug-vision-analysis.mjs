// Comprehensive vision analysis debug test
import { promises as fs } from 'fs';
import path from 'path';

console.log('🔍 Debugging vision analysis for RCM08_NA_SW_V1 - Lesson 2');

// Test image path resolution
async function testImagePaths() {
    console.log('\n📁 Testing image path resolution...');
    
    const documentId = 'RCM08_NA_SW_V1';
    const pageNumber = 1;
    
    // Try different path patterns
    const paths = [
        `webapp_pages/${documentId}/pages/page_${pageNumber.toString().padStart(3, '0')}.png`,
        `webapp_pages/${documentId}/page_${pageNumber.toString().padStart(3, '0')}.png`,
        `webapp_pages/${documentId}/pages/page_${pageNumber}.png`,
        `webapp_pages/${documentId}/page_${pageNumber}.png`,
        `public/webapp_pages/${documentId}/pages/page_${pageNumber.toString().padStart(3, '0')}.png`
    ];
    
    for (const testPath of paths) {
        try {
            const fullPath = path.resolve(testPath);
            await fs.access(fullPath);
            console.log(`✅ Found: ${testPath}`);
            
            // Check file size
            const stats = await fs.stat(fullPath);
            console.log(`   Size: ${(stats.size / 1024).toFixed(1)} KB`);
            
            return fullPath;
        } catch (error) {
            console.log(`❌ Not found: ${testPath}`);
        }
    }
    
    return null;
}

// Test OpenAI API key
async function testOpenAIKey() {
    console.log('\n🔑 Testing OpenAI API key...');
    
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
        console.log('❌ OPENAI_API_KEY not found in environment');
        return false;
    }
    
    console.log(`✅ Key found: ${key.substring(0, 7)}...${key.substring(key.length - 4)}`);
    
    try {
        const response = await fetch('https://api.openai.com/v1/models', {
            headers: {
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            console.log('✅ API key is valid');
            return true;
        } else {
            console.log('❌ API key validation failed:', response.status);
            return false;
        }
    } catch (error) {
        console.log('❌ API key test error:', error.message);
        return false;
    }
}

// Test vision analysis simulation
async function testVisionAnalysis() {
    console.log('\n👁️ Testing vision analysis simulation...');
    
    const imagePath = await testImagePaths();
    if (!imagePath) {
        console.log('❌ Cannot test vision analysis - no images found');
        return;
    }
    
    const keyValid = await testOpenAIKey();
    if (!keyValid) {
        console.log('❌ Cannot test vision analysis - invalid API key');
        return;
    }
    
    try {
        // Read the image
        const imageBuffer = await fs.readFile(imagePath);
        const base64Image = imageBuffer.toString('base64');
        
        console.log('✅ Image loaded successfully');
        console.log(`   Base64 length: ${base64Image.length}`);
        
        // Simulate OpenAI vision API call
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: 'What mathematical concepts do you see in this image? Respond with a simple list.'
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/png;base64,${base64Image}`
                            }
                        }
                    ]
                }],
                max_tokens: 300
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Vision API call successful');
            console.log('Response:', data.choices[0]?.message?.content || 'No content');
        } else {
            const errorText = await response.text();
            console.log('❌ Vision API call failed:', response.status);
            console.log('Error:', errorText);
        }
        
    } catch (error) {
        console.log('❌ Vision analysis error:', error.message);
    }
}

// Run all tests
async function runAllTests() {
    await testImagePaths();
    await testOpenAIKey();
    await testVisionAnalysis();
}

runAllTests().catch(console.error);
