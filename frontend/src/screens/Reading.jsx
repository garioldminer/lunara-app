// frontend/src/screens/Reading.jsx
import { useState } from 'react';
import { motion } from 'framer-motion'; // ← აუცილებელია!
import CardReveal3D from '../components/CardReveal3D';

export default function Reading({ nav }) {
  const [isRevealed, setIsRevealed] = useState(false);

  // ეს მონაცემები მოგვიანებით API-დან მოვა
  const cardData = {
    name: "The Star",
    symbol: "⭐",
    number: "XVII",
    isReversed: false,
    description: "The Star arrives tonight like a breath after a long storm — radiant, still, impossibly gentle. She does not rush. She simply shines. Something you have been quietly carrying — a wish you were almost afraid to name — is closer to becoming real than fear allows you to believe. The universe has been listening. Let yourself want what you want without apology. The Star asks only that you remain open — not in desperate grasping, but in the soft readiness of someone who knows something beautiful is on its way."
  };

  const handleReveal = () => {
    setIsRevealed(true);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#06041A]/80 backdrop-blur-md border-b border-[#A78BFA]/10 px-5 py-4 flex items-center gap-3">
        <button 
          onClick={() => nav('home')}
          className="w-9 h-9 rounded-full bg-[#181440] border border-[#A78BFA]/30 flex items-center justify-center text-[#A78BFA] hover:scale-105 active:scale-95 transition-transform"
        >
          ←
        </button>
        <h1 className="text-lg font-serif font-bold text-[#E8E0FF]">Your Reading</h1>
      </header>

      {/* 3D Card */}
      <div className="py-6 px-4">
        <CardReveal3D
          cardName={cardData.name}
          cardSymbol={cardData.symbol}
          cardNumber={cardData.number}
          isReversed={cardData.isReversed}
          description={cardData.description}
          onReveal={handleReveal}
          isRevealed={isRevealed}
        />
      </div>

      {/* Interpretation Section */}
      {isRevealed && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-5 space-y-5"
        >
          <div className="glass-panel rounded-xl p-5">
            <h3 className="text-sm font-bold text-[#A78BFA] mb-2 uppercase tracking-wider">🔮 The Message</h3>
            <p className="text-[#E8E0FF]/90 leading-relaxed">
              Something you have been quietly carrying — a wish you were <em className="text-[#C4B5FD] not-italic">almost afraid to name</em> — is closer to becoming real than fear allows you to believe. The universe has been listening.
            </p>
          </div>

          <div className="glass-panel rounded-xl p-5">
            <h3 className="text-sm font-bold text-[#A78BFA] mb-2 uppercase tracking-wider">✨ Your Path</h3>
            <p className="text-[#E8E0FF]/90 leading-relaxed">
              Let yourself want what you want <em className="text-[#C4B5FD] not-italic">without apology</em>. The Star asks only that you remain open — not in desperate grasping, but in the soft readiness of someone who knows something beautiful is on its way.
            </p>
          </div>

          <div className="bg-gradient-to-r from-[#181440] to-[#0C0928] border border-[#A78BFA]/20 rounded-xl p-5 text-center">
            <p className="text-[#A78BFA]/60 text-xs uppercase tracking-wider mb-2">💫 Tonight's Mantra</p>
            <p className="text-[#E8E0FF] font-serif italic text-lg">
              "I trust the slow unfolding of things meant for me."
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button className="flex-1 py-3 rounded-xl bg-[#181440] border border-[#A78BFA]/30 text-[#E8E0FF] font-medium hover:bg-[#1a1644] active:scale-[0.98] transition-all">
              📖 Journal
            </button>
            <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#534AB7] to-[#8B6FD4] text-white font-medium shadow-[0_4px_20px_rgba(83,74,183,0.4)] active:scale-[0.98] transition-all">
              ↗ Share
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}