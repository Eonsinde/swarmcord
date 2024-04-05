import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"

export async function PATCH(req: Request, { params }: { params: { inviteCode: string } }) {
    try {
        const profile = await currentProfile();

        if (!profile)
            return new NextResponse("Unauthorized", { status: 401 });

        if (!params.inviteCode)
            return new NextResponse("Server ID missing", { status: 400 });

        const existingServer = await db.server.findUnique({
            where: {
                inviteCode: params.inviteCode
            }
        });

        if (!existingServer)
            return new NextResponse("Server Not Found or Link has expired", { status: 400 });

        // check if user already in the server
        const serverUserIsIn = await db.server.findFirst({
            where: {
                inviteCode: params.inviteCode,
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            include: {
                channels: {
                    where: {
                        name: "general"
                    },
                    orderBy: {
                        createdAt: "asc"
                    }
                }
            }
        });

        // if user in server, just redirect to server
        if (serverUserIsIn)
            return NextResponse.json(serverUserIsIn);

        // user not in server, add user to the members of the server    
        const server = await db.server.update({
            where: {
                inviteCode: params.inviteCode
            },
            data: {
                members: {
                    create: [
                        {
                            profileId: profile.id
                        }
                    ]
                }
            },
            include: {
                channels: {
                    where: {
                        name: "general"
                    },
                    orderBy: {
                        createdAt: "asc"
                    }
                }
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVER_INVITE_ID]", error);
        return new NextResponse("Server Error", { status: 500 });
    }
}