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

const LeaveServerModal = () => {
    const router = useRouter();
    const { isOpen, type, data, onClose } = useModal();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isModalOpen = useMemo(() => isOpen && type === "leaveServer", [isOpen, type, data]);

    const handleLeave = async () => {
        setIsLoading(true);

        try {
            await axios.patch(`/api/servers/${data?.server?.id}/leave`, {});

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
                    <DialogTitle>Leave Server</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to leave server <span className="font-semibold capitalize text-indigo-500">{data?.server?.name}?</span>
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
                            Continue
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
 
export default LeaveServerModal