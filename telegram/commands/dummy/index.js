const { Owner, Shop, Category, Product, User, Address, Order, OrderItem, Payment } = require("../../../models")
const faker = require("faker")
const _ = require("lodash")


module.exports = {
    createDummyData: async function (ctx) {
        const owner = await Owner.create({
            telegramID: faker.datatype.number(),
            name: faker.name.firstName(),
            email: faker.internet.email(),
            mobile: faker.phone.phoneNumber()
        })


        const shop = await Shop.create({
            botID: faker.datatype.number(),
            name: faker.lorem.word(),
            ownerID: owner.toJSON().telegramID
        })

        const category = await Category.create({
            name: faker.commerce.department(),
            shopID: shop.toJSON().botID,
        })

        const randomProd = _.random(1, 5)

        for (var i = 0; i < randomProd; i++) {
            await Product.create({
                name: faker.commerce.product(),
                description: faker.commerce.productDescription(),
                price: faker.commerce.price(),
                quantity: faker.datatype.number(),
                category: category.toJSON().id
            })
        }

        // TODO: Creation of OrderItems and Order

        const user = await User.create({
            telegramID: faker.datatype.number(),
            name: faker.name.firstName(),
            email: faker.internet.email(),
            mobile: faker.phone.phoneNumber()
        })

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
