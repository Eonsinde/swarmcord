import { Suspense } from "react"
import MobileToggleExplore from "@/components/mobile-toggle-explore"
import ExploreServerItem from "@/components/explore/explore-server-item"
import { fetchServers } from "@/actions/fetch-servers"
import ExploreServers from "@/components/explore/explore-servers"

const ExplorePage = ({
    searchParams
}: {
    searchParams: { category: string }
}) => {
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
                                {new Array(10).fill(1).map((_, index) => (
                                    <div
                                        key={index}
                                        className="h-[331px] bg-zinc-300/40 hover:bg-zinc-300/70 dark:bg-[#2c2d31] dark:hover:bg-[#232428] rounded-md overflow-hidden cursor-pointer hover:-translate-y-1 transition"
                                    />
                                ))}
                            </>
                        }
                    >
                        <ExploreServers categoryId={searchParams.category} />
                    </Suspense>
                </section>
            </main>
        </div>
    )
}

export default ExplorePage