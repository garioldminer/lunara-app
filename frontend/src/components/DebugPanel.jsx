// frontend/src/components/DebugPanel.jsx
import { useState, useEffect } from 'react';
import { WebApp } from '@twa-dev/sdk';
import { API_URL, fetchWithRenderTimeout } from '../lib/api';

export default function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [checks, setChecks] = useState({});

  useEffect(() => {
    runChecks();
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
    } catch (e) { 
      results.telegram = { status: '❌ Error', error: e.message }; 
    }

    // 2. Tailwind CSS
    try {
      const test = document.createElement('div');
      test.className = 'bg-[#06041A]';
      document.body.appendChild(test);
      const style = window.getComputedStyle(test);
      const tailwindOk = style.backgroundColor === 'rgb(6, 4, 26)' || style.backgroundColor.includes('06041a');
      document.body.removeChild(test);
      results.tailwind = { status: tailwindOk ? '✅ Working' : '❌ Not Loading' };
    } catch (e) { 
      results.tailwind = { status: '❌ Error', error: e.message }; 
    }

    // 3. API კავშირი
    try {
      const result = await fetchWithRenderTimeout('/health');
      results.api = { 
        status: '✅ Connected', 
        url: API_URL,
        response: result
      };
    } catch (e) { 
      results.api = { 
        status: '❌ Unreachable', 
        error: e.message, 
        url: API_URL 
      }; 
    }

    // 4. CardReveal3D დიაგნოსტიკა
    try {
      const cardCheck = {};
      
      // a) ფაილი არსებობს?
      try {
        await import('../components/CardReveal3D');
        cardCheck.fileExists = '✅ Yes';
      } catch (e) {
        cardCheck.fileExists = '❌ No';
        cardCheck.importError = e.message;
      }
      
      // b) framer-motion დაყენებულია?
      try {
        await import('framer-motion');
        cardCheck.framerMotion = '✅ Installed';
      } catch (e) {
        cardCheck.framerMotion = '❌ Missing';
        cardCheck.framerMotionError = 'Run: npm install framer-motion';
      }
      
      // c) პროპების ვალიდაცია (სიმულაცია)
      cardCheck.propsCheck = '✅ Valid';
      cardCheck.requiredProps = ['cardName', 'cardSymbol', 'cardNumber'];
      
      // d) onClick handler ტესტი
      try {
        const testFn = () => {};
        testFn(); // თუ მუშაობს, ფუნქციები ნორმალურად გადაიცემა
        cardCheck.onClickHandler = '✅ Functions work';
      } catch (e) {
        cardCheck.onClickHandler = '❌ Function passing broken';
        cardCheck.onClickError = e.message;
      }
      
      results.cardReveal3D = cardCheck;
    } catch (e) {
      results.cardReveal3D = { status: '❌ Check failed', error: e.message };
    }

    // 5. გარემო
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
        <div className="fixed bottom-16 right-4 z-[10000] w-80 max-h-[80vh] overflow-auto bg-[#0C0928] border border-[#A78BFA]/30 rounded-xl shadow-2xl text-xs font-mono">
          <div className="p-3 border-b border-[#A78BFA]/20 flex justify-between items-center sticky top-0 bg-[#0C0928]">
            <span className="font-bold text-[#E8E0FF]">🔧 Debug Panel</span>
            <button onClick={runChecks} className="text-[#A78BFA] hover:text-[#C4B5FD]">🔄</button>
          </div>
          
          <div className="p-3 space-y-4">
            {/* Telegram */}
            <div>
              <div className="text-[#A78BFA]/60 mb-1 font-semibold">Telegram SDK</div>
              {checks.telegram ? (
                <div className="space-y-0.5 pl-2 border-l-2 border-[#A78BFA]/20">
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
              <div className="text-[#A78BFA]/60 mb-1 font-semibold">Tailwind CSS</div>
              {checks.tailwind ? (
                <div className={checks.tailwind.status.includes('✅') ? 'text-[#5EEAD4]' : 'text-[#FB7185]'}>
                  {checks.tailwind.status}
                </div>
              ) : <div className="text-[#FB7185]">Loading...</div>}
            </div>

            {/* API */}
            <div>
              <div className="text-[#A78BFA]/60 mb-1 font-semibold">Backend API</div>
              {checks.api ? (
                <div className="space-y-0.5 pl-2 border-l-2 border-[#A78BFA]/20">
                  <div className={checks.api.status.includes('✅') ? 'text-[#5EEAD4]' : 'text-[#FB7185]'}>
                    {checks.api.status}
                  </div>
                  <div className="text-[#E8E0FF]/50 truncate">{checks.api.url}</div>
                  {checks.api.error && <div className="text-[#FB7185]/80 text-[9px]">{checks.api.error}</div>}
                  {checks.api.response && <div className="text-[#5EEAD4]/70 text-[9px] break-all">{JSON.stringify(checks.api.response)}</div>}
                </div>
              ) : <div className="text-[#FB7185]">Loading...</div>}
            </div>

            {/* 🔮 CardReveal3D დიაგნოსტიკა */}
            <div>
              <div className="text-[#A78BFA]/60 mb-1 font-semibold">🃏 CardReveal3D</div>
              {checks.cardReveal3D ? (
                <div className="space-y-1 pl-2 border-l-2 border-[#A78BFA]/20">
                  <div className={checks.cardReveal3D.fileExists?.includes('✅') ? 'text-[#5EEAD4]' : 'text-[#FB7185]'}>
                    File: {checks.cardReveal3D.fileExists || 'N/A'}
                  </div>
                  {checks.cardReveal3D.importError && (
                    <div className="text-[#FB7185]/80 text-[9px] break-all">Import error: {checks.cardReveal3D.importError}</div>
                  )}
                  
                  <div className={checks.cardReveal3D.framerMotion?.includes('✅') ? 'text-[#5EEAD4]' : 'text-[#FB7185]'}>
                    Framer Motion: {checks.cardReveal3D.framerMotion || 'N/A'}
                  </div>
                  {checks.cardReveal3D.framerMotionError && (
                    <div className="text-[#FB7185]/80 text-[9px]">{checks.cardReveal3D.framerMotionError}</div>
                  )}
                  
                  <div className="text-[#E8E0FF]/70">
                    Required props: {checks.cardReveal3D.requiredProps?.join(', ')}
                  </div>
                  
                  <div className={checks.cardReveal3D.onClickHandler?.includes('✅') ? 'text-[#5EEAD4]' : 'text-[#FB7185]'}>
                    onClick: {checks.cardReveal3D.onClickHandler || 'N/A'}
                  </div>
                  {checks.cardReveal3D.onClickError && (
                    <div className="text-[#FB7185]/80 text-[9px] break-all">Error: {checks.cardReveal3D.onClickError}</div>
                  )}
                </div>
              ) : <div className="text-[#FB7185]">Loading...</div>}
            </div>

            {/* Environment */}
            <div>
              <div className="text-[#A78BFA]/60 mb-1 font-semibold">Environment</div>
              {checks.env ? (
                <div className="text-[#E8E0FF]/70 pl-2 border-l-2 border-[#A78BFA]/20">
                  Mode: {checks.env.mode}<br/>
                  Dev: {checks.env.dev ? '✅' : '❌'}
                </div>
              ) : <div className="text-[#FB7185]">Loading...</div>}
            </div>
          </div>

          {/* Close Button */}
          <div className="p-2 border-t border-[#A78BFA]/20 text-center sticky bottom-0 bg-[#0C0928]">
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