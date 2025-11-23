import { redirectToSignIn } from "@clerk/nextjs"
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

    return (
        <div className="h-full">
            <div className="fixed inset-y-0 z-20 hidden md:flex h-full w-[300px] flex-col">
                <MeSidebar currentProfile={profile} />
            </div>
            <main className="h-full md:pl-[300px]">
                {children}
            </main>
        </div>
    )
}
 
export default MeLayout