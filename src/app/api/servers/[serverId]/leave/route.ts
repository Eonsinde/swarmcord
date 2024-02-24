// contain logic to change members role in server and kick them from server
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { currentProfile } from "@/lib/current-profile"
import { MemberRole } from "@prisma/client"

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
    try {
        if (!params.serverId)
            return new NextResponse("serverId required in params", { status: 400 });

        const profile = await currentProfile();  

        if (!profile)
            return new NextResponse("Unauthorized", { status: 401 });

        const server = await db.server.update({
            where: {
                id: params.serverId,
                creatorId: {
                    not: profile.id
                },
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id
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