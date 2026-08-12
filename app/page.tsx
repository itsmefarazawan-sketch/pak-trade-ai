'use client'
import { useState } from 'react'

export default function HomePage() {
  const [msg, setMsg] = useState('')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMsg = async () => {
    setLoading(true)
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ message: msg })
    })
    const data = await res.json()
    setReply(data.reply)
    setLoading(false)
  }

  return (
    <main style={{ padding: '40px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Pak Trade AI 🚀</h1>
      <input 
        value={msg} 
        onChange={e => setMsg(e.target.value)} 
        placeholder="Trade ke bare me pocho..." 
        style={{width: '100%', padding: '10px'}}
      />
      <button onClick={sendMsg} style={{marginTop: '10px', padding: '10px 20px'}}>
        {loading ? 'Soach raha...' : 'Send'}
      </button>
      <p style={{marginTop: '20px'}}>{reply}</p>
    </main>
  )
}
