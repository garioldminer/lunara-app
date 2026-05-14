// backend/src/index.ts
import { Bot } from "grammy";
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;
const WEBAPP_URL = process.env.WEBAPP_URL || "https://lunara-app-pi.vercel.app";

if (!BOT_TOKEN) {
  console.error("❌ შეცდომა: BOT_TOKEN არ არის მითითებული .env ფაილში!");
  process.exit(1);
}

// 1. Telegram Bot
const bot = new Bot(BOT_TOKEN);

bot.command("start", async (ctx) => {
  await ctx.reply("🌙 **Lunara-ში მოგესალმებით!**\n\nშეეხეთ ქვემოთ მენიუს აპლიკაციის გასახსნელად.", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🔮 გახსენი Lunara App", web_app: { url: WEBAPP_URL } }]
      ]
    }
  });
});

bot.on("message:text", async (ctx) => {
  await ctx.reply("🤖 მე ჯერ ვსწავლობ! გამოიყენე /start აპლიკაციისთვის.");
});

// 2. Express API
const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Lunara Backend is running on Node.js + TypeScript 🚀" });
});

app.get("/api/daily-card", (req: Request, res: Response) => {
  res.json({
    name: "The Star",
    symbol: "⭐",
    number: "XVII",
    description: "The Star arrives tonight like a breath after a long storm."
  });
});

// 3. Start
async function start() {
  bot.start().then(() => console.log("✅ Telegram Bot started"));
  app.listen(PORT, () => {
    console.log(`🌐 API Server running on http://localhost:${PORT}`);
    console.log(`🔗 WebApp URL: ${WEBAPP_URL}`);
  });
}

start();