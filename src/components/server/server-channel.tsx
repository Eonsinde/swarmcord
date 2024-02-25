"use client"
import { useParams, useRouter } from "next/navigation"
import { useModal } from "@/hooks/use-modal-store"
import { cn } from "@/lib/utils"
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client"
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react"
import ActionTooltip from "../action-tooltip"

type Props = {
    channel: Channel
    server: Server
    role?: MemberRole
}

const iconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: Video
}
const ServerChannel = ({ channel, server, role }: Props) => {
    const router = useRouter();
    const params = useParams<{ channelId: string }>();
    const { onOpen } = useModal();

    const Icon = iconMap[channel.type];

    return (
        <button
            className={cn(
                "group p-2 mb-1 flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 rounded-md transition",
                params?.channelId === channel.id && "bg-zinc-700/20 hover:bg-zinc-700"
            )}
            onClick={() => true}
        >
            <Icon className="flex-shrink-0 h-5 w-5 text-muted-foreground" />
            <p className={cn(
                "line-clamp-1 font-semibold text-sm text-muted-foreground group-hover:text-foreground transition",
                params?.channelId === channel.id && ""
            )}>
                {channel.name}
            </p>
            {channel.name !== "general" && role !== MemberRole.GUEST && (
                <div className="ml-auto flex items-center gap-x-2">
                    <ActionTooltip label="Edit">
                        <Edit
                            className="hidden group-hover:block h-4 w-4 text-muted-foreground hover:text-foreground transition"
                            onClick={() => onOpen("editChannel", { server, channel: { id: channel.id, name: channel.name, type: channel.type } })}
                        />
                    </ActionTooltip>
                    <ActionTooltip label="Delete">
                        <Trash
                            className="hidden group-hover:block h-4 w-4 text-muted-foreground hover:text-foreground transition"
                            onClick={() => onOpen("deleteChannel", { server, channel: { id: channel.id, name: channel.name, type: channel.type } })}
                        />
                    </ActionTooltip>
                </div>
            )}
            {channel.name === "general" && (
                <div className="ml-auto flex items-center gap-x-2">
                    <ActionTooltip label="Default channel">
                        <Lock className="ml-auto h-4 w-4 text-muted-foreground hover:text-foreground transition" />
                    </ActionTooltip>
                </div>
            )}
        </button>
    )
}
 
export default ServerChannel;