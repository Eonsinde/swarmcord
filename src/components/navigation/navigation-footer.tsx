import { UserButton } from "@clerk/nextjs"
import { currentProfile } from "@/lib/current-profile"

const NavigationFooter = async () => {
    const profile = await currentProfile();

    return (
        <div className="">
            <UserButton
                afterSignOutUrl="/"
                appearance={{
                    elements: {
                        avatarBox: "h-[24px] w-[24px]"
                    }
                }}
            />
            <div>
                
            </div>
        </div>
    )
}
 
export default NavigationFooter