const Models = require("../../models")
const { Op } = require("sequelize")


module.exports = {
    createOrder: async function (userID, shopID) {
        return await Models.Order.create({
            userID: userID,
            shopID: shopID
        })
    },
    createOrderItem: async function (orderID, productID, quantity) {
        console.log("HERE", orderID, productID, quantity)
        return await Models.OrderItem.create({
            orderID: orderID,
            productID: productID,
            quantity: quantity
        })
    },
    getOrderItemByProductOrder: async function (orderID, productID) {
        return await Models.OrderItem.findOne({
            where: {
                orderID: orderID,
                productID: productID
            }
        })
    },
    getPendingOrderByUser: async function (shopID, userID) {
        const data = await Models.Shop.findOne({
            where: { botID: shopID },
            include: [{
                model: Models.Order,
                where: {
                    userID: userID,
                    status: { [Op.eq]: "PENDING" }
                }
            }]
        })
        return data.Orders[0]
    },
    getProductByName: async function (shopID, productName) {
        const data = await Models.Category.findOne({
            where: { shopID: shopID },
            include: [{
                model: Models.Product,
                where: { name: productName }
            }]
        })
        return data.Products[0]
    },
    getProductByCategory: async function (shopID, categoryName) {
        const data = await Models.Category.findOne({
            where: {
                name: categoryName,
                shopID: shopID
            },
            include: [{
                model: Models.Product,
            }]
        })
        return data.Products
    },
    getCategoryByShop: async function (shopID) {
        return await Models.Shop.findOne({
            where: { botID: shopID },
            include: [{
                model: Models.Category,
                include: [{
                    model: Models.Product
                }]
            }]
        })
    },
    getOrderItemsByCategory: async function (categoryName) {

    }
}