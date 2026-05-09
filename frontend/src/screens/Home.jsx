export default function Home({ nav }) {
    return (
      <div style={{padding: '20px'}}>
        <h1>🌙 Lunara</h1>
        <p>შენი კოსმიური გზამკვლევი</p>
        <button onClick={() => nav('reading')}>ტაროს წაკითხვა</button>
        <button onClick={() => nav('wheel')}>საბედისწერო ბორბალი</button>
        <button onClick={() => nav('checkin')}>დღიური</button>
      </div>
    )
  }