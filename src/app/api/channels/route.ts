// contain logic to create channel for as given server
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { currentProfile } from "@/lib/current-profile"
import { MemberRole } from "@prisma/client"

export async function POST(req: Request) {
    try {
        const profile = await currentProfile();  

        if (!profile)
            return new NextResponse("Unauthorized", { status: 401 });

        const { searchParams } = new URL(req.url);
        // destructure the default field like this since it's a keyword
        const { name, type, visibility, default: makeDefault } = await req.json();

        const serverId = searchParams.get("serverId");

        if (!serverId)
            return new NextResponse("serverId required in query params", { status: 400 });

        if (makeDefault) {
            // Remove default flag from any current default channel
            await db.channel.updateMany({
                where: {
                    serverId,
                    default: true
                },
                data: {
                    default: false
                }
            });
        }

        // Verify the user is admin/mod in the server
        const server = await db.server.findUnique({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] }
                    }
                }
            }
        });
        
        if (!server) {
            return new NextResponse("Unauthorized: Not an admin/mod in this server", { status: 403 });
        }
        
        // Now create channel + connect to server
        const channel = await db.channel.create({
            data: {
                name,
                type,
                visibility,
                default: Boolean(makeDefault),
                creatorId: profile.id,
                serverId: server.id
            }
        });
        
        return NextResponse.json(channel);
    } catch (error) {
        console.log("[CHANNELS_ID_POST]", error);
        return new NextResponse("Server Error", { status: 500 });
    }
}