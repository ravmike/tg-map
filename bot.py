from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Updater, CommandHandler, CallbackContext

def start(update: Update, context: CallbackContext):
    keyboard = [
        [
            InlineKeyboardButton(
                text="Open Map",
                web_app=WebAppInfo(url="https://your-username.github.io/your-repo/"),
            )
        ]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    update.message.reply_text("Click the button to open the map.", reply_markup=reply_markup)

if __name__ == '__main__':
    updater = Updater('YOUR_BOT_TOKEN', use_context=True)
    updater.dispatcher.add_handler(CommandHandler('start', start))
    updater.start_polling()
    updater.idle()