import { ChannelType } from "@prisma/client"
import { Hash, Mic, Video } from "lucide-react"
import MobileToggle from "@/components/mobile-toggle"

type Props = {
    serverId: string
    name: string
    type: "channel" | "conversation"
    channelType?: ChannelType
    imageUrl?: string
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-5 w-5 text-muted-foreground" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-5 w-5 text-muted-foreground" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-5 w-5 text-muted-foreground" />
}

const ChatHeader = ({ serverId, name, type, channelType, imageUrl }: Props) => {
    return (
        <div className="flex items-center h-12 px-3 text-base border-b-2 border-secondary">
            <MobileToggle serverId={serverId} />
            {type === "channel" && channelType && (
                <>
                    {iconMap[channelType]}
                </>
            )}
            <p className="text-foreground">{name}</p>
        </div>
    )
}
 
export default ChatHeader