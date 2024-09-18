"use client"
import { useSocket } from "@/providers/SocketProvider"
import { Badge } from "@/components/ui/badge"

const SocketIndicator = () => {
    const { isConnected } = useSocket();

    if (!isConnected)
        return (
            <Badge
                className="bg-yellow-600 text-white border-none"
                variant="outline"
            >
                Fallback<span className="hidden md:block">: Polling every 1s</span>
            </Badge>
        )
    
    return (
        <Badge
            className="bg-emerald-600 text-white border-none"
            variant="outline"
        >
            Live<span className="hidden md:block">: Real-time updates</span>
        </Badge>
    )
}

export default SocketIndicator