import type { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"
import { redirectToSignIn } from "@clerk/nextjs"
import { db } from "@/lib/db"
import { currentProfile } from "@/lib/current-profile"
import ServerSidebar from "@/components/server/server-sidebar"

type Props = {
    children: React.ReactNode,
    params: { serverId: string, channelId: string }
}
 
export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // fetch data using params
    const res = await db.server.findUnique({
        where: {
            id: params.serverId
        }
    });

    const server = res || { name: "Server not found", description: "Server not found" };
    
    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []
    
    return {
        title: `${server?.name} | Swarmcord`,
        description: server?.description || `${server?.name} server on swarmcord`,
        keywords: [server?.name, server?.description || "", `${server?.name} server`, `${server?.name} server on swarmcord`, `${server?.name} swarmcord`],
        openGraph: {
            images: ['/some-specific-page-image.jpg', ...previousImages],
        },
    }
}

const ServerIdLayout = async ({
    children,
    params
}: {
    children: React.ReactNode,
    params: { serverId: string, channelId: string }
}) => {
    const profile = await currentProfile();

    if (!profile)
        return redirectToSignIn();

    const server = await db.server.findUnique({
        where: {
            id: params.serverId
        }
    });

    if (!server)
        return notFound();

    return (
        <div className="h-full">
            <div className="fixed inset-y-0 z-20 hidden md:flex h-full w-[300px] flex-col">
                <ServerSidebar serverId={params.serverId} />
            </div>
            <main className="h-full md:pl-[300px]">
                {children}
            </main>
        </div>
    )
}
 
export default ServerIdLayout