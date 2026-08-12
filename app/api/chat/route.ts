import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// CoinMarketCap se Top 100 ki live price
async function getAllPrices() {
  try {
    const res = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=100&convert=USDT`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY!, // 👈 Yahan key lag rahi hai
          'Accept': 'application/json'
        },
        next: { revalidate: 60 } // har 60 sec baad nayi price
      }
    );
    
    if (!res.ok) {
      console.error("CMC Error:", await res.text());
      return "Could not fetch prices from CoinMarketCap.";
    }
    
    const data = await res.json();
    
    let priceText = "Live Top 100 Crypto Prices in USDT:\n";
    data.data.forEach((coin: any) => {
      const price = coin.quote.USDT.price;
      priceText += `${coin.symbol}: $${price.toFixed(4)}\n`;
    });
    return priceText;
  } catch (e) {
    console.error(e);
    return "Could not fetch prices from CoinMarketCap.";
  }
}

export async function POST(req: Request) {
  const { message } = await req.json();
  
  const prices = await getAllPrices(); // Pehle live data le lo
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `
  You are PakTrade AI. You are a professional crypto analyst for Pakistani traders.
  ${prices}
  
  User question: ${message}
  
  Rules: 
    1. Use ONLY the prices above. Do NOT make up prices.
    2. Give clear signal first: SIGNAL: BUY / SELL / WAIT
    3. Then give Entry, SL, TP with USDT prices
  4. Keep it short, 4-5 lines max. This is not financial advice.
  `;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  
  return Response.json({ reply: response.text() });
}
