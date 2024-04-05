import { Suspense } from "react"
import MobileToggleExplore from "@/components/mobile-toggle-explore"
import ExploreServerItem from "@/components/explore/explore-server-item"
import { fetchServers } from "@/actions/fetch-servers"

const ExplorePage = async ({
    searchParams
}: {
    searchParams: { category: string }
}) => {
    const servers = await fetchServers(searchParams.category);

    return (
        <div>
            <header className="md:hidden flex items-center h-12 px-3 md:px-5">
                <MobileToggleExplore />
            </header>
            <main className="relative p-3 md:p-5">
                <section className="bg-accent h-72 rounded-md">

                </section>
                <h4 className="mt-5 mb-2 text-lg text-foreground font-semibold">Featured communities</h4>
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 xl:flex-row">
                    <Suspense
                        fallback={
                            <>
                                {new Array(10).fill(1).map((item) => (
                                    <div className="h-[331] bg-[#2c2d31] hover:bg-[#232428] rounded-md overflow-hidden cursor-pointer hover:-translate-y-2 transition" />
                                ))}
                            </>
                        }
                    >
                        {servers?.map((server) => (
                            <ExploreServerItem
                                key={server.id}
                                name={server.name}
                                imageUrl={server.imageUrl || ""}
                                coverUrl={server.coverUrl || ""}
                                membersCount={server?.members?.length}
                            />
                        ))}
                    </Suspense>
                </section>
            </main>
        </div>
    )
}

export default ExplorePage