"use client"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useModal } from "@/hooks/use-modal-store"
import axios from "axios"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ServerType } from "@prisma/client"
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
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import FileUpload from "@/components/file-upload"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Server name is required"
    }),
    type: z.nativeEnum(ServerType),
    imageUrl: z.string()
});

const EditServerModal = () => {
    const router = useRouter();
    const { type, data, isOpen, onClose } = useModal();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isModalOpen = useMemo(() => isOpen && type === "editServer", [isOpen, type]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: data?.server?.name || "",
            type: data?.server?.type || ServerType.OPEN,
            imageUrl: data?.server?.imageUrl || ""
        }
    });

    useEffect(() => {
        if (data?.server) {
            form.setValue("name", data?.server?.name);
            form.setValue("type", data?.server?.type);
            form.setValue("imageUrl", data?.server?.imageUrl);
        }
    }, [data, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        try {
            await axios.patch(`/api/servers/${data?.server?.id}`, values);

            form.reset();
            router.refresh();
            onClose();
        } catch {
            // show error message
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog
            open={isModalOpen}
            onOpenChange={onClose}
        >
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Edit server</DialogTitle>
                    <DialogDescription>
                        Make changes to your server. You can also add a description and cover image
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        className="space-y-4"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            name="imageUrl"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <FileUpload
                                            value={field.value}
                                            endpoint="serverImage"
                                            onChange={field.onChange}
                                            disabled={isLoading}
                                            dropzoneOptions={{
                                                maxSize: (1024 * 1024) * 4
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-foreground">
                                        Server Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isLoading}
                                            placeholder="Enter server name"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="type"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-foreground">
                                        Server Type
                                    </FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="capitalize">
                                                <SelectValue placeholder="Select channel type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(ServerType).map((ct) => (
                                                <SelectItem
                                                    key={ct}
                                                    className="capitalize"
                                                    value={ct}
                                                >
                                                    {ct.toLowerCase()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={isLoading}
                            >
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default EditServerModal