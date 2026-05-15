// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { initTelegramApp } from './lib/telegram';
import BottomNav from './components/BottomNav';
import LoadingScreen from './components/LoadingScreen';
import Home from './screens/Home';
import Reading from './screens/Reading';
import Wheel from './screens/Wheel';
import CheckIn from './screens/CheckIn';
import History from './screens/History';
import Profile from './screens/Profile';
import Paywall from './screens/Paywall';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('home');

  // ტელეგრამის ინიციალიზაცია (მხოლოდ ერთხელ)
  useEffect(() => {
    initTelegramApp();
  }, []);

  // კოსმოსის ფონის გენერაცია (ვარსკვლავები + ნისლი)
  useEffect(() => {
    const cosmos = document.getElementById('cosmos');
    if (!cosmos || cosmos.children.length > 0) return;
    
    // ვარსკვლავები
    for (let i = 0; i < 70; i++) {
      const s = document.createElement('div');
      s.className = 'sp';
      const z = 0.4 + Math.random() * 1.7;
      s.style.cssText = `width:${z}px;height:${z}px;top:${Math.random()*100}%;left:${Math.random()*100}%;--d:${2+Math.random()*5}s;--dl:${Math.random()*5}s;--op:${0.22+Math.random()*0.6}`;
      cosmos.appendChild(s);
    }
    
    // ნისლის ეფექტები
    [['rgba(107,70,193,1)','500px','500px','-180px','-110px','.17'],['rgba(40,20,130,1)','360px','360px','','','.13']].forEach(([c,w,h,t,l,o], i) => {
      const n = document.createElement('div');
      n.className = 'nb';
      n.style.cssText = i===0 ? `width:${w};height:${h};top:${t};left:${l};background:radial-gradient(circle,${c},transparent);opacity:${o};filter:blur(75px)` : `width:${w};height:${h};bottom:-100px;right:-90px;background:radial-gradient(circle,${c},transparent);opacity:${o};filter:blur(75px)`;
      cosmos.appendChild(n);
    });
  }, []);

  // ეკრანის რენდერინგი
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home': return <Home onNavigate={setCurrentScreen} />;
      case 'reading': return <Reading onNavigate={setCurrentScreen} />;
      case 'wheel': return <Wheel onNavigate={setCurrentScreen} />;
      case 'checkin': return <CheckIn onNavigate={setCurrentScreen} />;
      case 'history': return <History onNavigate={setCurrentScreen} />;
      case 'profile': return <Profile onNavigate={setCurrentScreen} />;
      case 'paywall': return <Paywall onNavigate={setCurrentScreen} />;
      default: return <Home onNavigate={setCurrentScreen} />;
    }
  };

  // 🔑 მთავარი ცვლილება: onEnter (არა onComplete!)
  if (isLoading) {
    return <LoadingScreen onEnter={() => setIsLoading(false)} />;
  }

  return (
    <div id="app" className="show">
      <div id="cosmos"></div>
      {renderScreen()}
      <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
    </div>
  );
}

export default App;