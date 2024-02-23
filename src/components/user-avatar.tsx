import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type Props = {
    className?: string
    src?: string
    initials?: string
}

const UserAvatar = ({ className, src, initials="U" }: Props) => {
    return (
        <Avatar className={cn(
            "h-7 w-7 md:h-10 md:w-10",
            className
        )}>
            <AvatarImage src={src} />
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
    );
}
 
export default UserAvatar;