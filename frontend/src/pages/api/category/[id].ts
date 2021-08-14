import type { NextApiRequest, NextApiResponse } from "next"
import db from "../../../../../database"
import Database from "../../../../../database/actions"

async () => {
    try {
        await db.authenticate()
        console.log("Connection has been established successfully.")
    } catch (error) {
        console.log(error)
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { query: { id }, method, body } = req


    const category = await Database.getCategoryByShop(id)
    console.log("here", category)
    res.status(200).send(category)
}