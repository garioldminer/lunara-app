// frontend/src/lib/api.js

// ბექენდის მისამართი — ავტომატურად იცვლება გარემოს მიხედვით
const getApiBase = () => {
  // პროდაქშენ გარემოში (Vercel-ზე) ვიყენებთ Render-ის ლინკს
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // თუ ვართ Vercel-ზე ან სხვა პროდაქშენ დომენზე
    if (hostname.includes('vercel.app') || hostname.includes('netlify.app') || process.env.NODE_ENV === 'production') {
      return 'https://ლუკა-სერვისი-ონრენდერ.com'; // ← შენი Render-ის ლინკი აქ ჩასვი!
    }
  }
  
  // ლოკალური დეველოპმენტისთვის
  return 'http://localhost:4000';
};

const API_BASE = `${getApiBase()}/api`;

export async function fetchDailyCard() {
  try {
    console.log('🔍 Fetching from:', `${API_BASE}/daily-card`);
    
    const response = await fetch(`${API_BASE}/daily-card`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // CORS-ისთვის აუცილებელია (თუ Render-ზე cors() დაყენებულია)
      credentials: 'same-origin'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch card: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('❌ API Error:', error);
    
    // Fallback მონაცემები, თუ API ვერ მუშაობს (UX-ისთვის)
    return {
      name: "The Star",
      symbol: "⭐",
      number: "XVII",
      description: "The Star arrives tonight like a breath after a long storm."
    };
  }
}

export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
  } catch (error) {
    console.error('❌ Health check failed:', error);
    return { status: 'offline', error: error.message };
  }
}

// დამატებითი ფუნქცია: ბექენდის სტატუსის შესამოწმებლად
export async function getBackendStatus() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return {
      online: response.ok,
      data: await response.json()
    };
  } catch {
    return { online: false, data: null };
  }
}