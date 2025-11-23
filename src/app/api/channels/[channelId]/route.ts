// contains logic to change members role in server and kick them from server
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { MemberRole } from "@prisma/client"
import { currentProfile } from "@/lib/current-profile"

export async function PATCH(req: Request, { params }: { params: { channelId: string } }) {
    try {
        const profile = await currentProfile();  

        if (!profile)
            return new NextResponse("Unauthorized", { status: 401 });

        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");

        if (!serverId)
            return new NextResponse("serverId required in query params", { status: 400 });

        if (!params.channelId)
            return new NextResponse("channelId required in params", { status: 400 });

        const { name, type, visibility, default: makeDefault } = await req.json();

        if (!(name || type || visibility || makeDefault))
            return new NextResponse("Specify a channel field to be updated", { status: 400 });


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
                    update: {
                        where: {
                            id: params.channelId
                        },
                        data: {
                            name,
                            type,
                            visibility,
                            default: makeDefault
                        }
                    }
                }
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[CHANNEL_ID_PATCH]", error);
        return new NextResponse("Server Error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { channelId: string } }) {
    try {
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");

        if (!serverId)
            return new NextResponse("serverId required in query params", { status: 400 });

        if (!params.channelId)
            return new NextResponse("channelId required in params", { status: 400 });

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
                    delete: {
                        id: params.channelId,
                        default: {
                            not: true
                        }
                    }
                }
            },
            include: {
                channels: {
                    where: {
                        default: true
                    }
                }
            }
        });

        console.log("[CHANNEL_ID_DELETE]::defaultChannel::", server.channels[0]);

        return NextResponse.json({ defaultChannel: server.channels[0] });
    } catch (error) {
        console.log("[CHANNEL_ID_DELETE]", error);
        return new NextResponse("Server Error", { status: 500 });
    }
}