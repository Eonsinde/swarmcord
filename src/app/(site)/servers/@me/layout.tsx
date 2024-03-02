import { redirect } from "next/navigation"
import { redirectToSignIn } from "@clerk/nextjs"
import { db } from "@/lib/db"
import { currentProfile } from "@/lib/current-profile"
import ServerSidebar from "@/components/server/server-sidebar"

const MeLayout = async ({
    children,
    params
}: {
    children: React.ReactNode,
    params: { serverId: string }
}) => {
    const profile = await currentProfile();

    if (!profile)
        return redirectToSignIn();

    return (
        <div className="h-full">
            <div className="fixed inset-y-0 z-20 hidden md:flex h-full w-60 flex-col">
            </div>
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
    )
}
 
export default MeLayout