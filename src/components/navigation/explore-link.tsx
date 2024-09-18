"use client"
import { useCallback, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import ActionTooltip from "@/components/action-tooltip"
import ExploreSvg from "../../../public/svgs/compass.svg"

const ExploreLink = () => {
    const router = useRouter();
    const pathname = usePathname();

    const trailingString = useMemo(() => pathname?.slice(pathname?.lastIndexOf("/")+1), [pathname]);

    const isActive = useMemo(() => (trailingString === "explore"), [trailingString]);

    const handleClick = useCallback(() => router.push(`/explore`), []);

    return (
        <div>
            <ActionTooltip
                label={"Explore"}
                side="right"
                align="center"
            >
                <button
                    className="group relative flex items-center"
                    onClick={handleClick}
                >
                    <div
                        className={cn(
                            "bg-primary absolute left-0 w-[4px] rounded-r-full transition-all",
                            isActive ? "h-[36px] group-hover:h-[36px]" : "group-hover:h-[20px]"
                        )}
                    />
                    <div
                        className={cn(
                            "flex justify-center items-center h-[48px] w-[48px] mx-3 bg-background group-hover:bg-emerald-500 group-hover:rounded-[16px] rounded-[24px] overflow-hidden transition-all",
                            isActive && "bg-emerald-500 rounded-[16px]",
                        )}
                    >
                        <ExploreSvg
                            className={cn(
                                "h-[25px] w-[25px] fill-foreground group-hover:fill-white",
                                isActive ? "fill-white" : ""
                            )}
                        />
                    </div>
                </button>
            </ActionTooltip>
        </div>
    );
}
 
export default ExploreLink;