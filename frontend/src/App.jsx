import { useState } from 'react'

// screens
import Home from './screens/Home.jsx'
import Reading from './screens/Reading.jsx'
import Wheel from './screens/Wheel.jsx'
import CheckIn from './screens/CheckIn.jsx'
import History from './screens/History.jsx'
import Profile from './screens/Profile.jsx'
import Paywall from './screens/Paywall.jsx'

export default function App() {
  const [screen, setScreen] = useState('home')
  const nav = (s) => setScreen(s)

  return (
    <div id="app">
      {screen === 'home'    && <Home nav={nav} />}
      {screen === 'reading' && <Reading nav={nav} />}
      {screen === 'wheel'   && <Wheel nav={nav} />}
      {screen === 'checkin' && <CheckIn nav={nav} />}
      {screen === 'history' && <History nav={nav} />}
      {screen === 'profile' && <Profile nav={nav} />}
      {screen === 'paywall' && <Paywall nav={nav} />}
    </div>
  )
}
