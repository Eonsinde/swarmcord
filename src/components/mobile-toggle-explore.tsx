import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import NavigationSidebar from "@/components/navigation/navigation-sidebar"
import ExploreSidebar from "@/components/explore/explore-sidebar"

const MobileToggleExplore = () => {
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
                <ExploreSidebar categories={[]} />
            </SheetContent>
        </Sheet>
    )
}
 
export default MobileToggleExplore