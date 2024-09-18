import { NextApiRequest } from "next"
import { NextApiResponseServerIo } from "../../../../types"
import { db } from "@/lib/db"
import currentProfilePages from "@/lib/current-profile-pages"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo
) {
    if (req.method !== "POST")
        return res.status(405).json({ error: "Method not allowed" });
    
    try {
        const profile = await currentProfilePages(req);

        if (!profile)
            return res.status(401).json({ error: "Unauthorized" });

        const { content, fileUrl } = req.body;

        // TODO: make use of fileUrl later on
        if (!content)
            return res.status(400).json({ error: "Message content is missing" });

        const { serverId, channelId } = req.query;

        if (!serverId || !channelId)
            return res.status(400).json({ error: "ServerId or ChannelId is missing" });

        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            include: {
                members: true
            }
        });

        if (!server)
            return res.status(404).json({ error: "Server not found" });

        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string
            }
        });

        if (!channel)
            return res.status(404).json({ error: "Channel not found" });

        // mint the member model for the auth user
        const member = server.members.find((member) => member.profileId === profile.id);

        if (!member)
            return res.status(404).json({ error: "Member not found" });

        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                channelId: channel.id,
                memberId: member.id
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        const channelKey = `chat:${channelId}:messages`;

        // emit event with the data
        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json(message);
    } catch (error) {
        console.log("[SOCKET_MESSAGES_POST]:", error);
        return res.status(500).json({ error: "Server Error" });
    }
}