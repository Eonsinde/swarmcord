// contain logic to change members role in server and kick them from server
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { currentProfile } from "@/lib/current-profile"
import { MemberRole } from "@prisma/client"

export async function POST(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const { name, type } = await req.json();

        const serverId = searchParams.get("serverId");

        if (name === "general")
            return new NextResponse("Channel name cannot be `general`", { status: 400 });

        if (!serverId)
            return new NextResponse("serverId required in query params", { status: 400 });

        const profile = await currentProfile();  

        if (!profile)
            return new NextResponse("Unauthorized", { status: 401 });

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    create: {
                        creatorId: profile.id,
                        name,
                        type
                    }
                }
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[CHANNELS_ID_POST]", error);
        return new NextResponse("Server Error", { status: 500 });
    }
}