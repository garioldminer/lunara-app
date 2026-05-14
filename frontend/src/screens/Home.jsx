// frontend/src/screens/Home.jsx
export default function Home({ onNavigate }) {
  return (
    <div className="scr on" id="scr-home">
      <div className="home-wrap">
        <div className="status-bar">
          <div className="sb-logo"><span className="sb-txt">Lunara</span></div>
          <div className="sb-r">
            <div className="streak">🔥 <span>7</span></div>
            <div className="av" onClick={() => onNavigate('profile')}>M</div>
          </div>
        </div>

        <div className="hero">
          <div className="moon-pill"><div className="mp-dot"></div><span>Waning Crescent · Scorpio Season</span></div>
          <div className="orb" onClick={() => onNavigate('reading')}>
            <div className="orb-glow"></div>
            <div className="orb-ring"></div>
            <div className="orb-ring"></div>
            <div className="orb-body"></div>
            <div className="orb-core">
              <div className="orb-ico">🌙</div>
              <div className="orb-lbl">tap to draw</div>
            </div>
          </div>
          <div className="hero-txt">
            <div className="hero-ttl">Good evening, Maya ✨</div>
            <div className="hero-sub">The cards are still and waiting</div>
          </div>
        </div>

        <div className="home-cards">
          <div className="gc" onClick={() => onNavigate('reading')}>
            <div className="free-strip">
              <div className="fcard">⭐</div>
              <div className="fi">
                <div className="fi-tag">Card of the Day</div>
                <div className="fi-name">The Star · XVII</div>
                <div className="fi-sub">Trust the slow unfolding of things meant for you</div>
              </div>
              <div className="fa">›</div>
            </div>
            <div className="fs-shim"></div>
          </div>

          <div className="gc">
            <div className="cd-strip">
              <div className="cd-l">
                <div className="cd-lbl">Free daily reading used</div>
                <div className="cd-track"><div className="cd-bar"></div></div>
              </div>
              <div className="cd-timer">🕐 18h 22m</div>
            </div>
          </div>

          <div>
            <div style={{fontSize:'10px',color:'var(--t3)',textTransform:'uppercase',letterSpacing:'.1em',fontWeight:600,marginBottom:7}}>Spreads</div>
            <div className="sp-grid">
              <div className="spi free" onClick={() => onNavigate('reading')} style={{'--gc':'rgba(13,148,136,.12)'}}>
                <div className="spi-glow"></div>
                <span className="spi-ico">🃏</span>
                <div className="spi-name">Single Card</div>
                <div className="spi-desc">Daily guidance</div>
                <span className="spi-tag tag-f">✦ Free</span>
              </div>
              <div className="spi locked" onClick={() => onNavigate('paywall')} style={{'--gc':'rgba(217,119,6,.12)'}}>
                <div className="spi-glow"></div>
                <span className="spi-lock">🔒</span>
                <span className="spi-ico">✝️</span>
                <div className="spi-name">Celtic Cross</div>
                <div className="spi-desc">6 cards · deep insight</div>
                <span className="spi-tag tag-p">★ Premium</span>
              </div>
              <div className="spi locked" onClick={() => onNavigate('paywall')} style={{'--gc':'rgba(190,24,93,.12)'}}>
                <div className="spi-glow"></div>
                <span className="spi-lock">🔒</span>
                <span className="spi-ico">💕</span>
                <div className="spi-name">Love Spread</div>
                <div className="spi-desc">5 cards · relationships</div>
                <span className="spi-tag tag-p">★ Premium</span>
              </div>
              <div className="spi locked" onClick={() => onNavigate('paywall')} style={{'--gc':'rgba(217,119,6,.1)'}}>
                <div className="spi-glow"></div>
                <span className="spi-lock">🔒</span>
                <span className="spi-ico">🌟</span>
                <div className="spi-name">Year Ahead</div>
                <div className="spi-desc">12 cards · full year</div>
                <span className="spi-tag tag-p">★ Premium</span>
              </div>
            </div>
          </div>

          <div className="q3">
            <div className="qi" onClick={() => onNavigate('wheel')}><span className="qi-i">🎡</span><div className="qi-l">Daily Wheel</div></div>
            <div className="qi" onClick={() => onNavigate('checkin')}><span className="qi-i">📅</span><div className="qi-l">Check-in</div></div>
            <div className="qi" onClick={() => onNavigate('history')}><span className="qi-i">📖</span><div className="qi-l">History</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}