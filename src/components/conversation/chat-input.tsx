"use client"
import axios from "axios"
import qs from "query-string"
import { useForm } from "react-hook-form"
import { useModal } from "@/hooks/use-modal-store"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Smile } from "lucide-react"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
    content: z.string().min(1)
});

type Props = {
    apiUrl: string
    query: Record<string, any>
    name: string
    type: "conversation" | "channel"
}

const ChatInput = ({
    name,
    type,
    query,
    apiUrl
}: Props) => {
    const { onOpen } = useModal();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: ""
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query
            });

            await axios.post(url, values);
        } catch (error) {
            console.log("Couldn't send message");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    name="content"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="m-4 mb-6 p-3 bg-zinc-200/90 dark:bg-zinc-700/75 flex items-end rounded-sm">
                                    <button
                                        className="h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-500 hover:bg-zinc-600 dark:hover:bg-zinc-300 flex justify-center items-center p-1 rounded-full transition"
                                        type="button"
                                        onClick={() => onOpen("messageFile", { apiUrl, query })}
                                    >
                                        <Plus className="text-white dark:text-[#313338]" />
                                    </button>
                                    <Textarea
                                        className="flex-1 py-0 pb-0.5 bg-transparent border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 resize-none"
                                        rows={1}
                                        maxRows={4}
                                        disabled={form.formState.isLoading}
                                        placeholder={`Message ${type === "conversation" ? name : "#"+name }`}
                                        {...field}
                                    />
                                    <button
                                        className="h-[24px] w-[24px] flex justify-center items-center rounded-full transition"
                                        type="button"
                                        onClick={() => true}
                                    >
                                        <Smile />
                                    </button>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}

export default ChatInput