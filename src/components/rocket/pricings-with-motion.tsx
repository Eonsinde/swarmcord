"use client"
import { useLayoutEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ArrowUpFromLine, Image, Server, Tv } from "lucide-react"
import { cn } from "@/lib/utils"
import { PLANS } from "@/config/payment-plans"
import { Button } from "../ui/button"

// Animation variants
const planVariants = {
    initial: { opacity: 0, zIndex: 10 }, // Start behind, invisible
    animate: { opacity: 1, zIndex: 20 }, // Fade in on top
    exit: { opacity: 0, zIndex: 10 },    // Fade out behind
};

const Pricings = () => {
    const [activePlan, setActivePlan] = useState<string>(PLANS[0].slug);
    const [containerHeight, setContainerHeight] = useState(0);
    const pricingContainerRef = useRef<HTMLDivElement>(null);
    const nextPlanRef = useRef<string | null>(null);
  
    // Initial height calculation on mount
    useLayoutEffect(() => {
        if (pricingContainerRef.current) {
            const initialPlanEl = pricingContainerRef.current.querySelector(`[data-plan="${activePlan}"]`);
            if (initialPlanEl instanceof HTMLElement) {
                setContainerHeight(initialPlanEl.offsetHeight);
                console.log("Initial calcHeight:", initialPlanEl.offsetHeight);
            }
        }
    }, []);
  
    const calcHeight = (el: HTMLElement) => {
        console.log("calcHeight called:", el.offsetHeight); // Your debug log
        setContainerHeight(el.offsetHeight);
    }
  
    const handleExit = (el: HTMLElement) => {
        if (pricingContainerRef.current) {
            setContainerHeight(pricingContainerRef.current.offsetHeight); // Preserve current height
            console.log("handleExit called:", pricingContainerRef.current.offsetHeight);
        }
    }
  
    const handleExited = () => {
        // Instead of zeroing, rely on calcHeight for the new plan
        console.log("handleExited called");
        if (nextPlanRef.current && pricingContainerRef.current) {
            const nextPlanEl = pricingContainerRef.current.querySelector(`[data-plan="${nextPlanRef.current}"]`);
            if (nextPlanEl instanceof HTMLElement) {
                calcHeight(nextPlanEl); // Ensure new plan height is set
                console.log("Post-exit calcHeight:", nextPlanEl.offsetHeight);
            }
        }
        nextPlanRef.current = null; // Reset
    }

    return (
        <div className="relative flex flex-col items-center gap-8">
            <div className="w-6/12 relative bg-gray-200/70 dark:bg-gray-100 flex gap-2 rounded-md p-1">
                <div
                    className={cn(
                        "absolute top-1 bottom-1 left-1 w-[calc(50%-0.5rem)] bg-indigo-600 rounded-md transition-transform duration-300 ease-in-out",
                        activePlan === "turbo" && "translate-x-[calc(100%+0.5rem)]"
                    )}
                />
                {PLANS.map((plan) => (
                    <button
                        key={plan.slug}
                        type="button"
                        onClick={() => setActivePlan(plan.slug)}
                        className={cn(
                            "relative flex-1 py-2 px-3 text-center font-semibold rounded-md transition-colors duration-300",
                            activePlan === plan.slug ? "text-white" : "text-gray-700 hover:text-gray-900",
                            "focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 z-10"
                        )}
                        aria-pressed={activePlan === plan.slug}
                    >
                        <span>{plan.name}</span>
                    </button>
                ))}
            </div>
            {/* Animated plan cards container */}
            <div className="relative w-full overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activePlan}
                        className={cn(
                            "w-full flex items-center py-12 sm:py-20 bg-gradient-to-r rounded-lg",
                            PLANS.find(p => p.slug === activePlan)?.gradient
                        )}
                        variants={planVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        layout // Auto-handles height transitions
                        data-plan={activePlan}
                        // style={{ backgroundImage: `linear-gradient(to right, ${PLANS.find(p => p.slug === activePlan)?.gradient})` }}
                    >
                        <div className="p-3 flex-1 flex flex-col justify-center items-center space-y-4">
                            <div>
                                <h1 className="font-archivo text-4xl sm:text-5xl text-white text-center">Rocket</h1>
                                <h3 className="font-archivo text-xl sm:text-2xl text-white">
                                    {PLANS.find((p) => p.slug === activePlan)?.name}
                                </h3>
                            </div>
                            <h3 className="font-archivo text-xl sm:text-2xl text-white capitalize">
                                ${PLANS.find((p) => p.slug === activePlan)?.pricing.amount} / month
                            </h3>
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-center">
                            <h3 className="font-archivo text-xl sm:text-2xl text-white">
                                {activePlan === "turbo" ? "Turbocharge your Swarmcord" : "Unlock the basics"}
                            </h3>
                            <div className="py-3 space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Server className="flex-shrink-0 h-5 w-5 text-white" />
                                    <p className="text-white">
                                        {PLANS.find((p) => p.slug === activePlan)?.quota}+ servers
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Image className="flex-shrink-0 h-5 w-5 text-white" />
                                    <p className="text-white">
                                        {PLANS.find((p) => p.slug === activePlan)?.coverImage
                                        ? "Server cover image"
                                        : "No server cover image"}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <ArrowUpFromLine className="flex-shrink-0 h-5 w-5 text-white" />
                                    <p className="text-white">
                                        {(PLANS.find((p) => p.slug === activePlan)?.imageSize || 0)}MB uploads
                                    </p>
                                </div>
                                {activePlan === "turbo" && (
                                    <div className="flex items-center space-x-2">
                                        <Tv className="flex-shrink-0 h-5 w-5 text-white" />
                                        <p className="text-white">HD streaming</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
 
export default Pricings