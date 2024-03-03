import { redirect } from "next/navigation"
import { redirectToSignIn } from "@clerk/nextjs"
import { db } from "@/lib/db"
import { currentProfile } from "@/lib/current-profile"
import MeSidebar from "@/components/me/me-sidebar"

const MeLayout = async ({
    children
}: {
    children: React.ReactNode
}) => {
    const profile = await currentProfile();

    if (!profile)
        return redirectToSignIn();

    // TODO: make request to fetch conversations

    return (
        <div className="h-full">
            <div className="fixed inset-y-0 z-20 hidden md:flex h-full w-60 flex-col">
                <MeSidebar />
            </div>
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
    )
}
 
export default MeLayout