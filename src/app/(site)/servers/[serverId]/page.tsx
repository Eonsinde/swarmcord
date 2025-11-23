import { redirect, notFound } from "next/navigation"
import { redirectToSignIn } from "@clerk/nextjs"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"

type Props = {
    params: {
        serverId: string
    }
}

const ServerIdPage = async ({ params }: Props) => {
    // if a request is made to this route, redirect user to the default channel
    // for the given server ID or a not-found page if channel isn't valid
    const profile = await currentProfile();

    if (!profile)
        return redirectToSignIn();

    const server = await db.server.findUnique({
        where: {
            id: params.serverId
        },
        include: {
            channels: {
                where: {
                    default: true
                },
                take: 1
            }
        }
    });

    if (!server)
        return notFound();

    const defaultChannel = server?.channels[0];

    if (!defaultChannel)
        return null;

    return redirect(`/servers/${params.serverId}/${defaultChannel.id}`);
}
 
export default ServerIdPage