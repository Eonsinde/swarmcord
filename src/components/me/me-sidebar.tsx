import { Conversation, Profile } from "@prisma/client"
import NavigationFooter from "@/components/navigation/navigation-footer"
import MeItem from "./me-item"
import FriendsSection from "./friends-section"

type Props = {
    // receive the profile prop here to send it to navigation footer
    profile?: Profile
    conversations?: Conversation []
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

const MeSidebar = async ({ profile, conversations }: Props) => {
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
            <FriendsSection friends={conversations} />
            <NavigationFooter profile={profile} />
        </div>
    );
}
 
export default MeSidebar