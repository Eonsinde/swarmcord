import { Profile } from "@prisma/client"
import { getConversations } from "@/lib/conversation"
import NavigationFooter from "@/components/navigation/navigation-footer"
import MeItem from "./me-item"
import ConversationsSection from "./conversations-section"

type Props = {
    // receive the profile prop here to send it to navigation footer
    currentProfile: Profile
    conversations?: Profile []
}

const routes = [
    {
        name: "friends",
        path: "/me",
        iconName: "Handshake"
    },
    {
        name: "rocket",
        path: "/rocket",
        iconName: "Rocket"
    }
];

const MeSidebar = async ({ currentProfile }: Props) => {
    // TODO: simply get every conservation with where the auth user's ID is in either profileOneId/profileTwoId
    const conversations = await getConversations(currentProfile?.id);

    // format conversation list by minting other users' profiles from the conversations
    const mintedProfiles = conversations?.map(conversation => {
        const otherProfile = conversation.profileOneId !== currentProfile?.id ? conversation.profileOne : conversation.profileTwo;

        return otherProfile;
    });

    return (
        <div className="h-full w-full flex flex-col bg-[#F2F3F5] dark:bg-[#2B2C31]">
            <div className="mt-2 px-3">
                {routes.map((route) => (
                    <MeItem
                        key={route.name}
                        name={route.name}
                        path={route.path}
                        iconName={route.iconName}
                    />
                ))}
            </div>
            <ConversationsSection conversations={mintedProfiles} />
            <NavigationFooter profile={currentProfile} />
        </div>
    );
}
 
export default MeSidebar