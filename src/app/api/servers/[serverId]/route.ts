// to help update and delete a given server
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { edgeStoreBackendClient } from "@/lib/edgestore-server"
import { currentProfile } from "@/lib/current-profile"

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
    try {
        const profile = await currentProfile();

        if (!profile)
            return new NextResponse("Unauthorized", { status: 401 });

        const { name, imageUrl, coverUrl } = await req.json();

        if (!(name || imageUrl || coverUrl)) {
            return new NextResponse("Specify a server field to be update", { status: 400 });
        }

        const existingServer =  await db.server.findUnique({
            where: {
                id: params.serverId
            }
        });

        if (!existingServer)
            return new NextResponse("Server not found", { status: 404 });

        if (imageUrl && existingServer?.imageUrl) {
            // delete the existing server image before replacing with new one
            await edgeStoreBackendClient.publicFiles.deleteFile({
                url: existingServer.imageUrl,
            });
        }

        // TODO: check to see if user is subscribed also
        // use the data from the profile to determine is subscribed later on
        const isSubscribed = false;

        if (isSubscribed && coverUrl && existingServer?.coverUrl) {
            // this means, you're subscribed and trying to update the coverUrl
            await edgeStoreBackendClient.publicFiles.deleteFile({
                url: existingServer.coverUrl,
            });
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                creatorId: profile.id
            },
            data: {
                name: name || existingServer.name,
                imageUrl: imageUrl || existingServer.imageUrl,
                coverUrl: isSubscribed ? coverUrl : existingServer.coverUrl
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[PATCH_SERVER]", error);
        return new NextResponse("Server Error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { serverId: string } }) {
    try {
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

        if (existingServer?.imageUrl) {
            // TODO: user response for something later on
            await edgeStoreBackendClient.publicFiles.deleteFile({
                url: existingServer.imageUrl,
            });
        }

        if (existingServer?.coverUrl) {
            await edgeStoreBackendClient.publicFiles.deleteFile({
                url: existingServer.coverUrl,
            });
        }

        const server = await db.server.delete({
            where: {
                id: existingServer.id,
                creatorId: profile.id
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[DELETE_SERVER]", error);
        return new NextResponse("Server Error", { status: 500 });
    }
}

