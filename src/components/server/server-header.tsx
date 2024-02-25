"use client"
import { useModal } from "@/hooks/use-modal-store"
import { MemberRole } from "@prisma/client"
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { ServerWithMembersAndProfiles } from "../../../types"

type Props = {
    server: ServerWithMembersAndProfiles
    role?: MemberRole   
}

const ServerHeader = ({ server, role }: Props) => {
    const { onOpen } = useModal();

    const isAdmin = role === MemberRole.ADMIN;
    const isModerator = isAdmin || role === MemberRole.MODERATOR;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="group flex items-center h-12 w-full px-3 capitalize border-b-2 border-secondary hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition overflow-hidden">
                    <div className="relative flex-1 flex overflow-hidden">
                        <span className="mr-auto truncate text-clip">{server.name}</span>
                        {/* <div className="absolute top-0 right-0 h-full w-[10px] bg-gradient-to-l from-[#2B2C31] group-hover:opacity-0 transition-opacity delay-300" /> */}
                    </div>
                    <ChevronDown className="h-5 w-5 ml-2" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 text-xs font-medium space-y-[2px]">
                <DropdownMenuItem
                    className="hover:bg-indigo-600 focus:bg-indigo-600 text-indigo-600 hover:text-white focus:hover:text-white py-2 px-3 cursor-pointer"
                    onClick={() => onOpen("invite", { server, isAdmin })}
                >
                    Invite User
                    <UserPlus className="h-4 w-4 ml-auto" />
                </DropdownMenuItem>
                {isModerator && (
                    <DropdownMenuItem
                        className="hover:bg-indigo-600 focus:bg-indigo-600 hover:text-white focus:text-white py-2 px-3 cursor-pointer"
                        onClick={() => onOpen("createChannel", { server })}
                    >
                        Create Channel
                        <PlusCircle className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        className="hover:bg-indigo-600 focus:bg-indigo-600 hover:text-white focus:text-white py-2 px-3 cursor-pointer"
                        onClick={() => onOpen("manageMembers", { server })}
                    >
                        Manage Members
                        <Users className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        className="hover:bg-indigo-600 focus:bg-indigo-600 hover:text-white focus:text-white py-2 px-3 cursor-pointer"
                        onClick={() => onOpen("editServer", { server })}
                    >
                        Server Settings
                        <Settings className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="my-2 mx-2 bg-[#484d56]" />
                {!isAdmin && (
                    <DropdownMenuItem
                        className="hover:bg-rose-500 focus:bg-rose-500 text-rose-500 hover:text-white focus:text-white py-2 px-3 cursor-pointer"
                        onClick={() => onOpen("leaveServer", { server })}
                    >
                        Leave Server
                        <LogOut className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        className="hover:bg-rose-500 focus:bg-rose-500 text-rose-500 hover:text-white focus:text-white py-2 px-3 cursor-pointer"
                        onClick={() => onOpen("deleteServer", { server })}
                    >
                        Delete Server
                        <Trash className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
 
export default ServerHeader