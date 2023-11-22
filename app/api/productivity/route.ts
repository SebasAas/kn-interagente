import { nextauthOptions } from "@/lib/nextauthOptions";
import { getServerSession } from "next-auth";

export default async function handler(req: any, res: any) {
    const session = await getServerSession(req, res, nextauthOptions)

    if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
    }

    return res.json({
        message: 'Success',
    })
}