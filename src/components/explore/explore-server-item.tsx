"use client"
import { useActiveChannel } from "@/hooks/use-active-channel"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useShallow } from "zustand/react/shallow"

type Props = {
    name: string
    imageUrl: string
    coverUrl: string
    serverId: string
    defaultChannelId: string
    membersCount: number
}

const ExploreServerItem = ({
    name,
    imageUrl,
    coverUrl,
    serverId,
    defaultChannelId,
    membersCount
}: Props) => {
    const router = useRouter();
    const activeServerChannel = useActiveChannel(useShallow(state => state.servers.find(server => server.activeServerId === serverId)));

    const onClick = () => {
        // this function helps navigate to previously active channel under a server or the default channel
        if (activeServerChannel?.activeChannelId && serverId === activeServerChannel?.activeServerId)
            return router.push(`/servers/${serverId}/${activeServerChannel?.activeChannelId}`);
        return router.push(`/servers/${serverId}/${defaultChannelId}`);
    }

    return (
        <div
            className="group bg-transparent dark:bg-[#2c2d31] hover:bg-transparent hover:dark:bg-[#232428] border-[1px] border-border rounded-md hover:shadow-md overflow-hidden cursor-pointer hover:-translate-y-1 transition"
            onClick={onClick}
        >
            <div className="relative h-40 bg-zinc-200">
                <Image
                    className="object-cover"
                    src={coverUrl}
                    fill
                    alt={`${name} cover`}
                    placeholder="empty"
                />
            </div>
            <div className="relative p-3">
                <div className="absolute -top-7 h-12 w-12 flex justify-center items-center border-4 border-white dark:border-[#2c2d31] group-hover:border-white group-hover:dark:border-[#232428] rounded-xl overflow-hidden">
                    <Image
                        className="object-cover rounded-md"
                        src={imageUrl}
                        fill
                        alt={`${name} dp`}
                        placeholder="empty"
                    />
                </div>
                <p className="mt-4 text-foreground capitalize">{name}</p>
                <small className="text-muted-foreground line-clamp-4">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dignissimos ad nostrum magni molestiae voluptatibus consequatur eos enim expedita velit tenetur, natus explicabo ratione recusandae obcaecati maxime debitis sed, tempore assumenda.
                </small>
            </div>
            <div className="flex items-center space-x-1 pb-3 px-3">
                <div className="bg-zinc-500 h-3 w-3 rounded-full" />
                <small className="text-muted-foreground">{membersCount} Members</small>
            </div>
        </div>
    )
}
 
export default ExploreServerItem