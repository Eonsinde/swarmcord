"use client"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useShallow } from 'zustand/react/shallow'
import { useActiveChannel } from "@/hooks/use-active-channel"
import { cn } from "@/lib/utils"
import ActionTooltip from "@/components/action-tooltip"

type Props = {
    serverId: string
    defaultChannelId: string
    serverName: string
    serverImage: string | null
}

const NavigationItem = ({ serverId, defaultChannelId, serverName, serverImage }: Props) => {
    const params = useParams<{ serverId: string }>();
    const router = useRouter();
    const activeServerChannel = useActiveChannel(useShallow(state => state.servers.find(server => server.activeServerId === serverId)));

    const onClick = () => {
        // this function helps navigate to previously active channel under a server or the default channel
        if (activeServerChannel?.activeChannelId && serverId === activeServerChannel?.activeServerId)
            return router.push(`/servers/${serverId}/${activeServerChannel?.activeChannelId}`);
        return router.push(`/servers/${serverId}/${defaultChannelId}`);
    }

    return (
        <ActionTooltip
            label={serverName}
            side="right"
            align="center"
        >
            <button
                className="group relative flex items-center"
                onClick={onClick}
            >
                <div
                    className={cn(  
                        "bg-primary absolute left-0 w-[4px] rounded-r-full transition-all",
                        params?.serverId !== serverId && "group-hover:h-[20px]",
                        params?.serverId === serverId ? "h-[36px]" : "h-[8px]"
                    )}
                />
                <div className={cn(
                    "relative group h-[48px] w-[48px] flex mx-3 bg-muted rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
                    params?.serverId === serverId && "bg-primary/10 text-primary rounded-[16px]"
                )}>
                    {serverImage ? (
                        <Image
                            className="object-cover"
                            src={serverImage}
                            fill
                            alt={`${serverName} channel`}
                            placeholder="empty"
                        />
                    ): (
                        <div className="h-full w-full flex justify-center items-center">
                            <p className="text-center whitespace-normal">
                                {serverName.split(" ").map(letter => letter[0])}
                            </p>
                        </div>
                    )}
                </div>
            </button>
        </ActionTooltip>
    );
}
 
export default NavigationItem;