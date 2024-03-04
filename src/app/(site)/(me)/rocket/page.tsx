import { ArrowUpFromLine, Image, Rocket, Server, Tv } from "lucide-react"
import CoverSvg from "../../../../../public/svgs/rocket-cover.svg"

const Ultimate = () => {
    return (
        <div className="h-full">
            <header className="flex items-center h-12 px-3 border-b-2 border-secondary">
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
                    <div className="flex items-center w-8/12 mx-auto py-20  bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                        <div className="p-3 flex-1 flex flex-col justify-center items-center space-y-4">
                            <div>
                                <h1 className="font-archivo text-5xl text-white text-center text-foreground">Rocket</h1>
                                <h3 className="font-archivo text-2xl text-white">TURBO</h3>
                            </div>
                            <h3 className="font-archivo text-2xl text-white capitalize">$9.99 / month</h3>
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-center">
                            <h3 className="font-archivo text-2xl text-white">Turbocharge your Swarmcord</h3>
                            <div className="py-3 space-y-2">
                                <div className="flex item-center space-x-2">
                                    <Server className="flex-shrink-0 h-5 w-5 text-white" />
                                    <p className="text-white">15+ servers</p>
                                </div>
                                <div className="flex item-center space-x-2">
                                    <Image className="flex-shrink-0 h-5 w-5 text-white" />
                                    <p className="text-white">Server cover image</p>
                                </div>
                                <div className="flex item-center space-x-2">
                                    <ArrowUpFromLine className="flex-shrink-0 h-5 w-5 text-white" />
                                    <p className="text-white">10MB uploads</p>
                                </div>
                                <div className="flex item-center space-x-2">
                                    <Tv className="flex-shrink-0 h-5 w-5 text-white" />
                                    <p className="text-white">HD streaming</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="z-10 flex items-center w-8/12 mx-auto py-20 bg-gradient-to-r from-blue-700 to-blue-400 rounded-lg">
                        <div className="p-3 flex-1 flex flex-col justify-center items-center space-y-4">
                            <div>
                                <h1 className="font-archivo text-5xl text-white text-center text-foreground">Rocket</h1>
                                <h3 className="font-archivo text-2xl text-white">BASIC</h3>
                            </div>
                            <h3 className="font-archivo text-2xl text-white capitalize">$5.99 / month</h3>
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-center">
                            <h3 className="font-archivo text-2xl text-white">Unlock the basics</h3>
                            <div className="py-3 space-y-2">
                                <div className="flex item-center space-x-2">
                                    <Server className="flex-shrink-0 h-5 w-5 text-white" />
                                    <p className="text-white">5+ servers</p>
                                </div>
                                <div className="flex item-center space-x-2">
                                    <Image className="flex-shrink-0 h-5 w-5 text-white" />
                                    <p className="text-white">Server cover image</p>
                                </div>
                                <div className="flex item-center space-x-2">
                                    <ArrowUpFromLine className="flex-shrink-0 h-5 w-5 text-white" />
                                    <p className="text-white">5MB uploads</p>
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