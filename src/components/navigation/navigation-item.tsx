"use client"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import ActionTooltip from "@/components/action-tooltip"

type Props = {
    id: string
    name: string
    imageUrl: string
}

const NavigationItem = ({ id, name, imageUrl }: Props) => {
    const params = useParams<{ serverId: string }>();
    const router = useRouter();

    const onClick = () => {
        router.push(`/servers/${id}`);
    }

    return (
        <ActionTooltip
            label={name}
            side="right"
            align="center"
        >
            <button
                className="group relative flex items-center"
                onClick={onClick}
            >
                <div
                    className={cn(
                        "bg-primary absolute left-0 w-[4px] rounded-r-full transition-all",
                        params?.serverId !== id && "group-hover:h-[20px]",
                        params?.serverId === id ? "h-[36px]" : "h-[8px]"
                    )}
                />
                <div className={cn(
                    "relative group h-[48px] w-[48px] flex mx-3 rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
                    params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]"
                )}>
                    <Image
                        className="object-cover"
                        src={imageUrl}
                        fill
                        alt={`${name} channel`}
                        placeholder="empty"
                    />
                </div>
            </button>
        </ActionTooltip>
    );
}
 
export default NavigationItem;