// frontend/src/components/DebugPanel.jsx
import { useState, useEffect } from 'react';
import { WebApp } from '@twa-dev/sdk';
import { API_URL } from '../lib/api';

export default function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [checks, setChecks] = useState({});

  useEffect(() => {
    runChecks();
    // ღილაკი მხოლოდ დეველოპმენტში ან ?debug=true-ზე
    const showDebug = import.meta.env.DEV || new URLSearchParams(window.location.search).get('debug') === 'true';
    if (!showDebug) setIsOpen(false);
  }, []);

  const runChecks = async () => {
    const results = {};

    // 1. Telegram SDK
    try {
      results.telegram = {
        status: WebApp ? '✅ Connected' : '❌ Not Found',
        initData: WebApp?.initData ? '✅ Present' : '❌ Missing',
        colorScheme: WebApp?.colorScheme || 'N/A',
      };
    } catch (e) { results.telegram = { status: '❌ Error', error: e.message }; }

    // 2. Tailwind CSS (შემოწმება: აქვს თუ არა ელემენტს სწორი სტილი)
    try {
      const test = document.createElement('div');
      test.className = 'bg-[#06041A]';
      document.body.appendChild(test);
      const style = window.getComputedStyle(test);
      const tailwindOk = style.backgroundColor === 'rgb(6, 4, 26)' || style.backgroundColor.includes('06041a');
      document.body.removeChild(test);
      results.tailwind = { status: tailwindOk ? '✅ Working' : '❌ Not Loading' };
    } catch (e) { results.tailwind = { status: '❌ Error', error: e.message }; }

    // 3. API კავშირი
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${API_URL}/health`, { signal: controller.signal });
      clearTimeout(timeout);
      results.api = { 
        status: res.ok ? '✅ Connected' : `❌ ${res.status}`, 
        url: API_URL 
      };
    } catch (e) { 
      results.api = { status: '❌ Unreachable', error: e.message, url: API_URL }; 
    }

    // 4. გარემო
    results.env = {
      mode: import.meta.env.MODE,
      dev: import.meta.env.DEV,
      prod: import.meta.env.PROD,
    };

    setChecks(results);
  };

  if (!isOpen && !(import.meta.env.DEV || new URLSearchParams(window.location.search).get('debug') === 'true')) {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 z-[10000] w-10 h-10 rounded-full bg-[#181440] border border-[#A78BFA]/30 text-[#A78BFA] text-xl shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        title="Toggle Debug Panel"
      >
        🐞
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 z-[10000] w-72 max-h-96 overflow-auto bg-[#0C0928] border border-[#A78BFA]/30 rounded-xl shadow-2xl text-xs font-mono">
          <div className="p-3 border-b border-[#A78BFA]/20 flex justify-between items-center">
            <span className="font-bold text-[#E8E0FF]">🔧 Debug Panel</span>
            <button onClick={runChecks} className="text-[#A78BFA] hover:text-[#C4B5FD]">🔄</button>
          </div>
          
          <div className="p-3 space-y-3">
            {/* Telegram */}
            <div>
              <div className="text-[#A78BFA]/60 mb-1">Telegram SDK</div>
              {checks.telegram ? (
                <div className="space-y-0.5">
                  <div className={checks.telegram.status.includes('✅') ? 'text-[#5EEAD4]' : 'text-[#FB7185]'}>
                    {checks.telegram.status}
                  </div>
                  {checks.telegram.initData && <div className="text-[#E8E0FF]/70">InitData: {checks.telegram.initData}</div>}
                  {checks.telegram.colorScheme && <div className="text-[#E8E0FF]/70">Theme: {checks.telegram.colorScheme}</div>}
                </div>
              ) : <div className="text-[#FB7185]">Loading...</div>}
            </div>

            {/* Tailwind */}
            <div>
              <div className="text-[#A78BFA]/60 mb-1">Tailwind CSS</div>
              {checks.tailwind ? (
                <div className={checks.tailwind.status.includes('✅') ? 'text-[#5EEAD4]' : 'text-[#FB7185]'}>
                  {checks.tailwind.status}
                </div>
              ) : <div className="text-[#FB7185]">Loading...</div>}
            </div>

            {/* API */}
            <div>
              <div className="text-[#A78BFA]/60 mb-1">Backend API</div>
              {checks.api ? (
                <div className="space-y-0.5">
                  <div className={checks.api.status.includes('✅') ? 'text-[#5EEAD4]' : 'text-[#FB7185]'}>
                    {checks.api.status}
                  </div>
                  <div className="text-[#E8E0FF]/50 truncate">{checks.api.url}</div>
                  {checks.api.error && <div className="text-[#FB7185]/80">{checks.api.error}</div>}
                </div>
              ) : <div className="text-[#FB7185]">Loading...</div>}
            </div>

            {/* Environment */}
            <div>
              <div className="text-[#A78BFA]/60 mb-1">Environment</div>
              {checks.env ? (
                <div className="text-[#E8E0FF]/70">
                  Mode: {checks.env.mode}<br/>
                  Dev: {checks.env.dev ? '✅' : '❌'}
                </div>
              ) : <div className="text-[#FB7185]">Loading...</div>}
            </div>
          </div>

          {/* Close Button */}
          <div className="p-2 border-t border-[#A78BFA]/20 text-center">
            <button 
              onClick={() => setIsOpen(false)}
              className="text-[#A78BFA]/60 hover:text-[#E8E0FF] text-[10px]"
            >
              Close Panel
            </button>
          </div>
        </div>
      )}
    </>
  );
}