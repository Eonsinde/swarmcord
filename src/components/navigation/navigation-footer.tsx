"use client"
import { UserButton } from "@clerk/nextjs"
import { Settings } from "lucide-react"
import { Profile } from "@prisma/client"
import { useModal } from "@/hooks/use-modal-store"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Button } from "@/components/ui/button"

type Props = {
    profile?: Profile
}

const NavigationFooter = ({ profile }: Props) => {
    const { onOpen } = useModal();

    return (
        <div className="flex items-center gap-2 m-3 p-3 border border-zinc-400/35 dark:border-[#484d563d] rounded-md">
            <div className="flex-1 flex items-center gap-2 overflow-hidden">
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: "h-[36px] w-[36px]"
                        }
                    }}
                />
                <div className="flex-1 overflow-hidden">
                    <p className="font-semibold text-sm text-foreground truncate">
                        {profile?.name}
                    </p>
                    <p className="font-semibold text-xs text-muted-foreground truncate">
                        {profile?.username || "No username set"}
                    </p>
                </div>
            </div>
            <div>
                <ModeToggle side="top" />
                <Button
                    className={"bg-transparent hover:bg-zinc-700/5 dark:hover:bg-zinc-700/50 rounded-md transition"}
                    size="icon"
                    onClick={() => onOpen("userSettings", profile)}
                >
                    <Settings className="h-5 w-5 text-muted-foreground" />
                </Button>
            </div>
        </div>
    )
}
 
export default NavigationFooter