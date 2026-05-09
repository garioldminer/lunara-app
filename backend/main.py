from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, readings, wheel, checkin
import threading
import logging
import os

app = FastAPI(title="Lunara API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router,    prefix="/api/users")
app.include_router(readings.router, prefix="/api/readings")
app.include_router(wheel.router,    prefix="/api/wheel")
app.include_router(checkin.router,  prefix="/api/checkin")

@app.get("/health")
def health():
    return {"status": "ok", "app": "Lunara API"}

def run_bot():
    try:
        from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
        from telegram.ext import Application, CommandHandler, ContextTypes
        import asyncio

        TOKEN = os.getenv("TELEGRAM_TOKEN")
        WEBAPP_URL = os.getenv("WEBAPP_URL", "https://lunara-app-pi.vercel.app")

        async def start(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
            keyboard = [[InlineKeyboardButton("🌙 Open Lunara", web_app=WebAppInfo(url=WEBAPP_URL))]]
            await update.message.reply_text(
                "✨ Welcome to *Lunara* — your cosmic companion.\n\nTap below to open your personal tarot experience.",
                parse_mode="Markdown",
                reply_markup=InlineKeyboardMarkup(keyboard)
            )

        bot_app = Application.builder().token(TOKEN).build()
        bot_app.add_handler(CommandHandler("start", start))
        print("🌙 Lunara Bot is running...")
        bot_app.run_polling(drop_pending_updates=True)
    except Exception as e:
        logging.error(f"Bot error: {e}")

@app.on_event("startup")
async def startup_event():
    if os.getenv("TELEGRAM_TOKEN"):
        thread = threading.Thread(target=run_bot, daemon=True)
        thread.start()