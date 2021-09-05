import type { NextApiRequest, NextApiResponse } from "next"
import { createHash, createHmac } from "crypto"
import jwt from "next-auth/jwt"
import * as cookie from "cookie"

export default async (req: NextApiRequest, res: NextApiResponse) => {
	
	const teleAuth = {
		id: req.query.id,
		first_name: req.query.first_name,
		last_name: req.query.last_name,
		username: req.query.username,
		photo_url: req.query.photo_url,
		auth_date: req.query.auth_date,
		hash: req.query.hash,
	}

	const secret = createHash("sha256").update(process.env.BOT_TOKEN).digest()

	function checkSignature({ hash, ...data }) {
		const checkString = Object.keys(data)
			.sort()
			.map((k) => `${k}=${data[k]}`)
			.join("\n")
		const hmac = createHmac("sha256", secret).update(checkString).digest("hex")
		return hmac === hash
	}

	if (checkSignature(teleAuth)) {
		const secret = process.env.SECRET
		const token = await jwt.getToken({ req, secret })
		
        res.writeHead(302, {
            Location: "/",
            "Set-Cookie": cookie.serialize("name", String("test"), {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7, // 1 week
            }),
        })
        res.end()
	} else {
        // To be reset to WP-frontend
        res.status(403).send("Unauthorized");
    }
	
}
