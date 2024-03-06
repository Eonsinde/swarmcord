import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import axios from "axios"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DialogFooter } from "@/components/ui/dialog"
import CompassSvg from "../../../public/svgs/compass.svg"

type Props = {
    onBackAction: () => void
}

const formSchema = z.object({
    inviteLink: z.string().min(2, {
        message: "Invite link is required"
    })
});

const JoinServer = ({ onBackAction }: Props) => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            inviteLink: ""
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        try {
            await axios.post(`/api/servers`, values);

            form.reset();
            router.refresh();
        } catch {
            // show error message
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="space-y-4 pb-4 px-5">
                    <FormField
                        name="inviteLink"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-bold text-foreground">
                                    Invite Link
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-accent"
                                        {...field}
                                        disabled={isLoading}
                                        placeholder="https://swarcord.vercel.app/invite/2a503024-90ef-32cd-54af-0ac0ba43f345"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <button
                        className="p-3 w-full flex justify-between items-center bg-[#F2F3F5] dark:bg-[#2B2C31] hover:bg-zinc-700/5 dark:hover:bg-[#404349] rounded-md transition"
                        type="button"
                        onClick={() => router.push("/explore")}
                    >
                        <div className="flex-1 flex items-center space-x-3">
                            <div className="h-10 w-10 flex justify-center items-center bg-emerald-500 rounded-full">
                                <CompassSvg className="h-6 w-6 stroke-white fill-white" />
                            </div>
                            <div className="flex flex-col items-start">
                                <h3 className="text-foreground font-semibold">Don't have an invite?</h3>
                                <p className="text-xs text-muted-foreground">Explore discoverable communities in Server Discovery</p>
                            </div>
                        </div>
                        <ChevronRight className="text-muted-foreground h-5 w-5" />
                    </button>
                </div>
                <DialogFooter className="bg-[#F2F3F5] dark:bg-[#2B2C31] p-5">
                    <div className="w-full flex justify-end items-center space-x-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onBackAction}
                            disabled={isLoading}
                        >
                            Back
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={isLoading}
                        >
                            Join Server
                        </Button>
                    </div>
                </DialogFooter>
            </form>
        </Form>
    )
}

export default JoinServer