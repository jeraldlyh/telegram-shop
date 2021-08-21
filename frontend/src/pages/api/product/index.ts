import type { NextApiRequest, NextApiResponse } from "next"
import AWS from "aws-sdk"


export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, body: { name, data, type } } = req
    console.log(type)

    switch (method) {
        case "POST":
            const S3Bucket = new AWS.S3({
                accessKeyId: process.env.S3_ACCESS_ID,
                secretAccessKey: process.env.S3_ACCESS_KEY,
            })
            const buffer = Buffer.from(data.replace(/^data:image\/\w+;base64,/, ""), "base64")
            const bucket = process.env.S3_BUCKET_NAME as string
            const params = {
                Bucket: bucket,
                Key: `products/${name}`,
                Body: buffer,
                ContentEncoding: "base64",
                ContentType: type
            }
            S3Bucket.upload(params, function (error: any, data: any) {
                if (error) {
                    return res.status(400).send(error.code)
                }
                console.log("here")
                return res.status(201).end()
            })
    }
}