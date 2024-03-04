import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { getOrCreateProfile } from "@/lib/initial-profile"
import InitialModal from "@/components/modals/initial-modal"

const SetupPage = async () => {
    const profile = await getOrCreateProfile();
    
    const server = await db.server.findFirst({
        where: {
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
                }
            }
        }
    });

    if (server)
        // return redirect(`/servers/${server.id}/${server.channels[0].id}`);
        return redirect("/me");

    return (
        <InitialModal />
    )
}
 
export default SetupPage