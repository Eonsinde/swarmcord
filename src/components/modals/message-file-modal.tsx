"use client"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useModal } from "@/hooks/use-modal-store"
import axios from "axios"
import qs from "query-string"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form"
import FileUpload from "@/components/file-upload"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
    fileUrl: z.string()
});

const MessageFileModal = () => {
    const router = useRouter();

    const { type, isOpen, data, onClose } = useModal();

    const isModalOpen = useMemo(() => isOpen && type === "messageFile", [isOpen, type, data]);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: ""
        }
    });

    const handleClose = () => {
        form.reset();
        onClose();
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        try {
            const url = qs.stringifyUrl({
                url: data?.apiUrl || "",
                query: data?.query
            });

            await axios.post(url, {
                content: values.fileUrl,
                ...values
            });

            router.refresh();
            handleClose();
        } catch {
            // show error message
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog
            open={isModalOpen}
            onOpenChange={handleClose}
        >
            <DialogContent
                className="max-w-full md:max-w-[425px] p-0"
                showCloseBtn
            >
                <DialogHeader className=" pt-5 px-5">
                    <DialogTitle>Add an attachment</DialogTitle>
                    <DialogDescription>
                        Send a file as a message
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="pt-4 pb-10 px-5">
                            <FormField
                                name="fileUrl"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload
                                                value={field.value}
                                                endpoint="serverImage"
                                                label="(IMG | PDF)"
                                                onChange={field.onChange}
                                                disabled={isLoading}
                                                dropzoneOptions={{
                                                    // TODO: check user subscription to determine max file size
                                                    maxSize: (1024 * 1024) * 4,
                                                    accept: { "image/*": [], "application/pdf": [] }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-[#F2F3F5] dark:bg-[#2B2C31] p-5 space-y-2">
                            <Button
                                className="w-full"
                                type="submit"
                                variant="primary"
                                onClick={form.handleSubmit(onSubmit)}
                                disabled={isLoading}
                            >
                                Send
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default MessageFileModal