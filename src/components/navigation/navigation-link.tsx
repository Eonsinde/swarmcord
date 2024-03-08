"use client"
import { useCallback, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import ActionTooltip from "@/components/action-tooltip"
import SwarmSvg from "../../../public/svgs/mask.svg"
import ExploreSvg from "../../../public/svgs/compass.svg"

const variants = cva(
    "flex justify-center items-center h-[48px] w-[48px] mx-3 bg-background rounded-[24px] group-hover:rounded-[16px] overflow-hidden transition-all",
    {
        variants: {
            variant: {
                directMessages: "group-hover:bg-purple-500",
                explore: "group-hover:bg-emerald-500",
            }
        },
        defaultVariants: {
            variant: "directMessages"
        }
    }
);

type Props = VariantProps<typeof variants>

const NavigationLink = ({ variant="directMessages" }: Props) => {
    const router = useRouter();
    const pathname = usePathname();

    const trailingString = useMemo(() => pathname.slice(pathname.lastIndexOf("/")+1), [pathname]);

    const isDMLink = useMemo(() => (trailingString === "me" || trailingString === "rocket"), [pathname]);
    const isExploreLink = useMemo(() => (trailingString === "explore"), []);

    // console.log("trailingString", trailingString, pathname);

    const label = useMemo(() => {
        if (variant === "directMessages")
            return "Direct Messages";
        else if (variant === "explore")
            return "Explore";
        return "Unidentified variant";
    }, [variant]);

    const handleClick = useCallback(() => {
        // TODO: cache the active route under DM(either me | rocket) and use that to determine where DM should push to
        if (variant === "directMessages")
            return router.push(`/me`);
        else if (variant === "explore")
            return router.push(`/explore`);
        return null;
    }, [variant]);

    return (
        <div>
            <ActionTooltip
                label={label}
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
                            !isDMLink ? "group-hover:h-[20px]" : !isExploreLink ? "group-hover:h-[20px]" : "",
                            isDMLink ? ((variant === "directMessages") ? "h-[36px]" : "") : ((variant === "explore") ? "h-[36px]" : "")
                        )}
                    />
                    <div
                        className={cn(
                            variants({ variant }),
                            isDMLink ? (variant === "directMessages" ? "bg-purple-500" : "") : (variant === "explore" ? "bg-emerald-500" : ""),
                            isDMLink ? (variant === "directMessages" ? "rounded-[16px]" : "") : (variant === "explore" ? "rounded-[16px]" : "")
                        )}
                    >
                        {variant === "directMessages" && (
                            <SwarmSvg
                                className={cn(
                                    "h-[25px] w-[25px] fill-foreground group-hover:fill-white dark:group-hover:fill-foreground",
                                    isDMLink ? variant === "directMessages" ? "fill-white dark:fill-foreground" : "" : ""
                                )}
                            />
                        )}
                        {variant === "explore" && (
                            <ExploreSvg
                                className={cn(
                                    "h-[25px] w-[25px] fill-foreground group-hover:fill-white dark:group-hover:fill-foreground",
                                    isDMLink ? variant === "explore" ? "fill-white dark:fill-foreground" : "" : ""
                                )}
                            />
                        )}
                    </div>
                </button>
            </ActionTooltip>
        </div>
    );
}
 
export default NavigationLink;