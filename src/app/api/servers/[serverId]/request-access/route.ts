import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { currentProfile } from "@/lib/current-profile"

// this is to help create requests to join a server
export async function POST(req: Request, { params }: { params: { serverId: string } }) {
    try {
        const profile = await currentProfile();

        if (!profile)
            return new NextResponse("Unauthorized", { status: 401 });

        if (!params.serverId)
            return new NextResponse("ServerId is missing from params", { status: 400 });

        // get server and ensure the new user isn't already a member
        const alreadyMember = await db.member.findUnique({
            where: {
                profileId_serverId: {
                    profileId: profile.id,
                    serverId: params.serverId
                }
            }
        });
      
        if (alreadyMember)
            return new NextResponse("You're already a member", { status: 400 });

        // check to see if the user already requested access
        const alreadyRequested = await db.serverAccess.findUnique({
            where: {
                serverId_profileId: {
                    serverId: params.serverId,
                    profileId: profile.id
                }
            }
        });

        if (alreadyRequested)
            return new NextResponse("You already requested access!", { status: 400 });

        // register user's request to join server
        const requestedAccess = await db.serverAccess.create({
            data: {
                serverId: params.serverId,
                profileId: profile.id
            }
        });

        return NextResponse.json(requestedAccess);
    } catch (error) {
        console.log("[REQUEST_JOIN_ACCESS]", error);
        return new NextResponse("Server Error", { status: 500 });
    }
}