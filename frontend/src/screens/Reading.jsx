// frontend/src/screens/Reading.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CardReveal3D from '../components/CardReveal3D';

export default function Reading({ nav }) {
  const [isRevealed, setIsRevealed] = useState(false);

  // დიაგნოსტიკა: კონსოლში ჩაწერა
  useEffect(() => {
    console.log('🃏 [Reading] Screen mounted');
  }, []);

  const cardData = {
    name: "The Star",
    symbol: "⭐",
    number: "XVII",
    isReversed: false,
    description: "The Star arrives tonight like a breath after a long storm."
  };

  const handleReveal = () => {
    console.log('🃏 [Reading] handleReveal called');
    setIsRevealed(true);
  };

  // დიაგნოსტიკა: პროპების შემოწმება
  useEffect(() => {
    console.log('🃏 [Reading] Rendering CardReveal3D with props:', {
      cardName: cardData.name,
      cardSymbol: cardData.symbol,
      cardNumber: cardData.number
    });
  }, [cardData]);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#06041A]/80 backdrop-blur-md border-b border-[#A78BFA]/10 px-5 py-4 flex items-center gap-3">
        <button 
          onClick={() => {
            console.log('🔙 [Reading] Back button clicked');
            nav('home');
          }}
          className="w-9 h-9 rounded-full bg-[#181440] border border-[#A78BFA]/30 flex items-center justify-center text-[#A78BFA]"
        >
          ←
        </button>
        <h1 className="text-lg font-serif font-bold text-[#E8E0FF]">Your Reading</h1>
      </header>

      {/* 3D Card Container - დიაგნოსტიკით */}
      <div className="py-6 px-4" style={{ background: 'rgba(255,0,0,0.1)', border: '1px dashed red' }}>
        <p className="text-center text-[#A78BFA]/60 text-xs mb-2">
          🔍 თუ ამ ტექსტს ხედავ, კონტეინერი ირენდერება
        </p>
        
        <CardReveal3D
          cardName={cardData.name}
          cardSymbol={cardData.symbol}
          cardNumber={cardData.number}
          isReversed={cardData.isReversed}
          description={cardData.description}
          onReveal={handleReveal}
          isRevealed={isRevealed}
        />
        
        <p className="text-center text-[#A78BFA]/60 text-xs mt-2">
          🔍 თუ ეს ტექსტიც ჩანს, CardReveal3D კომპონენტი დასრულდა
        </p>
      </div>

      {/* Interpretation */}
      {isRevealed && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 space-y-5"
        >
          <div className="glass-panel rounded-xl p-5">
            <h3 className="text-sm font-bold text-[#A78BFA] mb-2">🔮 The Message</h3>
            <p className="text-[#E8E0FF]/90">Something you have been quietly carrying is closer than you think.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}