const Template = require("../template")
const Database = require("../database/actions")
const _ = require("lodash")
const faker = require("faker")
const Models = require("../database/models")


module.exports = {
    getVoucher: async function (ctx, voucherCode) {
        return await Database.getVoucherByCode(ctx.botInfo.id, voucherCode)
    },
    validateVoucher: async function (ctx, voucher) {
        const user = _.find(voucher.Users, function (user) {
            return user.telegramID === ctx.from.id
        })
        return user ? user.VoucherUser.createdAt : null
    },
    updateVoucherForUser: async function (userID, voucherID) {
        await Database.createVoucherUser(userID, voucherID)
    },
    generateVoucher: async function (ctx) {
        const shop = await Database.getShopByID(ctx.botInfo.id)

        const voucher = await Models.Voucher.create({
            code: faker.lorem.word(),
            discount: Math.floor(Math.random() * (20 - 1 + 1) + 1),     // 1% - 20%
            shopID: shop.toJSON().botID,
            isValid: true,
        })
        return voucher.toJSON().code
    }
}