import { redirect } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ModeToggle } from "@/components/ui/mode-toggle"
import NavigationAction from "./navigation-action"
import NavigationItem from "./navigation-item"

type Props = {}

const NavigationSidebar = async (props: Props) => {
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
        }
    });

    return (
        <aside className="h-full w-full flex flex-col items-center space-y-4 py-3 bg-secondary">
            <NavigationAction />
            <Separator className="bg-[#484d56] h-[2px] w-10 mx-auto rounded-md"/>
            <ScrollArea className="flex-1 w-full">
                {servers.map((server) => (
                    <div
                        key={server.id}
                        className="mb-3"
                    >
                        <NavigationItem
                            id={server.id}
                            name={server.name}
                            imageUrl={server.imageUrl}
                        />
                    </div>
                ))}
            </ScrollArea>
            <div className="mt-auto flex flex-col items-center gap-y-4">
                <ModeToggle />
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: "h-[48px] w-[48px]"
                        }
                    }}
                />
            </div>
        </aside>
    )
}

export default NavigationSidebar