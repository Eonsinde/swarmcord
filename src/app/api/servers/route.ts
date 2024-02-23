// to create a server
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { MemberRole } from "@prisma/client"
import { db } from "@/lib/db"
import { currentProfile } from "@/lib/current-profile"

export async function POST(req: Request) {
    try {
        const { name, imageUrl } = await req.json();
        const profile = await currentProfile();

        if (!profile)
            return new NextResponse("Unauthorized", { status: 401 });

        const server = await db.server.create({
            data: {
                creatorId: profile.id,
                name,
                imageUrl,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        { name: "general", creatorId: profile.id }
                    ]
                },
                members: {
                    create: [
                        { profileId: profile.id, role: MemberRole.ADMIN }
                    ]
                }
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("servers error:", error);
        return new NextResponse("Server Error", { status: 500 });
    }
}