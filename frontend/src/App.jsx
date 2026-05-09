import { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import { initTelegramApp } from './lib/telegram';
import Home from './screens/Home';
import BottomNav from './components/BottomNav';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('home');

  useEffect(() => {
    initTelegramApp();
  }, []);

  if (isLoading) return <LoadingScreen onComplete={() => setIsLoading(false)} />;

  return (
    <div className="min-h-screen pb-24">
      {currentScreen === 'home' ? <Home nav={setCurrentScreen} /> : <div className="p-10 text-center">Other screens coming soon...</div>}
      <BottomNav current={currentScreen} onNavigate={setCurrentScreen} />
    </div>
  );
}

export default App;