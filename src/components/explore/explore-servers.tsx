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
                    imageUrl={server.imageUrl || ""}
                    coverUrl={server.coverUrl || ""}
                    membersCount={server?.members?.length}
                />
            ))}
        </>
    )
}

export default ExploreServers