'use client'
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    setLoading(true);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ message: input })
    });
    const data = await res.json();
    setReply(data.reply);
    setLoading(false);
  };

  return (
    <main style={{padding: 20, maxWidth: 600, margin: 'auto'}}>
      <h1>🇵🇰 Pak Trade AI</h1>
      <input 
        value={input} 
        onChange={e=>setInput(e.target.value)} 
        placeholder="Sawal poocho..." 
        style={{width: '70%', padding: 8}}
      />
      <button onClick={askAI} style={{padding: 8}}>Bhejo</button>
      {loading && <p>Soach raha hun...</p>}
      <p style={{marginTop: 20}}>{reply}</p>
    </main>
  );
}
