export default function BottomNav({ nav }) {
    return (
      <div style={{position:'fixed',bottom:0,width:'100%',display:'flex',justifyContent:'space-around',padding:'10px',background:'#1a1a2e'}}>
        <button onClick={() => nav('home')}>🏠</button>
        <button onClick={() => nav('reading')}>🃏</button>
        <button onClick={() => nav('wheel')}>🎡</button>
        <button onClick={() => nav('checkin')}>📓</button>
        <button onClick={() => nav('profile')}>👤</button>
      </div>
    )
  }