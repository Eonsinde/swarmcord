"use client"
import { useCallback, useMemo } from "react"
import { useModal } from "@/hooks/use-modal-store"
import { cn } from "@/lib/utils"
import { icons } from "lucide-react"
import ActionTooltip from "@/components/action-tooltip"

type Props = {
    iconName: string
}

const NavigationAction = ({ iconName }: Props) => {
    const { onOpen } = useModal();

    const CustomIcon = useMemo(() => {
        //@ts-expect-error
        return icons[iconName];
    }, []);

    const label = useMemo(() => {
        return "Add Server";
    }, []);

    const handleClick = useCallback(() => {
        return onOpen("createServer");
    }, []);

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
                        className="flex justify-center items-center h-[48px] w-[48px] mx-3 bg-background group-hover:bg-emerald-500 rounded-[24px] group-hover:rounded-[16px] overflow-hidden transition-all"
                    >
                        <CustomIcon
                            className={cn(
                                "text-emerald-500 group-hover:text-white dark:group-hover:text-foreground"
                            )}
                            size={25}
                        />
                    </div>
                </button>
            </ActionTooltip>
        </div>
    )
}
 
export default NavigationAction