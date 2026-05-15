// frontend/src/screens/Home.jsx
// ✨ მდიდრული, ანიმირებული მთავარი გვერდი — კოსმოსური დაფა

import { useState, useEffect, useRef } from 'react';
import { fetchDailyCard } from '../lib/api';

export default function Home({ onNavigate }) {
  const [dailyCard, setDailyCard] = useState(null);
  const [streak, setStreak] = useState(3);
  const [checkedIn, setCheckedIn] = useState(false);
  const [orbPosition, setOrbPosition] = useState({ x: 0, y: 0 });
  const [showOrbHint, setShowOrbHint] = useState(true);
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);

  // დღის ბარათის ჩატვირთვა
  useEffect(() => {
    fetchDailyCard().then(setDailyCard);
    
    // მაგიური ნაწილაკების გენერაცია
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      speed: 0.02 + Math.random() * 0.05,
      opacity: 0.3 + Math.random() * 0.7,
      color: ['#A78BFA', '#C084FC', '#F0ABFC', '#FCD34D'][Math.floor(Math.random() * 4)]
    }));
    setParticles(newParticles);
  }, []);

  // პარალაქს ეფექტი მაუსის/ტაჩის მიხედვით
  useEffect(() => {
    const handleMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const x = (e.clientX || e.touches?.[0]?.clientX || 0) - rect.left;
      const y = (e.clientY || e.touches?.[0]?.clientY || 0) - rect.top;
      
      const px = (x / rect.width - 0.5) * 20;
      const py = (y / rect.height - 0.5) * 20;
      
      setOrbPosition({ x: px, y: py });
      
      // მალე დაფარე ორბის მინიშნება
      if (showOrbHint) setShowOrbHint(false);
    };

    const container = containerRef.current;
    container?.addEventListener('mousemove', handleMove);
    container?.addEventListener('touchmove', handleMove);
    
    return () => {
      container?.removeEventListener('mousemove', handleMove);
      container?.removeEventListener('touchmove', handleMove);
    };
  }, [showOrbHint]);

  // ჩეკ-ინის დამუშავება
  const handleCheckIn = () => {
    if (checkedIn) return;
    setCheckedIn(true);
    setStreak(prev => prev + 1);
    
    // ანიმაციის ეფექტი (ოქროს ნაპერწკლები)
    const sparkles = document.createElement('div');
    sparkles.className = 'checkin-sparkles';
    document.querySelector('.checkin-btn')?.appendChild(sparkles);
    setTimeout(() => sparkles.remove(), 1000);
  };

  // ორბზე დაჭერა — დღის რჩევა
  const handleOrbClick = () => {
    onNavigate('reading');
  };

  // პრემიუმ სპრედები
  const premiumSpreads = [
    { id: 'love', name: '💕 ურთიერთობა', desc: 'სიყვარულის გზა', price: '💎 5', color: '#EC4899' },
    { id: 'career', name: '💼 კარიერა', desc: 'წარმატების კომპასი', price: '💎 5', color: '#10B981' },
    { id: 'celtic', name: '🔮 Celtic Cross', desc: 'ღრმა ანალიზი', price: '💎 10', color: '#8B5CF6' },
  ];

  // სწრაფი მოქმედებები
  const quickActions = [
    { id: 'wheel', icon: '🎡', label: 'იღბლის ბორბალი', action: () => onNavigate('wheel') },
    { id: 'history', icon: '📜', label: 'ისტორია', action: () => onNavigate('history') },
    { id: 'profile', icon: '👤', label: 'პროფილი', action: () => onNavigate('profile') },
  ];

  return (
    <div 
      ref={containerRef}
      className="home-screen cosmic-bg"
      style={{ position: 'relative', minHeight: '100%', overflow: 'hidden' }}
    >
      {/* 🌌 დინამიური კოსმოსური ფონი */}
      <CosmicBackground particles={particles} orbPosition={orbPosition} />

      {/* 📱 მთავარი კონტენტი */}
      <div className="home-content" style={{ position: 'relative', zIndex: 10, padding: '16px' }}>
        
        {/* 👤 ზედა ბარი: ავატარი + სტრიქი + შეტყობინებები */}
        <header className="home-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 4px 16px' }}>
          <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="avatar" style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
              animation: 'avatar-glow 3s ease-in-out infinite'
            }}>
              🧙
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#F5F3FF' }}>კეთილი იყოს, Maya</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>დღეს მთვარე თევზებშია 🌙</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* 🔥 სტრიქი */}
            <div className="streak-badge" style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '20px', padding: '6px 12px', fontSize: '11px', fontWeight: '600',
              color: '#FCD34D', boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)'
            }}>
              🔥 {streak} დღე
            </div>
            
            {/* 🔔 შეტყობინებები */}
            <button className="notif-btn" style={{
              background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer',
              position: 'relative', animation: 'notif-pulse 2s ease-in-out infinite'
            }}>
              🔔
              <span style={{
                position: 'absolute', top: '-2px', right: '-2px',
                width: '8px', height: '8px', background: '#EF4444',
                borderRadius: '50%', border: '2px solid #060412'
              }}/>
            </button>
          </div>
        </header>

        {/* 🌙 ინტერაქტიული მთვარის ორბი */}
        <section className="orb-section" style={{ textAlign: 'center', padding: '8px 0 20px' }}>
          <div 
            className="moon-orb interactive"
            onClick={handleOrbClick}
            style={{
              position: 'relative', width: '140px', height: '140px', margin: '0 auto 12px',
              cursor: 'pointer', transform: `translate(${orbPosition.x}px, ${orbPosition.y}px)`,
              transition: 'transform 0.1s ease-out', animation: 'orb-float 6s ease-in-out infinite'
            }}
          >
            {/* ორბის გლოუ */}
            <div className="orb-glow" style={{
              position: 'absolute', inset: '-20px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(167,139,250,0.4), transparent 70%)',
              animation: 'orb-pulse 4s ease-in-out infinite', pointerEvents: 'none'
            }}/>
            
            {/* ორბის ბირთვი */}
            <div className="orb-core" style={{
              position: 'absolute', inset: '0', borderRadius: '50%',
              background: 'radial-gradient(ellipse at 35% 30%, rgba(196,181,253,0.9), rgba(107,70,193,0.6) 45%, rgba(6,4,18,0.95) 80%)',
              border: '2px solid rgba(167,139,250,0.5)',
              boxShadow: '0 0 30px rgba(107,70,193,0.4), inset 0 0 20px rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '42px', animation: 'orb-shimmer 5s ease-in-out infinite'
            }}>
              🌙
            </div>
            
            {/* ორბის რგოლები */}
            {[1, 2, 3].map(i => (
              <div key={i} className={`orb-ring ring-${i}`} style={{
                position: 'absolute', inset: `${-12 * i}px`, borderRadius: '50%',
                border: `1px ${i === 2 ? 'dashed' : 'solid'} rgba(167,139,250,${0.3 - i * 0.08})`,
                animation: `orb-rotate ${20 + i * 10}s linear infinite ${i % 2 === 0 ? 'reverse' : ''}`
              }}/>
            ))}
            
            {/* მაგიური ნაწილაკები ორბის გარშემო */}
            <div className="orb-particles" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="orb-particle" style={{
                  position: 'absolute', width: '4px', height: '4px',
                  background: '#FCD34D', borderRadius: '50%',
                  top: '50%', left: '50%',
                  transform: `rotate(${i * 45}deg) translateX(55px)`,
                  animation: `particle-orbit 3s ease-in-out infinite ${i * 0.2}s`,
                  boxShadow: '0 0 8px rgba(252,211,77,0.8)'
                }}/>
              ))}
            </div>
          </div>
          
          {showOrbHint && (
            <p className="orb-hint" style={{
              fontSize: '11px', color: 'rgba(255,255,255,0.7)', margin: '8px 0 0',
              animation: 'hint-fade 2s ease-in-out infinite'
            }}>
              ✨ დააჭირე ორბს დღის რჩევისთვის
            </p>
          )}
          
          <p className="orb-quote" style={{
            fontSize: '12px', color: 'rgba(255,255,255,0.85)', margin: '4px 0 0',
            fontStyle: 'italic', maxWidth: '240px', marginInline: 'auto'
          }}>
            "ვარსკვლავები გელოდებიან..."
          </p>
        </section>

        {/* 🃏 დღის ბარათი (უფასო) */}
        <section className="daily-card-section" style={{ margin: '0 0 16px' }}>
          <div 
            className="daily-card gc"
            style={{
              padding: '16px', borderRadius: '20px', cursor: 'pointer',
              background: 'linear-gradient(135deg, rgba(107,70,193,0.15), rgba(6,4,18,0.9))',
              border: '1px solid rgba(167,139,250,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(107,70,193,0.2)',
              transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.5), 0 0 30px rgba(167,139,250,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(107,70,193,0.2)';
            }}
            onClick={() => onNavigate('reading')}
          >
            {/* ბარათის გლოუ ეფექტი */}
            <div className="card-glow" style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at 30% 20%, rgba(196,181,253,0.2), transparent 60%)',
              pointerEvents: 'none', animation: 'card-glow-pulse 4s ease-in-out infinite'
            }}/>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 1 }}>
              {/* ბარათის მინიატიურა */}
              <div className="card-thumb" style={{
                width: '56px', height: '78px', borderRadius: '8px', flexShrink: 0,
                background: 'linear-gradient(155deg, rgba(107,70,193,0.6), rgba(6,4,18,0.95))',
                border: '1px solid rgba(167,139,250,0.5)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '28px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(167,139,250,0.3)',
                animation: 'card-float 4s ease-in-out infinite'
              }}>
                ⭐
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '10px', fontWeight: '600', color: '#A78BFA', marginBottom: '2px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  ✨ დღის ბარათი (უფასო)
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', fontWeight: '600', color: '#F5F3FF', marginBottom: '4px' }}>
                  {dailyCard?.name || 'The Star'}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)', marginBottom: '8px', lineHeight: 1.4 }}>
                  {dailyCard?.description || 'იმედის და ახალი დასაწყისის ენერგია...'}
                </div>
                <button className="btn-sm btn-p" style={{
                  padding: '8px 16px', fontSize: '11px', fontWeight: '600', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', border: 'none',
                  color: '#fff', cursor: 'pointer', transition: 'all 0.2s ease'
                }}>
                  სრული განმარტება →
                </button>
              </div>
            </div>
            
            {/* ბარათის ნაპერწკლები */}
            <div className="card-sparkles" style={{ position: 'absolute', top: '-10px', right: '-10px', pointerEvents: 'none' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{
                  position: 'absolute', width: '3px', height: '3px', background: '#FCD34D',
                  borderRadius: '50%', top: `${Math.random() * 40}px`, left: `${Math.random() * 40}px`,
                  animation: `sparkle ${1 + Math.random() * 2}s ease-in-out infinite ${Math.random() * 2}s`,
                  boxShadow: '0 0 6px rgba(252,211,77,0.9)'
                }}/>
              ))}
            </div>
          </div>
        </section>

        {/* 📅 დღის ჩეკ-ინი */}
        <section className="checkin-section" style={{ margin: '0 0 16px' }}>
          <button 
            className={`checkin-btn gc ${checkedIn ? 'checked' : ''}`}
            onClick={handleCheckIn}
            disabled={checkedIn}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: '16px',
              background: checkedIn 
                ? 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,4,18,0.9))'
                : 'linear-gradient(135deg, rgba(13,148,136,0.15), rgba(6,4,18,0.9))',
              border: `1px solid ${checkedIn ? 'rgba(16,185,129,0.5)' : 'rgba(45,212,191,0.3)'}`,
              color: checkedIn ? '#6EE7B7' : '#2DD4BF',
              display: 'flex', alignItems: 'center', gap: '12px', cursor: checkedIn ? 'default' : 'pointer',
              transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden'
            }}
          >
            {/* ჩეკ-ინის ანიმაცია */}
            {!checkedIn && (
              <div className="checkin-pulse" style={{
                position: 'absolute', inset: 0, borderRadius: '16px',
                background: 'radial-gradient(circle, rgba(45,212,191,0.15), transparent 70%)',
                animation: 'checkin-pulse 2s ease-in-out infinite', pointerEvents: 'none'
              }}/>
            )}
            
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
              background: checkedIn ? 'rgba(16,185,129,0.2)' : 'rgba(13,148,136,0.15)',
              border: `1px solid ${checkedIn ? '#10B981' : '#0D9488'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
            }}>
              {checkedIn ? '✅' : '📅'}
            </div>
            
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '2px' }}>
                {checkedIn ? 'დღეს უკვე ჩაინიშნე!' : 'დღის ჩეკ-ინი'}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>
                {checkedIn ? `🎁 +10 💎 მიიღე!` : 'მიიღე დღის ბონუსი და შეინარჩუნე სტრიქი 🔥'}
              </div>
            </div>
            
            {!checkedIn && (
              <div style={{
                fontSize: '11px', fontWeight: '600', padding: '6px 12px',
                background: 'rgba(45,212,191,0.15)', border: '1px solid rgba(45,212,191,0.4)',
                borderRadius: '20px', color: '#2DD4BF'
              }}>
                +10 💎
              </div>
            )}
          </button>
        </section>

        {/* 💎 პრემიუმ სპრედები */}
        <section className="premium-section" style={{ margin: '0 0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#F5F3FF', margin: 0 }}>
              💎 პრემიუმ სპრედები
            </h3>
            <button style={{
              fontSize: '11px', color: '#A78BFA', background: 'transparent', border: 'none',
              cursor: 'pointer', fontWeight: '500'
            }}>
              ყველა ნახვა →
            </button>
          </div>
          
          <div className="spreads-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {premiumSpreads.map(spread => (
              <div 
                key={spread.id}
                className={`spread-card gc ${spread.id}`}
                style={{
                  padding: '14px 10px', borderRadius: '16px', textAlign: 'center', cursor: 'pointer',
                  background: `linear-gradient(135deg, rgba(${spread.color === '#EC4899' ? '236,72,153' : spread.color === '#10B981' ? '16,185,129' : '139,92,246'},0.12), rgba(6,4,18,0.95))`,
                  border: `1px solid rgba(${spread.color === '#EC4899' ? '236,72,153' : spread.color === '#10B981' ? '16,185,129' : '167,139,250'},0.35)`,
                  transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
                  e.currentTarget.style.boxShadow = `0 12px 36px rgba(0,0,0,0.5), 0 0 24px ${spread.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
                }}
                onClick={() => onNavigate('paywall')}
              >
                {/* სპრედის გლოუ */}
                <div className="spread-glow" style={{
                  position: 'absolute', inset: 0,
                  background: `radial-gradient(ellipse at center, ${spread.color}20, transparent 70%)`,
                  pointerEvents: 'none', opacity: 0, transition: 'opacity 0.3s ease'
                }}/>
                
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{spread.name.split(' ')[0]}</div>
                <div style={{ fontWeight: '600', fontSize: '11px', color: '#F5F3FF', marginBottom: '2px' }}>
                  {spread.name.split(' ').slice(1).join(' ')}
                </div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.65)', marginBottom: '6px' }}>
                  {spread.desc}
                </div>
                <div style={{
                  fontSize: '10px', fontWeight: '600', color: spread.color,
                  background: `${spread.color}15`, padding: '3px 8px', borderRadius: '10px',
                  display: 'inline-block'
                }}>
                  {spread.price}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ⚡ სწრაფი მოქმედებები */}
        <section className="quick-actions" style={{ margin: '0 0 8px' }}>
          <div className="q3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {quickActions.map(action => (
              <button
                key={action.id}
                className="qi gc"
                onClick={action.action}
                style={{
                  padding: '14px 8px', borderRadius: '16px', textAlign: 'center', cursor: 'pointer',
                  background: 'var(--glass)', border: '1px solid var(--border)',
                  transition: 'all 0.2s ease', position: 'relative', overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.borderColor = 'rgba(167,139,250,0.6)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(107,70,193,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '22px', marginBottom: '4px', display: 'block' }}>{action.icon}</div>
                <div style={{ fontSize: '10px', color: 'var(--t2)', fontWeight: '500' }}>{action.label}</div>
              </button>
            ))}
          </div>
        </section>

      </div>

      {/* 🎨 CSS ანიმაციები */}
      <style>{`
        @keyframes avatar-glow { 0%, 100% { box-shadow: 0 0 20px rgba(139,92,246,0.5); } 50% { box-shadow: 0 0 35px rgba(167,139,250,0.9); } }
        @keyframes notif-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        @keyframes orb-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes orb-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.7; } }
        @keyframes orb-shimmer { 0%, 100% { filter: drop-shadow(0 0 20px rgba(167,139,250,0.6)); } 50% { filter: drop-shadow(0 0 35px rgba(192,132,252,0.9)); } }
        @keyframes orb-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes particle-orbit { 0%, 100% { opacity: 0.3; transform: rotate(var(--angle)) translateX(55px) scale(0.8); } 50% { opacity: 1; transform: rotate(var(--angle)) translateX(65px) scale(1.2); } }
        @keyframes hint-fade { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes card-glow-pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        @keyframes card-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes sparkle { 0%, 100% { opacity: 0.4; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.3); } }
        @keyframes checkin-pulse { 0%, 100% { transform: scale(1); opacity: 0.15; } 50% { transform: scale(1.1); opacity: 0.3; } }
      `}</style>
    </div>
  );
}

