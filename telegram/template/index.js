

module.exports = {
    registrationSuccessMessage: function (userID, username, shopName) {
        return `
Congraluations <a href="tg://user?id=${userID}">@${username}</a>! You have just successfully setup <b>${shopName}</b>. You may now proceed to XXX url to add products and configure your store!
`
    },
    htmlMode: function () {
        return { parse_mode: "HTML" }
    },
    ...require("./category"),
    ...require("./welcome"),
    ...require("./cart"),
    ...require("./product"),
    ...require("./date"),
    ...require("./note"),
}