import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { query: { id }, method, body } = req

    
    const category = await Database.getCategoryByShop(id)
    console.log("here", category)
    res.status(200).send(category)
}