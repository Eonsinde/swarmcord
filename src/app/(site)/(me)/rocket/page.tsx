import { ArrowUpFromLine, Rocket, Server, Tv } from "lucide-react"
import CoverSvg from "../../../../../public/svgs/rocket-cover.svg"

const Ultimate = () => {
    return (
        <div>
            <header className="border-b-2 border-secondary">
                <div className="group p-2 mb-1 flex items-center gap-x-2">
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
                <div className="w-10/12 py-14 mx-auto space-y-6">
                    <h1 className="w-6/12 mx-auto font-archivo text-5xl text-center text-foreground">Accelerate your fun with Rocket</h1>
                    <div className="z-10 flex items-center w-8/12 mx-auto py-20  bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                        <div className="p-3 flex-1 flex flex-col justify-center items-center">
                            <h1 className="font-archivo text-5xl text-center text-foreground">Rocket</h1>
                            <h3 className="text-white">$9.99 / month</h3>
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-center">
                            <h3 className="font-archivo text-2xl text-white">Turbocharge your Swarmcord</h3>
                            <div className="py-3 space-y-2">
                                <div className="flex item-center space-x-2">
                                    <Server className="flex-shrink-0 h-5 w-5 text-white" />
                                    <p>30+ servers</p>
                                </div>
                                <div className="flex item-center space-x-2">
                                    <ArrowUpFromLine className="flex-shrink-0 h-5 w-5 text-white" />
                                    <p>500MB uploads</p>
                                </div>
                                <div className="flex item-center space-x-2">
                                    <Tv className="flex-shrink-0 h-5 w-5 text-white" />
                                    <p>HD streaming</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
 
export default Ultimate