import Head from "next/head"
import { Rocket } from "lucide-react"
import Pricings from "@/components/rocket/pricings"
import MobileToggleMe from "@/components/mobile-toggle-me"
import CoverSvg from "../../../../../public/svgs/rocket-cover.svg"

const RocketPage = () => {
    return (
        <div className="h-full">
            <Head>
                <title>Rocket | Swarmcord</title>
                <meta property="og:description" content="Unlock more features in swarmcord with Rocket Turbo | Basic" key="description" />
                <meta property="og:keywords" content="swarmcord rocket, swarmcord rocket turbo, swarmcord rocket basic, swarmcord premium plans" key="keywords" />
            </Head>
            <header className="flex items-center gap-x-2 h-12 px-3 border-b-2 border-secondary">
                <MobileToggleMe />
                <div className="group flex items-center gap-x-2">
                    <Rocket
                        className="flex-shrink-0 h-5 w-5 text-muted-foreground"
                    />
                    <p className="capitalize line-clamp-1 font-semibold text-base text-foreground">
                        Rocket
                    </p>
                </div>
            </header>
            <main className="relative">
                <CoverSvg className="absolute top-0 right-0 z-0" />
                <div className="z-10 w-10/12 py-14 mx-auto space-y-6">
                    <h1 className="w-6/12 mx-auto font-archivo text-5xl text-center text-foreground">Accelerate your fun with Rocket</h1>
                    <Pricings />
                </div>
            </main>
        </div>
    )
}
 
export default RocketPage