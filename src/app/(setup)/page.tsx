"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { cn } from "@/lib/utils"
import { getOrCreateProfile } from "@/lib/initial-profile"
import { Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import SwarmSvg from "../../../public/svgs/mask.svg"

const NOTES = [
    "Our Rocket subscription program has two options; Basic & Turbo",
    "Your free account is allowed to create just 5 servers",
    "With the Basic plan, you can create up to 10+ servers 💻",
    "With the Turbo plan, you can create unlimited 18+ servers 🖥️",
    "We use a third party application for authentication 😁; Your data is safe nonetheless",
    "You can customize your server with features like a cover image, and access control 🚀"
];

const SetupPage = () => {
    const router = useRouter();

    const [currentNote, setCurrentNote] = useState<number>(0);
    const [hasFailed, setHasFailed] = useState<boolean>(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentNote((prev) => (prev + 1) % NOTES.length);
        }, 6500);
  
        return () => clearInterval(interval);
    }, []);

    const { data, isPending, isError, isPaused, isSuccess, error, isRefetching, refetch } = useQuery({
        queryKey: [undefined],
        queryFn: async () => {
            const profile = await getOrCreateProfile();
            return profile;
        },
        refetchOnWindowFocus: false,
        retry: false
    });

    // Track when an error occurs
    useEffect(() => {
        if (isError || isPaused) {
            setHasFailed(true);
        }
    }, [isError, isPaused]);

    useEffect(() => {
        if (isSuccess) {
            router.push("/me");
        }
    }, [isSuccess]);

    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <div className="w-5/12 flex flex-col gap-4">
                <div className="relative flex justify-center items-center">
                    {/* <Loader2 className={cn("absolute size-44 stroke-[1px]", isPending && "animate-spin")} /> */}
                    <SwarmSvg className={cn("size-24 fill-foreground", isPending && "animate-bounce")} />
                </div>
                <div className="space-y-4 text-center">
                    <div className="space-y-2">
                        {hasFailed || (isError || isPaused) ? (
                            <div className="space-y-2 text-center">
                                <p className="font-semibold text-foreground">
                                    Something went terribly wrong
                                </p>
                                <Button
                                    className="gap-2"
                                    variant="primary"
                                    // disabled={isPending}
                                    onClick={() => refetch()}
                                >
                                    <span>{isPending ? "Retrying" : "Retry"}</span>
                                    <RefreshCw className={cn("size-4", isPending && "animate-spin")} />
                                </Button>
                            </div>
                        ) : isPending && !isRefetching ? (
                            <p className="font-semibold text-foreground">
                                Setting up your profile, <span className="italic">please wait...</span>
                            </p>
                        ) : (
                            <p className="font-semibold text-foreground">
                                Profile setup completed, <span className="italic text-indigo-600">redirecting...</span>
                            </p>
                        )}
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={currentNote}
                            className="text-sm text-indigo-600"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                        >
                            {NOTES[currentNote]}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default SetupPage