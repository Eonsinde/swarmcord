"use client"
import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useModal } from "@/hooks/use-modal-store"
import axios from "axios"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import qs from "query-string"
import { ChannelType, ChannelVisibility } from "@prisma/client"
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
    FormDescription,
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
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Channel name is required"
    }),
    type: z.nativeEnum(ChannelType),
    visibility: z.nativeEnum(ChannelVisibility),
    default: z.boolean().default(false)
});

const CreateChannelModal = () => {
    const router = useRouter();
    const params = useParams<{ serverId: string }>();
    const { type, data, isOpen, onClose } = useModal();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isModalOpen = useMemo(() => isOpen && type === "createChannel", [isOpen, type]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: ChannelType.TEXT,
            visibility: ChannelVisibility.PROTECTED,
            default: false
        }
    });

    const channelType = form.watch("type");
    const visibility = form.watch("visibility");
    const isDefault = form.watch("default");
    
    useEffect(() => {
        // Default channels can only be of type TEXT and cannot be PROTECTED OR PRIVATE, they must be PUBLIC
        // Only text channels can be made PUBLIC
        let hasChanged = false;
        
        // say you change the channelType to audio and visibility is currently PUBLIC, set it to PROTECTED
        if (channelType !== ChannelType.TEXT as string && visibility === ChannelVisibility.PUBLIC as string) {
            console.log("\n\n\nCreateChannel::Setting to protected");
            form.setValue("visibility", ChannelVisibility.PROTECTED, { shouldDirty: true });
            hasChanged = true;
        }
        
        // if you change the visibility from PUBLIC to something else, it should set the default field to false
        if (visibility !== ChannelVisibility.PUBLIC as string && isDefault) {
            form.setValue("default", false, { shouldDirty: true });
            hasChanged = true;
        }
        
        // say you change the channelType while default is true, it should set it to false
        if (channelType !== ChannelType.TEXT as string && isDefault) {
            form.setValue("default", false, { shouldDirty: true });
        }
    }, [channelType, visibility, isDefault, form.setValue]);

    const handleClose = () => {
        form.reset();
        onClose();
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        try {
            const url = qs.stringifyUrl({
                url: `/api/channels`,
                query: {
                    serverId: params?.serverId
                }
            });

            const res = await axios.post(url, values);

            form.reset();
            router.refresh();
            router.push(`/servers/${params?.serverId}/${res.data.id}`);
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
            onOpenChange={handleClose}
        >
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Create channel</DialogTitle>
                    <DialogDescription>
                        Channels allow users to share Text, Audio & Video contents
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        className="space-y-4"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-foreground">
                                        Channel Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isLoading}
                                            placeholder="Enter channel name"
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
                                        Channel Type
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
                                            {Object.values(ChannelType).map((ct) => (
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
                        <FormField
                            name="visibility"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-foreground">
                                        Channel Visibility
                                    </FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="capitalize">
                                                <SelectValue placeholder="Select channel visibility" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(ChannelVisibility)
                                                .filter((option) => {
                                                    // Always include the current value (prevents blank display)
                                                    if (option === field.value) return true;
                                                    // Otherwise, PUBLIC only allowed for TEXT channels
                                                    return option !== ChannelVisibility.PUBLIC as string || channelType === ChannelType.TEXT as string;
                                                })
                                                .map((v) => (
                                                    <SelectItem
                                                        key={v}
                                                        value={v}
                                                        className="capitalize"
                                                    >
                                                        {v.toLowerCase()}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormDescription className="text-xs">
                                        Public makes your channel accessible to all(members and non-members). Private{" "}
                                        restricts it to administrators, and Protected to members strictly
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {channelType === ChannelType.TEXT as string && visibility === ChannelVisibility.PUBLIC as string && (
                            <FormField
                                name="default"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                className="mt-1.5"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="">
                                            <FormLabel className="text-xs font-bold text-foreground">Make Default</FormLabel>
                                            <FormDescription className="text-xs">
                                                Settings this to true will override the existing default channel. The default channel is{" "}
                                                locked to public visibility for visitors
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        )}
                        <DialogFooter>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={isLoading}
                            >
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateChannelModal