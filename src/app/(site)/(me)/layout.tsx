import { redirectToSignIn } from "@clerk/nextjs"
import { currentProfileWithMembers } from "@/lib/current-profile"
import MeSidebar from "@/components/me/me-sidebar"
import { getConversations } from "@/lib/conversation"

const MeLayout = async ({
    children
}: {
    children: React.ReactNode
}) => {
    const profile = await currentProfileWithMembers();

    if (!profile)
        return redirectToSignIn();

    const conversations = await getConversations(profile.members.map((member => member.id)));

    return (
        <div className="h-full">
            <div className="fixed inset-y-0 z-20 hidden md:flex h-full w-60 flex-col">
                <MeSidebar conversations={conversations} />
            </div>
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
    )
}
 
export default MeLayout