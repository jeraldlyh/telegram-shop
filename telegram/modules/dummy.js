const { Shop, Category, Product, User, Address, Voucher } = require("../database/models")
const faker = require("faker")
const _ = require("lodash")


module.exports = {
    createDummyData: async function (ctx) {
        var user = null
        var shop = null
        try {
            user = await User.create({
                telegramID: String(ctx.from.id),
                name: faker.name.firstName(),
                email: faker.internet.email(),
                mobile: faker.phone.phoneNumber(),
                isOwner: true, // faker.datatype.boolean()
            })

            shop = await Shop.create({
                botID: String(ctx.botInfo.id),
                name: ctx.botInfo.first_name,
                image: faker.image.imageUrl(),
                ownerID: String(user.toJSON().telegramID),
                botToken: process.env.BOT_TOKEN,
            })

            await Voucher.create({
                code: faker.lorem.word(),
                discount: Math.floor(Math.random() * (20 - 1 + 1) + 1),     // 1% - 20%
                shopID: shop.toJSON().botID,
                isValid: true,
            })
        } catch (error) {
            user = await User.findByPk(String(ctx.from.id))
            shop = await Shop.findOne({ where: { name: ctx.botInfo.first_name } })
        }

        const category = await Category.create({
            shopID: String(shop.toJSON().botID),
            name: faker.commerce.department(),
            image: faker.image.imageUrl(),
        })

        const randomProd = _.random(1, 5)

        for (var i = 0; i < randomProd; i++) {
            console.log(category.toJSON().id)
            await Product.create({
                name: faker.commerce.product(),
                description: faker.commerce.productDescription(),
                image: faker.image.imageUrl(),
                price: faker.commerce.price(),
                quantity: faker.datatype.number(),
                categoryID: category.toJSON().id
            })
        }

        const randomAddress = _.random(1, 2)
        for (var i = 0; i < randomAddress; i++) {
            await Address.create({
                userID: String(user.toJSON().telegramID),
                addressLineOne: faker.address.streetAddress(),
                addressLineTwo: faker.address.streetAddress(),
                city: faker.address.city(),
                postalCode: faker.address.zipCode(),
                country: faker.address.country(),
                mobile:faker.phone.phoneNumber(),
            })
        }
    }
}
