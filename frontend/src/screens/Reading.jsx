// frontend/src/screens/Reading.jsx
import { useEffect, useState } from 'react';
import { fetchDailyCard } from '../lib/api'; // <- იმპორტი

export default function Reading({ onNavigate }) {
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ბექენდიდან მონაცემების მიღება
    fetchDailyCard().then((data) => {
      setCardData(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="scr on" id="scr-reading">
        <div className="rd-top">
          <div className="back" onClick={() => onNavigate('home')}>←</div>
          <div className="rd-ttl">Your Reading</div>
        </div>
        <div style={{textAlign:'center',padding:'40px',color:'var(--t3)'}}>
          🌙 Loading cosmic wisdom...
        </div>
      </div>
    );
  }

  // მონაცემების გამოყენება
  const name = cardData?.name || "The Star";
  const symbol = cardData?.symbol || "⭐";
  const number = cardData?.number || "XVII";
  const description = cardData?.description || "The Star arrives tonight like a breath after a long storm.";

  return (
    <div className="scr on" id="scr-reading">
      <div className="rd-top">
        <div className="back" onClick={() => onNavigate('home')}>←</div>
        <div className="rd-ttl">Your Reading</div>
      </div>
      
      <div className="feat-card">
        <div className="feat-inner">
          <span className="feat-sym">{symbol}</span>
          <div className="feat-name">{name}</div>
          <div className="feat-num">{number} · Major Arcana · Upright</div>
          <div className="feat-tags">
            <span className="ftag">Hope</span>
            <span className="ftag">Renewal</span>
          </div>
        </div>
      </div>
      
      <div className="rd-body">
        <div className="rd-sec">
          <div className="rd-lbl">🌙 Card Reveal</div>
          <div className="rd-txt">{description}</div>
        </div>
      </div>
    </div>
  );
}