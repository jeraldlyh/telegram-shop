const welcome = require("./welcome")
const category = require("./category")
const product = require("./product")
const cart = require("./cart")
const payment = require("./payment")
const note = require("./note")
const date = require("./date")

module.exports = {
    welcomeScene: welcome.welcomeScene,
    categoryScene: category.categoryScene,
    cartScene: cart.cartScene,
    productScene: product.productScene,
    paymentScene: payment.paymentScene,
    noteScene: note.noteScene,
    dateScene: date.dateScene,
}