"use client"
import { Member, MemberRole, Server } from "@prisma/client"

type Props = {
    member: Member
    server: Server
    role?: MemberRole
}

const ServerMember = ({ member, server, role }: Props) => {
    return (
        <></>
    )
}
 
export default ServerMember