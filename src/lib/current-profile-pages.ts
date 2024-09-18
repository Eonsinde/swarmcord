// used to fetch the auth user profile in the pages/api directory 
import { NextApiRequest } from "next"
import { getAuth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

const currentProfilePages = async (req: NextApiRequest) => {
    const { userId } = getAuth(req);

    if (!userId)
        return null;
    
    const profile = await db.profile.findUnique({
        where: {
            userId
        }
    });

    return profile;
}

export default currentProfilePages
