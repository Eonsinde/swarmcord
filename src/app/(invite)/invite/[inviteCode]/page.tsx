import { redirectToSignIn } from "@clerk/nextjs"
import { currentProfile } from "@/lib/current-profile"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"

type Props = {
    params: {
        inviteCode: string
    }
}

const Invite = async ({ params: { inviteCode } }: Props) => {
    // TODO: make this a client component, add a loading state for better UX
    const profile = await currentProfile();

    if (!profile)
        return redirectToSignIn();

    if (!inviteCode)
        return redirect("/");

    // check if user already in the server
    const existingServer = await db.server.findFirst({
        where: {
            inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        },
        include: {
            channels: {
                where: {
                    name: "general"
                },
                orderBy: {
                    createdAt: "asc"
                }
            }
        }
    });

    // if user in server, just redirect to server
    if (existingServer)
        return redirect(`/servers/${existingServer.id}/${existingServer.channels[0].id}`);

    // user not in server, add user to the members of the server    
    const server = await db.server.update({
        where: {
            inviteCode
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id
                    }
                ]
            }
        },
        include: {
            channels: {
                where: {
                    name: "general"
                },
                orderBy: {
                    createdAt: "asc"
                }
            }
        }
    });
 
    if (server)
        return redirect(`/servers/${server.id}/${server.channels[0].id}`);
    

    // TODO: render loading screen here instead of a blank page
    return null;
}
 
export default Invite;