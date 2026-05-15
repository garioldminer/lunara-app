// frontend/src/screens/Reading.jsx
import { useState, useEffect } from 'react';
import { tarotCards } from '../data/tarotCards';

export default function Reading({ onNavigate }) {
  const [currentCard, setCurrentCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // ბარათის შერჩევა
  useEffect(() => {
    const shuffled = [...tarotCards].sort(() => 0.5 - Math.random());
    setCurrentCard(shuffled[0]);
  }, []);

  // ბარათზე დაჭერა -> ფლიპი -> კონტენტის გამოჩენა
  const handleCardClick = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      setTimeout(() => setShowContent(true), 700);
    }
  };

  if (!currentCard) {
    return (
      <div style={{ 
        minHeight: '100vh', background: '#060412', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA' 
      }}>
        <div style={{ animation: 'pulse 2s infinite', fontSize: '40px' }}>🔮</div>
      </div>
    );
  }

  const bgColors = {
    hope: 'linear-gradient(180deg, #1a103c 0%, #060412 100%)',
    chaos: 'linear-gradient(180deg, #2a0a0a 0%, #0f0505 100%)',
    love: 'linear-gradient(180deg, #2a0a1a 0%, #0f050a 100%)',
    power: 'linear-gradient(180deg, #0a1a2a 0%, #050a12 100%)'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: bgColors[currentCard.energy] || bgColors.hope,
      color: '#fff',
      fontFamily: 'Inter, sans-serif',
      padding: '20px 16px',
      paddingBottom: '80px',
      overflowX: 'hidden'
    }}>
      
      {/* 📜 ზედა ინფო */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', letterSpacing: '1px', marginBottom: '4px', textTransform: 'uppercase' }}>
          {currentCard.question}
        </p>
        <h1 style={{ fontSize: '20px', fontFamily: 'Playfair Display, serif', color: '#fbbf24', margin: 0 }}>
          დღის რჩევა
        </h1>
      </div>

      {/* 🃏 ბარათი — 3D Flip + Video Background */}
      <div 
        onClick={handleCardClick}
        style={{
          width: '220px', height: '340px', margin: '0 auto 24px',
          perspective: '1000px', cursor: 'pointer'
        }}
      >
        <div style={{
          width: '100%', height: '100%', position: 'relative',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1)'
        }}>
          
          {/* უკანა მხარე (დახურული) */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%',
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
            borderRadius: '20px', border: '2px solid rgba(167,139,250,0.3)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.6)', zIndex: 2
          }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '50%', 
              background: 'radial-gradient(circle, rgba(167,139,250,0.3), transparent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px',
              animation: 'moon-pulse 3s ease-in-out infinite'
            }}>🌙</div>
            <p style={{ 
              color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginTop: '16px', textAlign: 'center',
              animation: 'hint-fade 2s ease-in-out infinite'
            }}>✨ დააჭირე<br/>გასახსნელად</p>
          </div>
          
          {/* წინა მხარე (გახსნილი) */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%',
            backfaceVisibility: 'hidden',
            background: '#0f172a',
            borderRadius: '20px', border: '2px solid rgba(251,191,36,0.5)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.6), 0 0 30px rgba(251,191,36,0.3)',
            transform: 'rotateY(180deg)', overflow: 'hidden'
          }}>
            {/* 🎥 ვიდეო ფონი */}
            <video 
              autoPlay loop muted playsInline
              style={{ 
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                objectFit: 'cover', zIndex: 0, pointerEvents: 'none'
              }}
            >
              <source src={`/videos/${currentCard.id}.mp4`} type="video/mp4" />
            </video>

            {/* გრადიენტი ტექსტის კითხვადობისთვის */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 1,
              background: 'radial-gradient(circle at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)'
            }}/>

            {/* ტექსტი/სიმბოლო ვიდეოზე */}
            <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', marginTop: 'auto', marginBottom: '20px' }}>
              <h2 style={{ 
                fontSize: '28px', fontFamily: 'Playfair Display, serif', color: '#fbbf24', margin: '0 0 4px',
                textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 0 15px rgba(251,191,36,0.6)'
              }}>
                {currentCard.name}
              </h2>
              <span style={{ fontSize: '13px', color: '#fff', letterSpacing: '2px', textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}>
                {currentCard.number}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 📖 ტექსტი & ღილაკები */}
      <div style={{ 
        maxWidth: '400px', margin: '0 auto', padding: '0 8px',
        opacity: showContent ? 1 : 0, transform: showContent ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease'
      }}>
        {showContent && (
          <>
            <h3 style={{ fontSize: '18px', color: '#fbbf24', marginBottom: '12px', fontFamily: 'Playfair Display, serif', textAlign: 'center' }}>
              {currentCard.name}
            </h3>
            
            <p style={{ color: '#e2e8f0', lineHeight: '1.6', fontSize: '14px', textAlign: 'center', marginBottom: '20px' }}>
              {currentCard.shortText}
            </p>

            <button 
              onClick={() => alert("💎 პრემიუმი: გახსენი სრული განმარტება!")}
              style={{
                width: '100%', maxWidth: '280px', margin: '0 auto 24px', padding: '14px 24px',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', border: 'none', borderRadius: '30px',
                color: '#000', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(251,191,36,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              🔓 სრული განმარტება
            </button>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
              {currentCard.keywords.map(kw => (
                <span key={kw} style={{
                  padding: '6px 12px', background: 'rgba(167,139,250,0.15)', borderRadius: '15px', 
                  fontSize: '11px', color: '#c4b5fd', border: '1px solid rgba(167,139,250,0.3)'
                }}>#{kw}</span>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes moon-pulse { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); } }
        @keyframes hint-fade { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}