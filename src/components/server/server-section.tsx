"use client"
import { useModal } from "@/hooks/use-modal-store"
import { ChannelType, MemberRole } from "@prisma/client"
import { Plus, Settings } from "lucide-react"
import ActionTooltip from "@/components/action-tooltip"
import { ServerWithMembersAndProfiles } from "../../../types"

type Props = {
    label: string
    role?: MemberRole
    sectionType: "channels" | "members"
    channelType?: ChannelType
    server?: ServerWithMembersAndProfiles
}

const ServerSection = ({
    label,
    role,
    sectionType,
    channelType,
    server
}: Props) => {
    const { onOpen } = useModal();

    return (
        <div className="flex justify-between items-center py-2">
            <p className="text-xs uppercase font-semibold text-muted-foreground">
                {label}
            </p>
            {role !== MemberRole.GUEST && sectionType === "channels" && (
                <ActionTooltip
                    label="Create Channel"
                    side="top"
                >
                    <button
                        className="text-muted-foreground"
                        onClick={() => onOpen("createChannel", { server, channel: { name: label, type: channelType! } })}
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </ActionTooltip>
            )}
            {role === MemberRole.ADMIN && sectionType === "members" && (
                <ActionTooltip
                    label="Manage Members"
                    side="top"
                >
                    <button
                        className="text-muted-foreground"
                        onClick={() => onOpen("manageMembers", { server })}
                    >
                        <Settings className="h-4 w-4" />
                    </button>
                </ActionTooltip>
            )}
        </div>
    );
}
 
export default ServerSection