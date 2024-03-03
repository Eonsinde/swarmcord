import MeItem from "./me-item"
import FriendsSection from "./friends-section"

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

const MeSidebar = async () => {
    // TODO: fetch friends here

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
            <FriendsSection friends={[]} />
        </div>
    );
}
 
export default MeSidebar