import { redirect } from "next/navigation"
import { redirectToSignIn } from "@clerk/nextjs"
import { getOrCreateConversation } from "@/lib/conversation"
import { currentProfile } from "@/lib/current-profile"
import MobileToggleMe from "@/components/mobile-toggle-me"
import UserAvatar from "@/components/user-avatar"
import SocketIndicator from "@/components/socket-indicator"

type Props = {
    params: {
        profileId: string // this is the other user the auth user is conversing with
    }
}

const ConversationIdPage = async ({ params: { profileId } }: Props) => {
    const authProfile = await currentProfile();

    if (!authProfile)
        return redirectToSignIn();
        
    const conversation = await getOrCreateConversation(authProfile.id, profileId);

    if (!conversation)
        return redirect("/me");

    const { profileOne, profileTwo } = conversation;

    const otherMember = authProfile.id === profileOne.id ? profileTwo : profileOne;

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-x-2 h-12 px-3 text-base border-b-2 border-secondary">
                <MobileToggleMe />
                <UserAvatar
                    className="h-8 w-8 md:h-8 md:w-8"
                    src={otherMember.imageUrl}
                />
                <p className="text-foreground">{otherMember.name}</p>
                <div className="ml-auto flex items-center">
                    <SocketIndicator />
                </div>
            </div>
        </div>
    )
}
 
export default ConversationIdPage