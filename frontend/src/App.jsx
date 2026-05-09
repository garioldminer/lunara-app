// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import { initTelegramApp } from './lib/telegram';
import Home from './screens/Home';
import Reading from './screens/Reading'; // ← ახალი იმპორტი (განბლოკე)
import BottomNav from './components/BottomNav';
import DebugPanel from './components/DebugPanel';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('home');

  useEffect(() => {
    initTelegramApp();
  }, []);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Home nav={setCurrentScreen} />;
      case 'reading': // ← ეს განბლოკე — ახლა მუშაობს!
        return <Reading nav={setCurrentScreen} />;
      // case 'paywall': return <Paywall nav={setCurrentScreen} />;
      // case 'profile': return <Profile nav={setCurrentScreen} />;
      // case 'wheel': return <Wheel nav={setCurrentScreen} />;
      // case 'checkin': return <CheckIn nav={setCurrentScreen} />;
      // case 'history': return <History nav={setCurrentScreen} />;
      default:
        return <Home nav={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-[#06041A] text-[#E8E0FF]">
      {/* Main Content */}
      {renderScreen()}

      {/* Bottom Navigation */}
      <BottomNav current={currentScreen} onNavigate={setCurrentScreen} />

      {/* Debug Panel — მხოლოდ დეველოპმენტში ან ?debug=true-ზე */}
      <DebugPanel />
    </div>
  );
}

export default App;