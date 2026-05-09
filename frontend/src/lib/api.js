// frontend/src/lib/api.js
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ფუნქცია რომელიც ელოდება Render-ის "გაღვიძებას"
export const fetchWithRenderTimeout = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  // Render-ის cold start-ისთვის: 45 წამი პირველ მცდელობაზე
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Backend is waking up (Render cold start) - please wait ~30s and try again');
    }
    
    throw error;
  }
};