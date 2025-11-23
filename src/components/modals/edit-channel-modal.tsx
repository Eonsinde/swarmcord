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

const EditChannelModal = () => {
    const router = useRouter();
    const { type, data, isOpen, onClose } = useModal();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isModalOpen = useMemo(() => isOpen && type === "editChannel", [isOpen, type]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: data?.channel?.name ?? "",
            type: data?.channel?.type ?? ChannelType.TEXT,
            visibility: data?.channel?.visibility ?? ChannelVisibility.PROTECTED,
            default: data?.channel?.default || false
        }
    });

    useEffect(() => {
        form.setValue("name", data?.channel?.name || "");
        form.setValue("type", data?.channel?.type || ChannelType.TEXT);
        form.setValue("visibility", data?.channel?.visibility || ChannelVisibility.PROTECTED);
        form.setValue("default", data?.channel?.default || false);
    }, [data]);

    const channelType = form.watch("type");
    const visibility = form.watch("visibility");
    const isDefault = form.watch("default");
    
    useEffect(() => {
        // Default channels cannot be PROTECTED OR PRIVATE, they must be PUBLIC
        // Only text channels can be made PUBLIC
        
        // say you change the channelType to audio and visibility is currently PUBLIC, set it to PROTECTED
        if (channelType !== ChannelType.TEXT as string && visibility === ChannelVisibility.PUBLIC as string) {
            form.setValue("visibility", ChannelVisibility.PROTECTED, { shouldDirty: true });
        }
        
        // if you change the visibility from PUBLIC to something else, it should set the default field to false
        if (visibility !== ChannelVisibility.PUBLIC as string && isDefault) {
            form.setValue("default", false, { shouldDirty: true });
        }
        
        // say you change the channelType while default is true, it should set it to false
        if (channelType !== ChannelType.TEXT as string && isDefault) {
            form.setValue("default", false, { shouldDirty: true });
        }
    }, [channelType, visibility, isDefault, form.setValue]);

    const handleClose = () => {
        onClose();
        form.reset();
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        try {
            const url = qs.stringifyUrl({
                url: `/api/channels/${data?.channel?.id}`,
                query: {
                    serverId: data?.server?.id
                }
            });

            await axios.patch(url, values);

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
            onOpenChange={handleClose}
        >
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Edit channel</DialogTitle>
                    <DialogDescription>
                        Makes changes to <b>{data?.channel?.name}</b>
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
                                        disabled={isLoading || data?.channel?.default}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="capitalize">
                                                <SelectValue placeholder="Select channel type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(ChannelType).map((type) => (
                                                <SelectItem
                                                    key={type}
                                                    className="capitalize"
                                                    value={type}
                                                >
                                                    {type.toLowerCase()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {data?.channel?.default && (
                                        <FormDescription className="text-xs">
                                            To change the type and visibility, you must firstly make another channel the default.{" "}
                                            A default channel is required, hence this restriction
                                        </FormDescription>
                                    )}
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
                                        disabled={isLoading || data?.channel?.default}
                                        onValueChange={field.onChange}
                                        value={field.value}
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
                                                disabled={data?.channel?.default}
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
                                Submit
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default EditChannelModal