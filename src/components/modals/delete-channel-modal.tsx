"use client"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useModal } from "@/hooks/use-modal-store"
import axios from "axios"
import qs from "query-string"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const DeleteChannelModal = () => {
    const router = useRouter();
    const { isOpen, type, data, onClose } = useModal();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isModalOpen = useMemo(() => isOpen && type === "deleteChannel", [isOpen, type, data]);

    const handleLeave = async () => {
        setIsLoading(true);

        try {
            const url = qs.stringifyUrl({
                url: `/api/channels/${data?.channel?.id}`,
                query: {
                    serverId: data?.server?.id
                }
            });

            // TODO: return the server whose channel was deleted, including the default channel
            const res = await axios.delete(url);

            onClose();
            router.refresh();
            // TODO: use the response to redirect to the default server
            router.push(`/servers/${data?.server?.id}/${res.data.defaultChannel.id}`);
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
            <DialogContent className="max-w-[90%] sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Delete channel</DialogTitle>
                    <DialogDescription>
                        Are you sure want to remove this channel? <span className="font-semibold capitalize text-indigo-500">{data?.channel?.name}</span> will permanently be deleted
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="w-full flex justify-end items-center space-x-2">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleLeave}
                            disabled={isLoading}
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
 
export default DeleteChannelModal