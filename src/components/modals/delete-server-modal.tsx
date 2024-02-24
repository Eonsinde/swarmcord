"use client"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useModal } from "@/hooks/use-modal-store"
import axios from "axios"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const DeleteServerModal = () => {
    const router = useRouter();
    const { isOpen, type, data, onClose } = useModal();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isModalOpen = useMemo(() => isOpen && type === "deleteServer", [isOpen, type, data]);

    const handleLeave = async () => {
        setIsLoading(true);

        try {
            await axios.delete(`/api/servers/${data?.server?.id}`);

            onClose();
            router.refresh();
            router.push("/");
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
                    <DialogTitle>Delete Server</DialogTitle>
                    <DialogDescription>
                        Are you sure want to remove this server. <span className="font-semibold capitalize text-indigo-500">{data?.server?.name}?</span> will permanently be deleted
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
 
export default DeleteServerModal