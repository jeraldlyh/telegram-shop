const Models = require("../models")
const { Op } = require("sequelize")
const moment = require("moment")


module.exports = {
    createShop: async function (botID, shopName, ownerID, botToken) {
        return await Models.Shop.create({
            botID: botID,
            name: shopName,
            image: null,
            ownerID: ownerID,
            botToken: botToken,
        })
    },
    createOrder: async function (userID, shopID) {
        return await Models.Order.create({
            userID: String(userID),
            shopID: String(shopID),
        })
    },
    createCart: async function (orderID, productID, quantity) {
        return await Models.Cart.create({
            orderID: orderID,
            productID: productID,
            quantity: quantity,
        })
    },
    getCartByProductOrder: async function (orderID, productID) {
        return await Models.Cart.findOne({
            where: {
                orderID: orderID,
                productID: productID,
            }
        })
    },
    getPendingOrderByUser: async function (shopID, userID) {
        const data = await Models.Shop.findOne({
            where: { botID: String(shopID) },
            include: [{
                model: Models.Order,
                where: {
                    userID: String(userID),
                    status: { [Op.eq]: "PENDING" }
                }
            }]
        })
        return data ? data.Orders[0] : data
    },
    getProductByName: async function (shopID, productName) {
        const data = await Models.Category.findOne({
            where: { shopID: String(shopID) },
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
                shopID: String(shopID),
            },
            include: [{
                model: Models.Product,
            }]
        })
        return data.Products
    },
    getCategoryByShop: async function (shopID) {
        return await Models.Shop.findOne({
            where: { botID: String(shopID) },
            include: [{
                model: Models.Category,
                include: [{
                    model: Models.Product
                }]
            }]
        })
    },
    getPendingCartByCategory: async function (shopID, categoryName, userID) {
        const data = await Models.Shop.findOne({
            where: { botID: String(shopID) },
            include: [{
                model: Models.Category,
                where: { name: categoryName },
                include: [{
                    model: Models.Product,
                    include: [{
                        model: Models.Order,
                        where: {
                            userID: String(userID),
                            status: "PENDING",
                        },
                        required: true,
                        through: {
                            attributes: ["quantity"],
                            where: { quantity: { [Op.ne]: 0 } },     // Retrieve orders that has a quantity
                        }
                    }],
                }]
            }]
        })
        return data.toJSON().Categories[0].Products
    },
    getPendingCartByShopID: async function (shopID, userID) {
        const data = await Models.Shop.findOne({
            where: { botID: String(shopID) },
            include: [{
                model: Models.Category,
                include: [{
                    model: Models.Product,
                    include: [{
                        model: Models.Order,
                        where: {
                            userID: String(userID),
                            status: "PENDING",
                        },
                        required: true,
                        through: {
                            attributes: ["quantity"],
                            where: { quantity: { [Op.ne]: 0 } },     // Retrieve orders that has a quantity
                        }
                    }],
                }]
            }]
        })
        return data.Categories
    },
    getVoucherByCode: async function (shopID, voucherCode) {
        return await Models.Voucher.findOne({
            where: {
                shopID: String(shopID),
                code: voucherCode,
                isValid: true
            },
            include: [{
                model: Models.User,
            }]
        })
    },
    createVoucherUser: async function (userID, voucherID) {
        return await Models.VoucherUser.create({
            voucherID: voucherID,
            isClaimed: true,
            userID: String(userID)
        })
    },
    createNewPayment: async function (orderID, addressID, deliveryDate) {
        return await Models.Payment.create({
            orderID: orderID,
            addressID: addressID,
            deliveryDate: deliveryDate,
        })
    },
    createNewNote: async function (paymentID, text) {
        return await Models.Note.create({
            paymentID: paymentID,
            text: text,
        })
    },
    getAddress: async function (userID, orderDetails) {
        return await Models.Address.findOne({
            where: {
                userID: String(userID),
                addressLineOne: orderDetails.lineOne,
                addressLineTwo: orderDetails.lineTwo,
                city: orderDetails.city,
                postalCode: orderDetails.postalCode,
                country: orderDetails.country,
                mobile: orderDetails.mobile
            }
        })
    },
    createAddress: async function (userID, orderDetails) {
        return await Models.Address.create({
            userID: String(userID),
            addressLineOne: orderDetails.lineOne,
            addressLineTwo: orderDetails.lineTwo,
            city: orderDetails.city,
            postalCode: orderDetails.postalCode,
            country: orderDetails.country,
            mobile: orderDetails.mobile
        })
    },
    getShopByID: async function (shopID) {
        return await Models.Shop.findOne({
            where: {
                botID: String(shopID)
            }
        })
    },
    getUserByID: async function (userID) {
        return await Models.User.findOne({
            where: {
                telegramID: String(userID),
            }
        })
    },
    createUser: async function (telegramID, name) {
        return await Models.User.create({
            telegramID: telegramID,
            name: name,
        })
    },
    getChat: async function (shopID, userID) {
        return await Models.Chat.findOne({
            where: {
                shopID: String(shopID),
                userID: String(userID),
            }
        })
    },
    createChat: async function (shopID, userID, chatID) {
        return await Models.Chat.create({
            shopID: String(shopID),
            userID: String(userID),
            chatID: chatID,
        })
    },
    getExpiredOrders: async function (minutes) {
        const before = moment().subtract(minutes, "minutes").tz("Asia/Singapore").format("YYYY-MM-DD HH:mm:ss")
        return await Models.Order.findAll({
            where: {
                createdAt: {
                    // [Op.gte]: new Date(new Date() - minutes *  * 1000)        // 1 seconds = 1000 milliseconds
                    [Op.lte]: before
                },
                status: "PENDING",
            }
        })
    },
    deleteExpiredOrders: async function (minutes) {
        const before = moment().subtract(minutes, "minutes").tz("Asia/Singapore").format("YYYY-MM-DD HH:mm:ss")
        const amount = await Models.Order.destroy({
            where: {
                createdAt: {
                    [Op.lte]: before
                },
                status: "PENDING",
            }
        })
        console.log(`Deleted ${amount} expired orders | ${moment().tz("Asia/Singapore").format("YYYY-MM-DD HH:mm:ss")}`)
    },
}