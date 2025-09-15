// Test YouTube API directly
require('dotenv').config({ path: '.env.local' });

async function testYouTubeAPI() {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const KHAN_ACADEMY_CHANNEL_ID = 'UC4a-Gbdw7vOaccHmFo40b9g';
  
  console.log('🔧 Testing YouTube API...');
  console.log('API Key loaded:', API_KEY ? 'YES' : 'NO');
  
  if (!API_KEY) {
    console.log('❌ No API key found');
    return;
  }
  
  console.log('API Key preview:', API_KEY.substring(0, 10) + '...' + API_KEY.substring(API_KEY.length - 4));
  
  try {
    // Test with a simple search
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.append('key', API_KEY);
    searchUrl.searchParams.append('part', 'snippet');
    searchUrl.searchParams.append('channelId', KHAN_ACADEMY_CHANNEL_ID);
    searchUrl.searchParams.append('q', 'proportional relationships');
    searchUrl.searchParams.append('type', 'video');
    searchUrl.searchParams.append('maxResults', '2');
    searchUrl.searchParams.append('order', 'relevance');
    searchUrl.searchParams.append('safeSearch', 'strict');
    
    console.log('🔍 Testing URL:', searchUrl.toString().replace(API_KEY, 'API_KEY_HIDDEN'));
    
    const response = await fetch(searchUrl.toString());
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response status text:', response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error response body:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ Success! Found', data.items ? data.items.length : 0, 'videos');
    
    if (data.items && data.items.length > 0) {
      console.log('📹 First video:', data.items[0].snippet.title);
    }
    
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

testYouTubeAPI();
