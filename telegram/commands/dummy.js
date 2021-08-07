const { Shop, Category, Product, User, Address, Order, Payment } = require("../../database/models")
const faker = require("faker")
const _ = require("lodash")


module.exports = {
    createDummyData: async function (ctx) {
        var user = null
        var shop = null

        try {
            user = await User.create({
                telegramID: ctx.from.id,
                name: faker.name.firstName(),
                email: faker.internet.email(),
                mobile: faker.phone.phoneNumber(),
                isOwner: true, // faker.datatype.boolean()
            })

            shop = await Shop.create({
                botID: ctx.botInfo.id,
                name: ctx.botInfo.first_name,
                image: faker.image.imageUrl(),
                ownerID: user.toJSON().telegramID
            })
        } catch (error) {
            user = await User.findByPk(ctx.from.id)
            shop = await Shop.findOne({ where: { name: ctx.botInfo.first_name } })
        }


        const category = await Category.create({
            shopID: shop.toJSON().botID,
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
                userID: user.toJSON().telegramID,
                address: faker.address.streetAddress(),
                city: faker.address.city(),
                postalCode: faker.address.zipCode(),
                country: faker.address.country()
            })
        }
    }
}
