export default function Wheel({ nav }) {
    return (
      <div style={{padding: '20px'}}>
        <h2>🎡 Wheel</h2>
        <button onClick={() => nav('home')}>უკან</button>
      </div>
    )
  }