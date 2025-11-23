"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
// import { RefreshCw } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { Server, ServerType } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
    server: Server
}

const RequestServerAccess = ({ server }: Props) => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const handleSubmit = async () => {
        setIsError(false);

        try {
            setIsLoading(true);

            await axios.post(`/api/servers/${server.id}/request-access`, {});
        
            if (server.type === ServerType.OPEN) {
                return router.push(`/invite/${server.inviteCode}`);
            }

            toast("Request awaiting approval", { position: "bottom-center" });
        } catch (e: any) {
            setIsError(true);

            toast(e?.response?.data ?? "Something went wrong", { position: "bottom-center" });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button
            className={cn("gap-2", isLoading && "italic")}
            disabled={isLoading}
            onClick={handleSubmit}
        >
            <span>
                {isLoading ? "Requesting Access..." : isError ? "Retry" : "Join Server"}
            </span>
            {/* {isError && (<RefreshCw className="animate-spin" />)} */}
        </Button>
    )
}
 
export default RequestServerAccess