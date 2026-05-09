// frontend/src/components/CardReveal3D.jsx
import { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export default function CardReveal3D({ 
  cardName, 
  cardSymbol, 
  cardNumber, 
  isReversed = false,
  description,
  onReveal,
  isRevealed = false
}) {
  const ref = useRef(null);
  const [flipped, setFlipped] = useState(isRevealed);
  
  // 3D tilt values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth springs for natural movement
  const mouseX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });
  
  // Transform to rotation
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-12, 12]);
  
  // Parallax layers
  const symbolZ = useTransform(mouseX, [-0.5, 0.5], [20, -20]);
  const glowZ = useTransform(mouseY, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalize to [-0.5, 0.5]
    const mouseXNorm = (e.clientX - rect.left - width / 2) / width;
    const mouseYNorm = (e.clientY - rect.top - height / 2) / height;
    
    x.set(mouseXNorm);
    y.set(mouseYNorm);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = () => {
    // უსაფრთხოების შემოწმება: onReveal უნდა იყოს ფუნქცია
    if (!flipped && typeof onReveal === 'function') {
      try {
        onReveal();
      } catch (err) {
        console.warn('onReveal error:', err);
      }
    }
    setFlipped(prev => !prev);
  };

  const handleTouchStart = (e) => {
    // მარტივი ვიბრაცია მობილურზე (ნატიური API)
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  return (
    <div 
      ref={ref}
      className="relative w-full max-w-sm mx-auto aspect-[3/4] cursor-pointer"
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ 
          rotateX, 
          rotateY,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.1s ease-out'
        }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.32, 0, 0.67, 0] }}
      >
        {/* === FRONT FACE === */}
        <div 
          className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #1a1644 0%, #2d2666 50%, #1a1644 100%)',
            border: '2px solid rgba(167, 139, 250, 0.4)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 0 40px rgba(139, 111, 212, 0.15)',
          }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
              x: '-100%',
            }}
            animate={{ x: ['100%', '-100%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          />
          
          {/* Decorative border glow */}
          <motion.div 
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(139,111,212,0.2) 0%, transparent 70%)',
              transform: `translateZ(${glowZ}px)`,
            }}
          />
          
          {/* Card content */}
          <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
            {/* Card number */}
            <span className="absolute top-4 left-4 text-xs font-bold text-[#A78BFA]/70 tracking-widest">
              {cardNumber}
            </span>
            
            {/* Reversed indicator */}
            {isReversed && (
              <span className="absolute top-4 right-4 text-[10px] font-bold text-[#FB7185] bg-[#FB7185]/10 px-2 py-1 rounded-full border border-[#FB7185]/30">
                Reversed
              </span>
            )}
            
            {/* Main symbol with parallax */}
            <motion.span 
              className="text-7xl mb-4"
              style={{ 
                transform: `translateZ(${symbolZ}px)`,
                textShadow: '0 0 25px rgba(167,139,250,0.7)'
              }}
              animate={{ 
                scale: [1, 1.03, 1],
                textShadow: [
                  '0 0 20px rgba(167,139,250,0.5)',
                  '0 0 30px rgba(167,139,250,0.8)',
                  '0 0 20px rgba(167,139,250,0.5)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              {cardSymbol}
            </motion.span>
            
            {/* Card name */}
            <h3 className="text-xl font-serif font-bold text-[#E8E0FF] mb-1 tracking-wide">
              {cardName}
            </h3>
            
            {/* Hint */}
            <p className="text-[#A78BFA]/60 text-sm mt-2">
              {flipped ? 'Tap to flip back' : 'Tap to reveal'}
            </p>
            
            {/* Decorative corners */}
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#A78BFA]/40 rounded-tr pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#A78BFA]/40 rounded-bl pointer-events-none" />
          </div>
          
          {/* Bottom decorative line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#A78BFA] to-transparent opacity-50 pointer-events-none" />
        </div>

        {/* === BACK FACE === */}
        <div 
          className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, #0f0c29 0%, #1a1644 50%, #0f0c29 100%)',
            border: '2px solid rgba(167, 139, 250, 0.4)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 0 40px rgba(139, 111, 212, 0.1)',
          }}
        >
          {/* Subtle pattern */}
          <div 
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(167,139,250,0.3) 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />
          
          {/* Content */}
          <div className="relative h-full flex flex-col p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#A78BFA]/70 tracking-widest">{cardNumber}</span>
              {isReversed && (
                <span className="text-[10px] font-bold text-[#FB7185]">Reversed</span>
              )}
            </div>
            
            {/* Card name */}
            <h3 className="text-2xl font-serif font-bold text-[#E8E0FF] text-center mb-3">
              {cardName}
            </h3>
            
            {/* Symbol (smaller on back) */}
            <div className="flex justify-center mb-4">
              <span className="text-4xl opacity-80">{cardSymbol}</span>
            </div>
            
            {/* Description */}
            <p className="text-[#E8E0FF]/85 text-sm leading-relaxed text-center flex-1">
              {description || "The stars align to guide your path tonight. Trust your intuition and remain open to the messages the universe sends your way."}
            </p>
            
            {/* Footer hint */}
            <p className="text-[#A78BFA]/50 text-[10px] text-center mt-4">
              Tap to flip back • {isReversed ? 'Reversed meaning' : 'Upright'}
            </p>
          </div>
          
          {/* Bottom decorative line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#8B6FD4] to-transparent opacity-40 pointer-events-none" />
        </div>
      </motion.div>
      
      {/* Floating particles (decorative) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#A78BFA]/40"
            style={{
              left: `${20 + i * 12}%`,
              top: `${30 + (i % 3) * 15}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}