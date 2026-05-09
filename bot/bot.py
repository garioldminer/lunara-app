import logging
from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes
from dotenv import load_dotenv
import os

load_dotenv()
logging.basicConfig(level=logging.INFO)

WEBAPP_URL = os.getenv("WEBAPP_URL", "https://lunara.vercel.app")
TOKEN = os.getenv("TELEGRAM_TOKEN")

async def start(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    keyboard = [[
        InlineKeyboardButton(
            "🌙 Open Lunara",
            web_app=WebAppInfo(url=WEBAPP_URL)
        )
    ]]
    await update.message.reply_text(
        "✨ Welcome to *Lunara* — your cosmic companion.\n\n"
        "Tap below to open your personal tarot experience.",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(keyboard)
    )

def main():
    app = Application.builder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    print("🌙 Lunara Bot is running...")
    app.run_polling(drop_pending_updates=True)

if __name__ == "__main__":
    main()
