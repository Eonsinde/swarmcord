import { redirect } from "next/navigation"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import NavigationAction from "./navigation-action"
import NavigationItem from "./navigation-item"
import ExploreLink from "./explore-link"
import MeLink from "./me-link"

const NavigationSidebar = async () => {
    const profile = await currentProfile();

    if (!profile)
        return redirect("/");

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        },
        include: {
            channels: {
                where: {
                    name: "general"
                },
                orderBy: {
                    createdAt: "asc"
                }
            }
        }
    });

    return (
        <aside className="h-full w-full flex flex-col items-center space-y-4 py-3 bg-secondary">
            <MeLink />
            <Separator className="bg-zinc-400 dark:bg-[#484d56] h-[2px] w-10 mx-auto rounded-md"/>
            <NavigationAction iconName="Plus" />
            <ExploreLink />
            <ScrollArea className="flex-1 w-full">
                {servers.map((server) => (
                    <div
                        key={server.id}
                        className="mb-3"
                    >
                        <NavigationItem
                            serverId={server.id}
                            defaultChannelId={server.channels[0].id}
                            serverName={server.name}
                            serverImage={server.imageUrl}
                        />
                    </div>
                ))}
            </ScrollArea>
        </aside>
    )
}

export default NavigationSidebar