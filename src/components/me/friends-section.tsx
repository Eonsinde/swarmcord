"use client"
import { Plus } from "lucide-react"
import ActionTooltip from "@/components/action-tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import FriendsBlank from "./friends-blank"

type Props = {
    friends: any[]
}

const FriendsSection = ({ friends }: Props) => {
    return (
        <section className="flex flex-col px-3">
            <header className="flex justify-between items-center py-2">
                <p className="text-sm font-semibold text-muted-foreground">
                    Direct Messages
                </p>
                <ActionTooltip
                    label="Create DM"
                    side="top"
                >
                    <button
                        className="text-muted-foreground"
                        onClick={() => true}
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </ActionTooltip>
            </header>
           <FriendsBlank />
            <ScrollArea className="flex-1 w-full">

            </ScrollArea>
        </section>
    );
}
 
export default FriendsSection