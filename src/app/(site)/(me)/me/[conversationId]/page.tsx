import { redirect } from "next/navigation"
import { redirectToSignIn } from "@clerk/nextjs"
import { getConversationById, getOrCreateConversation } from "@/lib/conversation"
import { currentProfile } from "@/lib/current-profile"
import { Menu } from "lucide-react"

type Props = {
    params: {
        conversationId: string // this is the other user the auth user is conversing with
    }
}

const ConversationIdPage = async ({ params: { conversationId } }: Props) => {
    // const conversation = await getOrCreateConversation();

    return (
        <div>
            <div className="flex items-center h-12 px-3 text-base border-b-2 border-secondary">
                <Menu />
                <p className="text-foreground">Thomas Wayne</p>
            </div>
        </div>
    )
}
 
export default ConversationIdPage