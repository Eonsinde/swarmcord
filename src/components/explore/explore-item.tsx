"use client"
import { useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { icons } from "lucide-react"

type Props = {
    name: string,
    iconName: string
}

const ExploreItem = ({ name, iconName }: Props) => {
    const router = useRouter();
    const pathname = usePathname();

    const CustomIcon = useMemo(() => {
        //@ts-expect-error
        return icons[iconName];
    }, [iconName]);

    const handleClick = () => {
        router.push("/");
    }

    return (
        <button
            className={cn(
                "group p-2 mb-1 flex items-center gap-x-2 w-full hover:bg-zinc-700/5 dark:hover:bg-zinc-700/50 rounded-md transition",
                pathname === "" && "bg-zinc-700/10 dark:bg-zinc-700 hover:bg-zinc-700/10 dark:hover:bg-zinc-700"
            )}
            onClick={handleClick}
        >
            <CustomIcon
                className={cn(
                    "flex-shrink-0 h-5 w-5 text-muted-foreground",
                )}
            />
            <p className={cn(
                "capitalize line-clamp-1 font-semibold text-sm text-muted-foreground group-hover:text-foreground transition",
                pathname === "" && "text-foreground"
            )}>
                {name}
            </p>
        </button>
    )
}
 
export default ExploreItem