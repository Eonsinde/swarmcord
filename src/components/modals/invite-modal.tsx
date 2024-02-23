"use client"
import { useCallback, useMemo, useState } from "react"
import { useModal } from "@/hooks/use-modal-store"
import useCurrentUrl from "@/hooks/use-current-url"
import axios from "axios"
import { Check, Copy, RefreshCcw } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const InviteModal = () => {
    const { isOpen, type, data, onOpen, onClose } = useModal();
    const currentUrl = useCurrentUrl();

    const [copied, setCopied] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isModalOpen = useMemo(() => isOpen && type === "invite", [isOpen, type, data]);
    const inviteUrl = useMemo(() => `${currentUrl}/invite/${data?.server?.inviteCode}`, [currentUrl, isOpen, type, data]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout(() => setCopied(false), 1500);
    }, [inviteUrl]);

    const generateNewLink = async () => {
        try {
            setIsLoading(true);

            const response = await axios.patch(`/api/servers/${data?.server?.id}/invite-code`);
            onOpen("invite", { server: response.data, isAdmin: true });
        } catch (error) {

        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog
            open={isModalOpen}
            onOpenChange={onClose}
        >
            <DialogContent className="max-w-[90%] sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Invite friends to <span className="capitalize">{data?.server?.name}</span></DialogTitle>
                    <DialogDescription>
                        Share this link to grants others access to this server
                    </DialogDescription>
                </DialogHeader>
                <div className="bg-accent py-2 px-3 flex items-center rounded-md overflow-hidden">
                    <div className="flex-1 overflow-hidden">
                        <p
                            className="text-foreground text-sm truncate"
                            // onClick=
                        >
                            {inviteUrl}
                        </p>
                    </div>
                    <Button
                        className="ml-2 py-1 px-3"
                        variant="primary"
                        onClick={handleCopy}
                        disabled={isLoading}
                    >
                        {copied
                        ?
                        <Check className="h-4 w-4" />
                        :
                        <Copy className="h-4 w-4" />}
                    </Button>
                </div>
                {data?.isAdmin && (
                    <Button
                        className="w-fit mx-auto"
                        variant="link"
                        onClick={generateNewLink}
                        disabled={isLoading}
                    >
                        Generate a new link
                        <RefreshCcw className="h-4 w-4 ml-2" />
                    </Button>
                )}
            </DialogContent>
        </Dialog>
    );
}
 
export default InviteModal;