// 🌌 კოსმოსური ფონის კომპონენტი
function CosmicBackground({ particles, orbPosition }) {
  return (
    <div className="cosmic-bg" style={{
      position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
      background: 'radial-gradient(ellipse at bottom, #0a0a1a 0%, #111827 30%, #060412 70%, #030712 100%)',
      overflow: 'hidden'
    }}>
      {/* ნისლის ეფექტები */}
      <div style={{
        position: 'absolute', width: '500px', height: '500px', top: '-180px', left: '-110px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(107,70,193,0.17), transparent)',
        filter: 'blur(75px)', animation: 'nebula-float 20s ease-in-out infinite'
      }}/>
      <div style={{
        position: 'absolute', width: '360px', height: '360px', bottom: '-100px', right: '-90px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(40,20,130,0.13), transparent)',
        filter: 'blur(75px)', animation: 'nebula-float 25s ease-in-out infinite reverse'
      }}/>
      
      {/* ვარსკვლავები */}
      {Array.from({ length: 80 }).map((_, i) => {
        const z = 0.4 + Math.random() * 1.7;
        return (
          <span key={i} className="star" style={{
            position: 'absolute', width: `${z}px`, height: `${z}px`,
            background: '#fff', borderRadius: '50%',
            top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
            animation: `twinkle ${2 + Math.random() * 5}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: 0.22 + Math.random() * 0.6
          }}/>
        );
      })}
      
      {/* დინამიური ნაწილაკები */}
      {particles.map(p => (
        <span key={p.id} className="cosmic-particle" style={{
          position: 'absolute', width: `${p.size}px`, height: `${p.size}px`,
          background: p.color, borderRadius: '50%',
          top: `${p.y}%`, left: `${p.x}%`,
          animation: `particle-float ${8 + p.speed * 100}s linear infinite`,
          opacity: p.opacity, boxShadow: `0 0 ${p.size * 2}px ${p.color}`
        }}/>
      ))}
      
      <style>{`
        @keyframes nebula-float { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(20px, -15px) scale(1.05); } }
        @keyframes twinkle { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 0.9; transform: scale(1.4); } }
        @keyframes particle-float { 0% { transform: translateY(0) translateX(0); } 100% { transform: translateY(-100vh) translateX(30px); } }
      `}</style>
    </div>
  );
}