"use client"
import { useState } from "react"
import { CSSTransition } from "react-transition-group"
import { ArrowUpFromLine, Image, Server, Tv } from "lucide-react"
import { Button } from "../ui/button"

type Props = {
    pricings?: any[]
}

const Pricings = ({ pricings }: Props) => {
    const [activePage, setActivePage] = useState<"turbo" | "basic">("turbo");

    const calcHeight = () => {

    }
    
    const handleClick = () => {
        if (activePage === "basic")
            setActivePage("turbo");
        else
            setActivePage("basic");
    }

    return (
        <div className="">
            <Button
                className="my-6 mx-auto capitalize"
                variant="primary"
                onClick={handleClick}
            >
                {activePage}
            </Button>
            <CSSTransition
                classNames="pricing-menu-primary"
                in={activePage === "turbo"} 
                unmountOnExit
                onEnter={calcHeight}
                timeout={500}
            >
                <div className="absolute pricing-menu flex items-center w-8/12 mx-auto py-20  bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
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
            </CSSTransition>
            <CSSTransition
                classNames="pricing-menu-secondary"
                in={activePage === "basic"} 
                unmountOnExit
                onEnter={calcHeight}
                timeout={500}
            >
                <div className="absolute pricing-menu flex items-center w-8/12 mx-auto py-20 bg-gradient-to-r from-blue-700 to-blue-400 rounded-lg">
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
            </CSSTransition>
        </div>
    )
}
 
export default Pricings