import Models from "../models"
import { Op } from "sequelize"
import moment from "moment"


export const getCategoryByShop = async (shopID: string) => {
    const data = await Models.Category.findAll({
        where: { shopID: shopID },
    })
    return data
}

export default {
    getCategoryByShop
}