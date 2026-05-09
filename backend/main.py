from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, readings, wheel, checkin
import asyncio
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

@app.on_event("startup")
async def startup_event():
    TOKEN = os.getenv("TELEGRAM_TOKEN")
    if not TOKEN:
        logging.warning("No TELEGRAM_TOKEN found, bot not started")
        return
    try:
        from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
        from telegram.ext import Application, CommandHandler, ContextTypes

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
        await bot_app.initialize()
        await bot_app.start()
        await bot_app.updater.start_polling(drop_pending_updates=True)
        logging.info("🌙 Lunara Bot is running!")
    except Exception as e:
        logging.error(f"Bot error: {e}")