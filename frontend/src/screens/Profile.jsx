export default function Profile({ nav }) {
    return (
      <div style={{padding: '20px'}}>
        <h2>👤 Profile</h2>
        <button onClick={() => nav('home')}>უკან</button>
      </div>
    )
  }