import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// Top 100 coins ki live price
async function getAllPrices() {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usdt&order=market_cap_desc&per_page=100&page=1`,
      { next: { revalidate: 60 } // har 60 sec baad update ho
    );
    const data = await res.json();
    
    let priceText = "Live Top 100 Crypto Prices in USDT:\n";
    data.forEach((coin: any) => {
      priceText += `${coin.symbol.toUpperCase()}: $${coin.current_price}\n`;
    });
    return priceText;
  } catch (e) {
    return "Could not fetch prices.";
  }
}

export async function POST(req: Request) {
  const { message } = await req.json();
  
  const prices = await getAllPrices(); // Live data le lo
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `
  You are PakTrade AI. You are a professional crypto analyst.
  ${prices}
  
  User question: ${message}
  
  Rules: 
    1. Use ONLY the prices above. Do NOT make up prices.
  2. Give clear signal first: SIGNAL: BUY / SELL / WAIT
  3. Then give Entry, SL, TP
  4. Keep it short and direct. This is not financial advice.
  `;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  
  return Response.json({ reply: response.text() });
}
