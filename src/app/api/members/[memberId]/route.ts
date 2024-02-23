import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { currentProfile } from "@/lib/current-profile"

export async function PATCH(req: Request, { params }: { params: { memberId: string } }) {
    try {
        const { searchParams } = new URL(req.url);
        const { role } = await req.json();

        const serverId = searchParams.get("serverId");

        if (!serverId)
            return new NextResponse("serverId required in query params", { status: 400 });

        if (!params.memberId)
            return new NextResponse("memberId required in params", { status: 400 });

        const profile = await currentProfile();  

        if (!profile)
            return new NextResponse("Unauthorized", { status: 401 });

        const server = await db.server.update({
            where: {
                id: serverId,
                creatorId: profile.id
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile.id
                            }
                        },
                        data: {
                            role
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[MEMBERS_ID_PATCH]", error);
        return new NextResponse("Server Error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { memberId: string } }) {
    try {
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");

        if (!serverId)
            return new NextResponse("serverId required in query params", { status: 400 });

        if (!params.memberId)
            return new NextResponse("memberId required in params", { status: 400 });

        const profile = await currentProfile();  

        if (!profile)
            return new NextResponse("Unauthorized", { status: 401 });

        const server = await db.server.update({
            where: {
                id: serverId,
                creatorId: profile.id
            },
            data: {
                members: {
                    deleteMany: {
                        id: params.memberId,
                        profileId: {
                            not: profile.id
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[MEMBERS_ID_PATCH]", error);
        return new NextResponse("Server Error", { status: 500 });
    }
}