import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// Ye function sary coins ki price nikal dega
async function getAllPrices() {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,ripple,cardano,dogecoin,polkadot&vs_currencies=usdt`
  );
  const data = await res.json();
  return `
  Live Prices:
  BTC: $${data.bitcoin.usdt}
  ETH: $${data.ethereum.usdt}
  BNB: $${data.binancecoin.usdt}
  SOL: $${data.solana.usdt}
  XRP: $${data.ripple.usdt}
  ADA: $${data.cardano.usdt}
  DOGE: $${data.dogecoin.usdt}
  DOT: $${data.polkadot.usdt}
  `;
}

export async function POST(req: Request) {
  const { message } = await req.json();
  
  const prices = await getAllPrices(); // Live prices nikal li
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `
  You are PakTrade AI. 
  ${prices}
  User question: ${message}
  
  Rules: 
    1. Give clear signal: BUY / SELL / WAIT
    2. Give Entry, SL, TP
    3. Use the live prices above only. Don't make up prices.
  `;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  
  return Response.json({ reply: response.text() });
}
