from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, ContextTypes
from config import BOT_TOKEN, MAP_URL

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Create an inline keyboard with a button to open the web app
    keyboard = [
        [
            InlineKeyboardButton(
                text="Open Map",
                web_app=WebAppInfo(url=MAP_URL),
            )
        ]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    # Send a reply with the inline keyboard
    await update.message.reply_text("Click the button to open the map.", reply_markup=reply_markup)

if __name__ == '__main__':
    # Create the Application object with the bot token
    application = Application.builder().token(BOT_TOKEN).build()

    # Add the /start command handler
    application.add_handler(CommandHandler('start', start))

    # Run the bot until manually stopped
    application.run_polling()