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
    const profile = await currentProfile();

    if (!profile)
        return redirectToSignIn();

    if (!inviteCode)
        return redirect("/");

    // check if user already in the server
    const existingInServer = await db.server.findFirst({
        where: {
            inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    // if user in server, just redirect to server
    if (existingInServer)
        return redirect(`/servers/${existingInServer.id}`);

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
        }
    });
 
    if (server)
        return redirect(`/servers/${server.id}`);
    
    return null;
}
 
export default Invite;