const cron = require("node-cron")
const _ = require("lodash")
const axios = require("axios")
const Database = require("../database/actions")
const db = require("../database")

// const BOT_API_KEY = "BOT_API_KEY"
// const API_KEY_LENGTH = BOT_API_KEY.length
// const CHAT_ID = "CHAT_ID"
// const CHAT_LENGTH = CHAT_ID.length
// const TELEGRAM_API_URL = `https://api.telegram.org/bot[${BOT_API_KEY}]/sendMessage?chat_id=[${CHAT_ID}]&text=${MESSAGE}`
const MESSAGE = "We noticed that there're still items in your cart and have proceeded to clear it. We apologise for the inconvenience 😥"
const EXPIRY_TIME = 1


db.authenticate()
    .then(() => console.log("Connection has been established successfully."))
    .catch((err) => console.log(err))

/**
 * Gets orders that are created >30 mins from the time of this cronjob to
 * prevent hoarders from holding on to their items in their cart
 */
cron.schedule("*/30 * * * * *", async () => {
    const orders = await Database.getExpiredOrders(EXPIRY_TIME)
    const chatID = await Promise.all(_.map(orders, async (order) => {
        const chat = await Database.getChat(order.shopID, order.userID)
        const shop = await Database.getShopByID(order.shopID)
        return {
            chatID: chat.toJSON().chatID,
            botToken: shop.toJSON().botToken
        }
    }))

    for (const chat of chatID) {
        console.log(chat.chatID, chat.botToken)
        axios.post(`https://api.telegram.org/bot${chat.botToken}/sendMessage`, {
            "chat_id": chat.chatID,
            "text": MESSAGE
        })
    }
    await Database.deleteExpiredOrders(EXPIRY_TIME)
})

// const getFullyFormedURL = (chatID, botToken) => {
//     const apiIndexStart = TELEGRAM_API_URL.indexOf(BOT_API_KEY) - 1
//     const apiIndexEnd = apiIndexStart + API_KEY_LENGTH + 2

//     var tempURL = TELEGRAM_API_URL
//     tempURL = tempURL.substr(0, apiIndexStart) + botToken + tempURL.substr(apiIndexEnd)

//     const chatIndexStart = tempURL.indexOf(CHAT_ID) - 1
//     const chatIndexEnd = chatIndexStart + CHAT_LENGTH + 2

//     tempURL = tempURL.substr(0, chatIndexStart) + chatID + tempURL.substr(chatIndexEnd)
//     return tempURL
// }