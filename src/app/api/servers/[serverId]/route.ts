// to help update a server
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { currentProfile } from "@/lib/current-profile"

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
    try {
        const { name, imageUrl } = await req.json();

        const profile = await currentProfile();

        if (!profile)
            return new NextResponse("Unauthorized", { status: 401 });

        const existingServer =  await db.server.findUnique({
            where: {
                id: params.serverId
            }
        });

        if (!existingServer)
            return new NextResponse("Server not found", { status: 404 });

        const server = await db.server.update({
            where: {
                id: params.serverId,
                creatorId: profile.id
            },
            data: {
                name: name || existingServer.name,
                imageUrl: imageUrl || existingServer.imageUrl
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("PATCH SERVER ERR:", error);
        return new NextResponse("Server Error", { status: 500 });
    }
}