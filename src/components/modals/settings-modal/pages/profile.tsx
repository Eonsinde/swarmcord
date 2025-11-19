"use client"
import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Info } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useModal } from "@/hooks/use-modal-store"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import ActionTooltip from "@/components/action-tooltip"

dayjs.extend(localizedFormat);

const formSchema = z.object({
    name: z
        .string()
        .min(1, {
            message: "Display name is required"
        })
        .trim(),
    username: z
        .string()
        .trim(),
    bio: z
        .string()
        .trim(),
});

const Profile = () => {
    const router = useRouter();
    const { data: currentProfile, onOpen } = useModal();

    console.log("\n\n\nProfileModal::Profile", currentProfile);

    const [activeField, setActiveField] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            username: "",
            bio: ""
        }
    });
    
    useEffect(() => {
        if (currentProfile) {
            form.setValue("name", currentProfile?.name);
            form.setValue("username", currentProfile?.username || "");
            form.setValue("bio", currentProfile?.bio || "");
        }
    }, [currentProfile])

    const handleSetActiveField = useCallback((value: keyof z.infer<typeof formSchema>) => {
        setActiveField(value);
        setTimeout(() => form.setFocus(value), 0);
    }, [form, setActiveField]);

    const resetActiveField = useCallback(() => {
        setActiveField(undefined);
        form.clearErrors();
    }, [form, setActiveField]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        try {
            await axios.patch("/api/profile", values);
            setActiveField(undefined);

            toast.success("Changes Saved ✌️", { position: "bottom-center" });
            router.refresh();
        } catch(e: any) {
            // show error message
            toast.success(e?.message || "Something went wrong 🫤");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="py-8">
            <div className="bg-secondary rounded-lg overflow-hidden">
                <div className="h-24 bg-[#535964]">
                    
                </div>
                <div className="-mt-8 px-4 flex items-center gap-4">
                    <div className="relative bg-secondary p-1.5 rounded-full">
                        <div className="relative size-24">
                            <Image
                                className="object-contain rounded-full"
                                src={currentProfile?.imageUrl || ""}
                                fill
                                alt={`${currentProfile?.name} avatar`}
                            />
                        </div>
                        <ActionTooltip
                             label={(
                                <p className="font-semibold text-sm">
                                    Edit this feature via the clerk profile manager located in front<br/>of the settings button on the navigation footer in the main app
                                </p>
                            )}
                            side="bottom"
                        >
                            <div className="absolute -bottom-1 right-1 bg-secondary p-1 rounded-full">
                                <Info className="" />
                            </div>
                        </ActionTooltip>
                    </div>
                    <p className="mt-4 font-semibold text-foreground">
                        {currentProfile?.name}
                    </p>
                </div>
                <Form {...form}>
                    <form
                        className="p-4 space-y-4"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-end gap-14">
                                        <div className="flex-1 space-y-2">
                                            <FormLabel className="text-xs font-bold text-foreground">
                                                Display Name
                                            </FormLabel>
                                            {activeField === "name"
                                            ?
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isLoading}
                                                    placeholder="Enter display name"
                                                />
                                            </FormControl>
                                            :
                                            <p className="text-base">
                                                {currentProfile?.name}
                                            </p>}
                                        </div>
                                        {activeField === "name"
                                        ?
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                disabled={isLoading || !form.formState.dirtyFields.name}
                                            >
                                                Save
                                            </Button>
                                            <Button onClick={resetActiveField}>
                                                Cancel
                                            </Button>
                                        </div>
                                        :
                                        <Button onClick={() => handleSetActiveField("name")}>Edit</Button>}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-end gap-14">
                                        <div className="flex-1 space-y-2">
                                            <FormLabel className="text-xs font-bold text-foreground">
                                                Username
                                            </FormLabel>
                                            {activeField === "username"
                                            ?
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isLoading}
                                                    placeholder="Enter username"
                                                />
                                            </FormControl>
                                            :
                                            <p className="text-base">
                                                {currentProfile?.username || "No username set"}
                                            </p>}
                                        </div>
                                        {activeField === "username"
                                        ?
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                disabled={isLoading || !form.formState.dirtyFields.username}
                                            >
                                                Save
                                            </Button>
                                            <Button onClick={resetActiveField}>
                                                Cancel
                                            </Button>
                                        </div>
                                        :
                                        <Button onClick={() => handleSetActiveField("username")}>Edit</Button>}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="bio"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-end gap-14">
                                        <div className="flex-1 space-y-2">
                                            <FormLabel className="text-xs font-bold text-foreground">
                                                Bio <span className="italic">(will be displayed on your public profile)</span>
                                            </FormLabel>
                                            {activeField === "bio"
                                            ?
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    disabled={isLoading}
                                                    placeholder="Say something about yourself or on your mind"
                                                />
                                            </FormControl>
                                            :
                                            <p className="text-base">
                                                {currentProfile?.bio || "Say something about yourself or on your mind"}
                                            </p>}
                                        </div>
                                        {activeField === "bio"
                                        ?
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                disabled={isLoading || !form.formState.dirtyFields.bio}
                                            >
                                                Save
                                            </Button>
                                            <Button onClick={resetActiveField}>
                                                Cancel
                                            </Button>
                                        </div>
                                        :
                                        <Button onClick={() => handleSetActiveField("bio")}>Edit</Button>}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <FormLabel className="text-xs font-bold text-foreground">
                                    Email
                                </FormLabel>
                                <ActionTooltip
                                    label={(
                                        <p className="font-semibold text-sm">
                                            Edit this feature via the clerk profile manager located in front<br/>of the settings button on the navigation footer in the main app
                                        </p>
                                    )}
                                    side="bottom"
                                >
                                    <Info className="size-4" />
                                </ActionTooltip>
                            </div>
                            <p className="text-base">
                                {currentProfile?.email}
                            </p>
                        </div>
                        <div className="flex-1 space-y-2">
                            <FormLabel className="text-xs font-bold text-foreground">
                                Joined
                            </FormLabel>
                            <p className="text-base">
                                {dayjs(currentProfile?.createdAt).format("ddd, D MMMM, YYYY")}
                            </p>
                        </div>
                        <div className="flex-1 space-y-2">
                            <FormLabel className="text-xs font-bold text-foreground">
                                Last Updated
                            </FormLabel>
                            <p className="text-base">
                                {dayjs(currentProfile?.updatedAt).format("ddd, D MMMM, YYYY")}
                            </p>
                        </div>
                    </form>
                </Form>
            </div>
            <Separator className="bg-zinc-300 dark:bg-[#484d56] my-10 rounded-md" />
            <div className="flex items-end gap-4">
                <div className="flex-1">
                    <div className="text-base font-bold text-foreground">
                        Account Removal
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Deleting your account means you lose access to it and its contents permanently
                    </div>
                </div>
                <Button
                    variant="destructive"
                    onClick={() => onOpen("deleteAccount")}
                >
                    Delete Account
                </Button>
            </div>
        </div>
    )
}
 
export default Profile