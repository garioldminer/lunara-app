import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsVisible(false), 500);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#06041A]"
        >
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: Math.random() * 2 + 1,
                  height: Math.random() * 2 + 1,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() }}
              />
            ))}
          </div>

          <motion.div 
            className="relative w-24 h-24 mb-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#C4B5FD] via-[#8B6FD4] to-[#534AB7] shadow-[0_0_50px_rgba(139,111,212,0.6)]" />
            <div className="absolute inset-[-10px] rounded-full border border-[#A78BFA]/30" />
            <div className="absolute inset-[-20px] rounded-full border border-dashed border-[#A78BFA]/20" />
          </motion.div>

          <motion.h1 
            className="text-3xl font-serif text-[#E8E0FF] mb-2 tracking-widest"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Lunara
          </motion.h1>
          
          <p className="text-[#A78BFA]/60 text-sm mb-8">Connecting to the stars...</p>

          <div className="w-48 h-1.5 bg-[#181440] rounded-full overflow-hidden border border-[#A78BFA]/20">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#534AB7] to-[#A78BFA]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}