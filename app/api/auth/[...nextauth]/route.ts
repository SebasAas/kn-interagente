import { nextauthOptions } from "@/app/(lib)/nextauthOptions";
import NextAuth from "next-auth";

const handler = NextAuth(nextauthOptions)

export { handler as GET, handler as POST };

// export default async function handler(req: any, res: any) {
//     const session = await getServerSession(req, res, nextauthOptions)

//     if (!session) {
//         res.status(401).json({ message: "You must be logged in." });
//         return;
//     }

//     return res.json({
//         message: 'Success',
//     })
// }