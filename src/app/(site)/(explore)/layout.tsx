import { redirect } from "next/navigation"
import { redirectToSignIn } from "@clerk/nextjs"
import { db } from "@/lib/db"
import { currentProfile } from "@/lib/current-profile"
import ExploreSidebar from "@/components/explore/explore-sidebar"

const ExploreLayout =  async ({
    children
}: {
    children: React.ReactNode
}) => {
    const profile = await currentProfile();

    if (!profile)
        return redirectToSignIn();

    const categories = await db.category.findMany();

    if (!categories)
        return redirect("/");

    return (
        <div className="h-full">
            <div className="fixed inset-y-0 z-20 hidden md:flex h-full w-60 flex-col">
                <ExploreSidebar categories={categories} />
            </div>
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
    )
}

export default ExploreLayout