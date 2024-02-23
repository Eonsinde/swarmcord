"use client"
import { useMemo, useState } from "react"
import { useModal } from "@/hooks/use-modal-store"
import qs from "query-string"
import { MemberRole } from "@prisma/client"
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuPortal,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import UserAvatar from "@/components/user-avatar"
import { ServerWithMembersAndProfiles } from "../../../types"
import axios from "axios"
import { useRouter } from "next/navigation"

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />
}

const MembersModal = () => {
    const router = useRouter();
    const { isOpen, data, type, onOpen, onClose } = useModal();

    const [loadingId, setLoadingId] = useState<string>("");

    const { server } = data as { server: ServerWithMembersAndProfiles };

    const isModalOpen = useMemo(() => isOpen && type === "manageMembers", [isOpen, type, data]);

    const handleKick = async (memberId: string) => {
        setLoadingId(memberId);

        try {
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id
                }
            });

            const response = await axios.delete(url);

            router.refresh();
            // update the modal
            onOpen("manageMembers", { server: response.data })
        } catch (error) {
            console.log("members-modal:", error);
        } finally {
            setLoadingId("");
        }
    }

    const handleRoleChange = async (memberId: string, role: MemberRole) => {
        setLoadingId(memberId);

        try {
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id
                }
            });

            const response = await axios.patch(url, { role });

            router.refresh();
            // update the modal
            onOpen("manageMembers", { server: response.data })
        } catch (error) {
            console.log("members-modal:", error);
        } finally {
            setLoadingId("");
        }
    }

    return (
        <Dialog
            open={isModalOpen}
            onOpenChange={onClose}
        >
            <DialogContent className="max-w-[90%] sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Manage Members</DialogTitle>
                    <DialogDescription>
                        {server?.members?.length} Members
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-6 max-h-[420px] pr-6">
                    {server?.members?.map((member) => (
                        <div
                            key={member.id}
                            className="flex justify-between items-center mb-6"
                        >
                            <div className="flex items-center gap-x-2">
                                <UserAvatar
                                    src={member.profile.imageUrl}
                                    initials={member.profile.name[0]}
                                />
                                <div className="flex flex-col gap-y-1">
                                    <div className="flex items-center gap-x-1 text-xs font-semibold capitalize">
                                        {member.profile.name}
                                        {roleIconMap[member.role]}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {member.profile.email}
                                    </p>
                                </div>
                            </div>
                            {server.creatorId !== member.profileId && loadingId !== member.id && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <MoreVertical  className="h-4 w-4" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" side="bottom">
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>
                                                <ShieldQuestion className="h-4 w-4 mr-2" />
                                                <span>Role</span>
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent>
                                                    <DropdownMenuItem onClick={() => handleRoleChange(member.id, "GUEST")}>
                                                        <Shield className="h-4 w-4 mr-2" />
                                                        Guest
                                                        {member.role === "GUEST" && (
                                                            <Check className="h-4 w-4 ml-auto" />
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleRoleChange(member.id, "MODERATOR")}>
                                                        <ShieldCheck className="h-4 w-4 mr-2" />
                                                        Moderator
                                                        {member.role === "MODERATOR" && (
                                                            <Check className="h-4 w-4 ml-auto" />
                                                        )}
                                                    </DropdownMenuItem>
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleKick(member.id)}>
                                            <Gavel className="h-4 w-4 mr-2" />
                                            Kick
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                            {(loadingId === member.id) && (
                                <Loader2 className="h-4 w-4 ml-auto animate-spin" />
                            )}
                        </div>
                    ))}             
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
 
export default MembersModal;