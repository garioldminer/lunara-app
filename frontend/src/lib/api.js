// frontend/src/lib/api.js

// ბექენდის მისამართი
// StackBlitz-ში ბექენდი მუშაობს პორტ 4000-ზე, ფრონტენდი კი 3000-ზე
const API_BASE = 'http://localhost:4000/api';

export async function fetchDailyCard() {
  try {
    const response = await fetch(`${API_BASE}/daily-card`);
    if (!response.ok) throw new Error('Failed to fetch card');
    return await response.json();
  } catch (error) {
    console.error('❌ API Error:', error);
    // Fallback მონაცემები, თუ API ვერ მუშაობს
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
    const response = await fetch(`${API_BASE}/health`);
    return await response.json();
  } catch {
    return { status: 'offline' };
  }
}