import Head from "next/head"
import { Handshake } from "lucide-react"
import MobileToggleMe from "@/components/mobile-toggle-me"

const Me = () => {
    return (
        <div>
            <Head>
                <title>Direct Messages | Swarmcord</title>
                <meta property="og:description" content="Engage in conversations with your friends from all over swarmcord" key="description" />
                <meta property="og:keywords" content="swarmcord direct messages, swarmcord DM" key="keywords" />
            </Head>
            <header className="flex items-center gap-x-2 h-12 px-3 border-b-2 border-secondary">
                <MobileToggleMe />
                <div className="group flex items-center gap-x-2">
                    <Handshake
                        className="flex-shrink-0 h-5 w-5 text-muted-foreground"
                    />
                    <p className="capitalize line-clamp-1 font-semibold text-base text-foreground">
                        Friends
                    </p>
                </div>
            </header>
            <main className="relative">
                
            </main>
        </div>
    )
}
 
export default Me