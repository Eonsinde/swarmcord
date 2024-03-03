"use client"
import { memo } from "react"

const FriendsBlank = () => {
    return (
        <div className="flex-1 relative flex flex-col space-y-2 overflow-hidden">
            <div className="absolute bottom-0 z-10 h-5/6 w-full bg-gradient-to-b from-zinc-300/5 dark:from-zinc-700/5 to-[#F2F3F5] dark:to-[#2B2C31]" />
            {new Array(30).fill(1).map((_, index) => (
                <div
                    key={index}
                    className="flex items-center space-x-2"
                >
                    <div className="h-8 w-8 bg-zinc-300/40 dark:bg-zinc-700/40 rounded-full" />
                    <div className="flex-1 h-6 bg-zinc-300/40 dark:bg-zinc-700/40 rounded-full" />
                </div>
            ))}
        </div>
    )
}
 
export default memo(FriendsBlank)