"use client"
import { useCallback, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useModal } from "@/hooks/use-modal-store"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { icons } from "lucide-react"
import ActionTooltip from "@/components/action-tooltip"
import SwarmSvg from "../../../public/svgs/mask.svg"

const variants = cva(
    "flex justify-center items-center h-[48px] w-[48px] mx-3 bg-background rounded-[24px] group-hover:rounded-[16px] overflow-hidden transition-all",
    {
        variants: {
            variant: {
                createServer: "group-hover:bg-emerald-500",
                directMessages: "group-hover:bg-purple-500"
            }
        },
        defaultVariants: {
            variant: "createServer"
        }
    }
);

const textVariants = cva(
    "transition",
    {
        variants: {
            variant: {
                createServer: "text-emerald-500 group-hover:text-white transition",
                directMessages: "text-white"
            }
        },
        defaultVariants: {
            variant: "createServer"
        }
    }
);

type Props = VariantProps<typeof variants> & {
    iconName?: string
}

const NavigationAction = ({ variant="createServer", iconName="ban" }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const { onOpen } = useModal();

    const trailingString = useMemo(() => pathname.slice(pathname.lastIndexOf("/")+1), [pathname]);

    // console.log("trailingString", trailingString, pathname);

    const CustomIcon = useMemo(() => {
        if (variant === "createServer")
            return icons["Plus"];
        else if (variant === "directMessages")
            return null;
        //@ts-expect-error
        return icons[iconName];
    }, [variant]);

    const label = useMemo(() => {
        if (variant ===  "createServer")
            return "Add a Server";
        else if (variant === "directMessages")
            return "Direct Messages";
        return "Unidentified variant";
    }, [variant]);

    const handleClick = useCallback(() => {
        if (variant ===  "createServer")
            return onOpen("createServer");
        else if (variant === "directMessages")
            return router.push(`/me`);
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
                            (trailingString !== "me" && trailingString !== "rocket") ? variant === "directMessages" ? "group-hover:h-[20px]" : "" : "",
                            (trailingString === "me" || trailingString === "rocket") ? variant === "directMessages" ? "h-[36px]" : "" : ""
                        )}
                    />
                    <div
                        className={cn(
                            variants({ variant }),
                            (trailingString === "me" || trailingString === "rocket") ? variant === "directMessages" ? "bg-purple-500" : "" : "",
                            (trailingString === "me" || trailingString === "rocket") ? variant === "directMessages" ? "rounded-[16px]" : "" : ""
                        )}
                    >
                        {CustomIcon ? (
                            <CustomIcon
                                className={cn(
                                    "text-emerald-500 group-hover:text-white dark:group-hover:text-foreground",
                                    (trailingString === "me" || trailingString === "rocket") ? variant === "directMessages" ? "text-white dark:text-foreground" : "" : ""
                                )}
                                size={25}
                            />
                        ) : (
                            <SwarmSvg
                                className={cn(
                                    "h-[25px] w-[25px] fill-foreground group-hover:fill-white dark:group-hover:fill-foreground",
                                    (trailingString === "me" || trailingString === "rocket") ? variant === "directMessages" ? "fill-white dark:fill-foreground" : "" : ""
                                )}
                            />
                        )}
                       
                    </div>
                </button>
            </ActionTooltip>
        </div>
    );
}
 
export default NavigationAction;