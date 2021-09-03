import Models from "../models"
import { Op } from "sequelize"
import moment from "moment-timezone"


module.exports = {
    createShop: async function (botID: string, shopName: string, ownerID: string, botToken: string) {
        return await Models.Shop.create({
            botID: botID,
            name: shopName,
            image: null,
            ownerID: ownerID,
            botToken: botToken,
        })
    },
    createOrder: async function (userID: string, shopID: string) {
        return await Models.Order.create({
            userID: userID,
            shopID: shopID,
        })
    },
    createCart: async function (orderID: string, productID: string, quantity: number) {
        return await Models.Cart.create({
            orderID: orderID,
            productID: productID,
            quantity: quantity,
        })
    },
    getCartByProductOrder: async function (orderID: string, productID: string) {
        return await Models.Cart.findOne({
            where: {
                orderID: orderID,
                productID: productID,
            }
        })
    },
    getPendingOrderByUser: async function (shopID: string, userID: string) {
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
        return data && data.Orders ? data.Orders[0] : data
    },
    getProductByName: async function (shopID: string, productName: string) {
        const data = await Models.Category.findOne({
            where: { shopID: shopID },
            include: [{
                model: Models.Product,
                where: { name: productName }
            }]
        })
        return data && data.Products ? data.Products[0] : null
    },
    getProductByCategory: async function (shopID: string, categoryName: string) {
        const data = await Models.Category.findOne({
            where: {
                name: categoryName,
                shopID: shopID,
            },
            include: [{
                model: Models.Product,
            }]
        })
        return data && data.Products ? data.Products[0] : null
    },
    getCategoryByShop: async function (shopID: string) {
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
    getPendingCartByCategory: async function (shopID: string, categoryName: string, userID: string) {
        const data = await Models.Shop.findOne({
            where: { botID: shopID },
            include: [{
                model: Models.Category,
                where: { name: categoryName },
                include: [{
                    model: Models.Product,
                    include: [{
                        model: Models.Order,
                        where: {
                            userID: userID,
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
        return data && data.Categories ? data.Categories[0].Products : null
    },
    getPendingCartByShopID: async function (shopID: string, userID: string) {
        const data = await Models.Shop.findOne({
            where: { botID: shopID },
            include: [{
                model: Models.Category,
                include: [{
                    model: Models.Product,
                    include: [{
                        model: Models.Order,
                        where: {
                            userID: userID,
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
        return data ? data.Categories : null
    },
    getVoucherByCode: async function (shopID: string, voucherCode: string) {
        return await Models.Voucher.findOne({
            where: {
                shopID: shopID,
                code: voucherCode,
                isValid: true
            },
            include: [{
                model: Models.User,
            }]
        })
    },
    createVoucherUser: async function (userID: string, voucherID: string) {
        return await Models.VoucherUser.create({
            voucherID: voucherID,
            isClaimed: true,
            userID: userID
        })
    },
    createNewPayment: async function (orderID: string, addressID: string, deliveryDate: string) {
        return await Models.Payment.create({
            orderID: orderID,
            addressID: addressID,
            deliveryDate: deliveryDate,
        })
    },
    createNewNote: async function (paymentID: string, text: string) {
        return await Models.Note.create({
            paymentID: paymentID,
            text: text,
        })
    },
    getAddress: async function (userID: string, orderDetails: any) { // TODO: Implement interface for orderDetails
        return await Models.Address.findOne({
            where: {
                userID: userID,
                addressLineOne: orderDetails.lineOne,
                addressLineTwo: orderDetails.lineTwo,
                city: orderDetails.city,
                postalCode: orderDetails.postalCode,
                country: orderDetails.country,
                mobile: orderDetails.mobile
            }
        })
    },
    createAddress: async function (userID: string, orderDetails: any) {
        return await Models.Address.create({
            userID: userID,
            addressLineOne: orderDetails.lineOne,
            addressLineTwo: orderDetails.lineTwo,
            city: orderDetails.city,
            postalCode: orderDetails.postalCode,
            country: orderDetails.country,
            mobile: orderDetails.mobile
        })
    },
    getShopByID: async function (shopID: string) {
        return await Models.Shop.findOne({
            where: {
                botID: shopID
            }
        })
    },
    getUserByID: async function (userID: string) {
        return await Models.User.findOne({
            where: {
                telegramID: userID,
            }
        })
    },
    createUser: async function (telegramID: string, name: string) {
        return await Models.User.create({
            telegramID: telegramID,
            name: name,
        })
    },
    getChat: async function (shopID: string, userID: string) {
        return await Models.Chat.findOne({
            where: {
                shopID: shopID,
                userID: userID,
            }
        })
    },
    createChat: async function (shopID: number, userID: string, chatID: number) {
        return await Models.Chat.create({
            shopID: shopID,
            userID: userID,
            chatID: chatID,
        })
    },
    getExpiredOrders: async function (minutes: number) {
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
    deleteExpiredOrders: async function (minutes: number) {
        console.log("deleting nowww")
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