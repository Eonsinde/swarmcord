"use client"
import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { icons } from "lucide-react"
import { useActiveExploreLink } from "@/hooks/use-active-explore-link"

type Props = {
    id: string
    name?: string
    iconName: string
}

const ExploreItem = ({ id, name="home", iconName }: Props) => {
    const { activeLink, setActiveLink } = useActiveExploreLink(state => state);

    const formattedName = useMemo(() => name === "home" ? "communities" : name, [name]);

    const CustomIcon = useMemo(() => {
        //@ts-expect-error
        return icons[iconName];
    }, [iconName]);

    const handleClick = () => {
        setActiveLink(formattedName);
    }

    return (
        <button
            className={cn(
                "group p-2 mb-1 flex items-center gap-x-2 w-full hover:bg-zinc-700/5 dark:hover:bg-[#404349] rounded-md transition",
                (activeLink === formattedName) && "bg-zinc-700/10 dark:bg-zinc-700 hover:bg-zinc-700/5 dark:hover:bg-[#404349]"
            )}
            onClick={handleClick}
        >
            <CustomIcon
                className={cn(
                    "flex-shrink-0 h-7 w-7 text-muted-foreground",
                    (activeLink === formattedName) && "text-foreground"
                )}
            />
            <p className={cn(
                "capitalize line-clamp-1 font-semibold text-sm text-muted-foreground group-hover:text-foreground transition",
                (activeLink === formattedName) && "text-foreground"
            )}>
                {name}
            </p>
        </button>
    )
}
 
export default ExploreItem