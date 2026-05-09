export default function History({ nav }) {
    return (
      <div style={{padding: '20px'}}>
        <h2>📜 History</h2>
        <button onClick={() => nav('home')}>უკან</button>
      </div>
    )
  }