"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import axios from "axios"
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
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import FileUpload from "@/components/file-upload"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Server name is required"
    }),
    imageUrl: z.string().min(2, {
        message: "Server image is required"
    }),
});

const InitialModal = () => {
    const router = useRouter();

    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: ""
        }
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        try {
            await axios.post("/api/servers", values);

            form.reset();
            router.refresh();
            window.location.reload();
        } catch {
            // show error message
        } finally {
            setIsLoading(false);
        }
    }

    if (!isMounted)
        return null;

    return (
        <Dialog open>
            <DialogContent
                className="sm:max-w-[425px]"
                showCloseBtn={false}
            >
                <DialogHeader>
                    <DialogTitle>Customize your server</DialogTitle>
                    <DialogDescription>
                        Give your server a personality with a name and image.
                        You can always change it later
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
                        <DialogFooter>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={isLoading}
                            >
                                Create Server
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default InitialModal