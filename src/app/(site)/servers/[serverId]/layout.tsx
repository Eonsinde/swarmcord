import type { Metadata, ResolvingMetadata } from "next"
import Head from "next/head"
import { redirect } from "next/navigation"
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
    const server = await db.server.findUnique({
        where: {
            id: params.serverId
        }
    });
    
    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []
    
    return {
        title: `${server?.name} | Swarmcord`,
        description: server?.description || `${server?.name} server on swarmcord`,
        keywords: [server?.name || "", server?.description || "", `${server?.name} server`, `${server?.name} server on swarmcord`, `${server?.name} swarmcord`],
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
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if (!server)
        return redirect("/");

    return (
        <div className="h-full">
            <Head>
                <title>{server.name} | Swarmcord</title>
                <meta property="og:description" content={`${server.name} server on swarmcord`} key="description" />
                <meta property="og:keywords" content={`${server.name}, ${server?.description}, ${server.name} server, ${server.name} server on swarmcord, ${server.name} swarmcord`} key="keywords" />
            </Head>
            <div className="fixed inset-y-0 z-20 hidden md:flex h-full w-60 flex-col">
                <ServerSidebar serverId={params.serverId} />
            </div>
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
    )
}
 
export default ServerIdLayout