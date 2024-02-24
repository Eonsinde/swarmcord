import { redirect } from "next/navigation"
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react"
import { ChannelType, MemberRole } from "@prisma/client"
import { db } from "@/lib/db"
import { currentProfile } from "@/lib/current-profile"
import { ScrollArea } from "@/components/ui/scroll-area"
import ServerHeader from "./server-header"
import ServerSearch from "./server-search"

type Props = {
    serverId: string
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
}

const ServerSidebar = async ({ serverId }: Props) => {
    const profile = await currentProfile();

    if (!profile)
        return redirect("/")

    const server = await db.server.findUnique({
        where: {
            id: serverId
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc"
                }
            },
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

    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT);
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO);
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO);
    // remove the currently auth user from the members list
    const members = server?.members.filter((member) => member.profileId !== profile.id);

    if (!server)
        return redirect("/");

    const role = server.members.find((member) => member.profileId === profile.id)?.role;

    return (
        <div className="h-full w-full flex flex-col bg-[#F2F3F5] dark:bg-[#2B2C31]">
            <ServerHeader
                server={server}
                role={role}
            />
            <div className="mt-2 px-3">
                <ServerSearch
                    data={[
                        {
                            label: "Text Channels",
                            type: "channel",
                            data: textChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type]
                            }))
                        },
                        {
                            label: "Voice Channels",
                            type: "channel",
                            data: audioChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type]
                            }))
                        },
                        {
                            label: "Video channels",
                            type: "channel",
                            data: videoChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type]
                            }))
                        },
                        {
                            label: "Members",
                            type: "member",
                            data: members?.map((member) => ({
                                id: member.id,
                                name: member.profile.name,
                                icon: roleIconMap[member.role]
                            }))
                        }
                    ]}
                />
            </div>
            <ScrollArea className="flex-1 px-3">

            </ScrollArea>
        </div>
    )
}
 
export default ServerSidebar