import { NextResponse } from "next/server"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"

export async function PATCH(req: Request) {
    try {
        const profile = await currentProfile();

        if (!profile)
            return new NextResponse("Unauthorized", { status: 401 });

        const { name, username, bio } = await req.json();

        if (!name && !username && !bio)
            return new NextResponse("No provided field to update", { status: 400 });

        // update user's profile
        const updateProfile = await db.profile.update({
            where: {
                userId: profile.userId
            },
            data: {
                name: name || profile.name,
                username: username || profile.username,
                bio: bio || profile.bio
            }
        });

        return NextResponse.json(updateProfile);
    } catch (error) {
        console.log("[UPDATE_PROFILE]", error);
        return new NextResponse("Server Error", { status: 500 });
    }
}