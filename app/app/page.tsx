'use client'
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");

  const askAI = async () => {
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: input })
    });
    const data = await res.json();
    setReply(data.reply);
  };

  return (
    <main style={{padding: 20}}>
      <h1>Pak Trade AI</h1>
      <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Sawal poocho..." />
      <button onClick={askAI}>Bhejo</button>
      <p>{reply}</p>
    </main>
  );
}
