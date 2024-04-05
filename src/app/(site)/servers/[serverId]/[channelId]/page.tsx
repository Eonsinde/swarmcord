import { redirect } from "next/navigation"
import { redirectToSignIn } from "@clerk/nextjs"
import { db } from "@/lib/db"
import { currentProfile } from "@/lib/current-profile"
import ChatHeader from "@/components/conversation/chat-header"
import ChatInput from "@/components/conversation/chat-input"

type Props = {
    params: {
        serverId: string,
        channelId: string
    }
}

const ChannelIdPage = async ({ params: { serverId, channelId } }: Props) => {
    const profile = await currentProfile();

    if (!profile)
        return redirectToSignIn();

    const channel = await db.channel.findUnique({
        where: {
            id: channelId
        }
    });

    const member = await db.member.findFirst({
        where: {
            serverId,
            profileId: profile.id
        }
    });

    if (!channel || !member)
        return redirect("/me");

    return (
        <div className="h-full flex flex-col">
            <ChatHeader
                serverId={serverId}
                name={channel.name}
                type="channel"
                channelType={channel.type}
            />
            <div className="flex-1 flex justify-center items-center">
                <p>
                    Server Details Page {serverId} | Channel: {channelId}
                </p>
            </div>
            <ChatInput
                name={channel.name}
                type="channel"
                apiUrl="/api/socket/messages"
                query={{
                    channelId: channel.id,
                    serverId: channel.serverId
                }}
            />
        </div>
    )
}

export default ChannelIdPage