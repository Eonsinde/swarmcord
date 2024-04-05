import { Conversation } from "@prisma/client"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import NavigationSidebar from "@/components/navigation/navigation-sidebar"
import MeSidebar from "@/components/me/me-sidebar"

type Props ={
    conversations?: Conversation []
}

const MobileToggleMe = ({ conversations }: Props) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    className="md:hidden"
                    variant="ghost"
                    size="icon"
                >
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent
                className="p-0 flex gap-0"
                side="left"
            >
                <div className="w-[72px]">
                    <NavigationSidebar />
                </div>
                <MeSidebar conversations={conversations} />
            </SheetContent>
        </Sheet>
    )
}
 
export default MobileToggleMe