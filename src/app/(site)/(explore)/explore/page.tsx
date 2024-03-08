import MobileToggleExplore from "@/components/mobile-toggle-explore"
import ExploreServerItem from "@/components/explore/explore-server-item"
import { fetchServers } from "@/actions/fetch-servers"

const ExplorePage = async ({
    searchParams
}: {
    searchParams: { category: string }
}) => {
    const servers = await fetchServers(searchParams.category);

    console.log("Servers:", servers);

    return (
        <div>
            <header className="md:hidden flex items-center h-12 px-3 md:px-5">
                <MobileToggleExplore />
            </header>
            <main className="relative p-3 md:p-5 space-y-4">
                <section className="bg-accent h-64 rounded-md">

                </section>
                <p className="mt-4 text-foreground">Featured communities</p>
                <section className="md:grid grid-cols-4 gap-3 xl:flex-row">
                    {servers?.map((server) => (
                        <ExploreServerItem
                            key={server.id}
                            name={server.name}
                            imageUrl={server.imageUrl || ""}
                            coverUrl={server.coverUrl || ""}
                            membersCount={12399392}
                        />
                    ))}
                </section>
            </main>
        </div>
    )
}

export default ExplorePage