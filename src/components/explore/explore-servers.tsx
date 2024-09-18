import { fetchServers } from "@/actions/fetch-servers"
import ExploreServerItem from "./explore-server-item"

type Props = {
    categoryId: string
}

const ExploreServers = async ({ categoryId }: Props) => {
    const servers = await fetchServers(categoryId);

    return (
        <>
            {servers?.map((server) => (
                <ExploreServerItem
                    key={server.id}
                    name={server.name}
                    serverId={server.id}
                    defaultChannelId={server.channels[0].id}
                    imageUrl={server.imageUrl || ""}
                    coverUrl={server.coverUrl || ""}
                    membersCount={server?.members?.length}
                />
            ))}
        </>
    )
}

export default ExploreServers