export default function Paywall({ nav }) {
    return (
      <div style={{padding: '20px'}}>
        <h2>⭐ Paywall</h2>
        <button onClick={() => nav('home')}>უკან</button>
      </div>
    )
  }