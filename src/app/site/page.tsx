import { ModeToggle } from "@/components/ui/mode-toggle"
import { UserButton } from "@clerk/nextjs"

const page = () => {
    return (
        <div>
            <ModeToggle />
            <UserButton afterSignOutUrl="/" />
        </div>
    )
}

export default page