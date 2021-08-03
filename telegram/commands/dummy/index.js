const { Shop, Category, Product, User, Address, Order, OrderItem, Payment } = require("../../../models")
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
                ownerID: user.toJSON().telegramID
            })
        } catch (error) {
            user = await User.findByPk(ctx.from.id)
            shop = await Shop.findOne({ where: { name: ctx.botInfo.first_name } })
        }


        const category = await Category.create({
            name: faker.commerce.department(),
            shopID: shop.toJSON().botID,
        })

        const randomProd = _.random(1, 5)

        for (var i = 0; i < randomProd; i++) {
            console.log(category.toJSON().id)
            await Product.create({
                name: faker.commerce.product(),
                description: faker.commerce.productDescription(),
                price: faker.commerce.price(),
                quantity: faker.datatype.number(),
                categoryID: category.toJSON().id
            })
        }

        // TODO: Creation of OrderItems and Order



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
