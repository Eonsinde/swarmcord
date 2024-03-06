"use client"
import { useParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import { Member, MemberRole, Profile, Server } from "@prisma/client"
import UserAvatar from "../user-avatar"

type Props = {
    member: Member & { profile: Profile }
    server: Server
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />
}

const ServerMember = ({ member, server }: Props) => {
    const params = useParams();
    const router = useRouter();

    const icon = roleIconMap[member.role];

    return (
        <button
            className={cn(
                "group p-2 mb-1 flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 rounded-md transition overflow-hidden",
                // params?.channelId === channel.id && "bg-zinc-700/20 hover:bg-zinc-700"
            )}
            onClick={() => router.push(`/me/${member.profileId}`)}
        >
            <div className="flex-1 flex items-center overflow-hidden">
                <UserAvatar
                    className="h-8 w-8 md:h-8 md:w-8"
                    src={member.profile.imageUrl}
                    initials={member.profile.name[0]}
                />
                <p className="ml-2 text-left font-semibold text-sm text-muted-foreground group-hover:text-foreground transition">
                    {member.profile.name}
                </p>
            </div>
            {icon}
        </button>
    )
}
 
export default ServerMember