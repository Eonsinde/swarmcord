"use client"
import { useModal } from "@/hooks/use-modal-store"
import { Plus } from "lucide-react"
import ActionTooltip from "@/components/action-tooltip"

const NavigationAction = () => {
    const { onOpen } = useModal();

    return (
        <div>
            <ActionTooltip
                label="Add a server"
                side="right"
                align="center"
            >
                <button
                    className="group flex items-center"
                    onClick={() => onOpen("createServer")}
                >
                    <div className={`
                        flex
                        justify-center
                        items-center
                        h-[48px]
                        w-[48px]
                        mx-3
                        bg-background
                        group-hover:bg-emerald-500
                        rounded-[24px]
                        group-hover:rounded-[16px]
                        overflow-hidden
                        transition-all
                    `}>
                        <Plus
                            className="text-emerald-500 group-hover:text-white transition"
                            size={25}
                        />
                    </div>
                </button>
            </ActionTooltip>
        </div>
    );
}
 
export default NavigationAction;