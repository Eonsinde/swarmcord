"use client"
import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useModal } from "@/hooks/use-modal-store"
import { CSSTransition } from "react-transition-group"
import { Category } from "@prisma/client"
import { ChevronRight } from "lucide-react"
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
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import JoinServer from "./join-server"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Server name is required"
    }),
    imageUrl: z.string()
});

const CreateServerModal = () => {
    const router = useRouter();
    const { type, isOpen, onClose } = useModal();

    const [activePage, setActivePage] = useState<"categories" | "joinServer" | "createServer">("categories");
    const [menuHeight, setMenuHeight] = useState<number | string | undefined>(undefined);
    const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
    const [categories, setCategories] = useState<Category []>([]);
    const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isModalOpen = useMemo(() => isOpen && type === "createServer", [isOpen, type]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: ""
        }
    });

    useEffect(() => {
        (async () => {
            setCategoriesLoading(true);

            try {
                const response = await axios.get("/api/categories");
                setCategories(response.data);
            } catch {
                // show error message
            } finally {
                setCategoriesLoading(false);
            }
        })();
    }, []);

    const calcHeight = (el: any) => {
        const height = el?.offsetHeight;
        setMenuHeight(height);
    }

    const handleClose = () => {
        form.reset();
        setActivePage("categories");
        onClose();
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        try {
            const result = await axios.post("/api/servers", {
                ...values,
                categoryId: activeCategory
            });

            form.reset();
            router.push(`/servers/${result.data.id}`);
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
            <DialogContent
                className="h-full md:h-auto max-w-full md:max-w-[450px] p-0 transition-height duration-500 overflow-hidden"
                style={{
                    height: menuHeight
                }}
            >
                <CSSTransition
                    classNames="create-server-menu-primary"
                    in={activePage === "categories"} 
                    unmountOnExit
                    onEnter={calcHeight}
                    timeout={500}
                >
                    <div className="create-server-menu w-full">
                        <div className="p-5 pb-0">
                            <DialogHeader className="pb-4">
                                <DialogTitle>Customize your server</DialogTitle>
                                <DialogDescription>
                                    Give your server a personality with a name and image.
                                    You can always change it later
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="md:h-72">
                                <div className="pb-4 space-y-3">
                                    <button
                                        className="w-full p-3 flex justify-between items-center hover:bg-zinc-700/5 dark:hover:bg-[#404349] border-[0.2px] border-zinc-300 dark:border-[#484d56] rounded-md transition"
                                        onClick={() => {
                                            setActivePage("createServer");
                                            setActiveCategory("")
                                        }}
                                    >
                                        <p className="text-sm font-semibold capitalize text-foreground">Create My Own</p>
                                        <ChevronRight className="text-muted-foreground h-5 w-5" />
                                    </button>
                                    <small className="mt-2 block text-muted-foreground">OR SELECT A CATEGORY</small>
                                    {categoriesLoading
                                    ?
                                    <>
                                        <Skeleton className="p-5 w-full" />
                                        <Skeleton className="p-5 w-full" />
                                    </>
                                    :
                                    <>
                                        {categories.length > 0 ? (
                                                <div className="space-y-3">
                                                    {categories.map((category) => (
                                                        <button
                                                            className="w-full p-3 flex justify-between items-center hover:bg-zinc-700/5 dark:hover:bg-[#404349] border-[0.2px] border-zinc-300 dark:border-[#484d56] rounded-md transition"
                                                            onClick={() => {
                                                                setActiveCategory(category.id);
                                                                setActivePage("createServer");
                                                            }}
                                                        >
                                                            <p className="text-sm font-semibold capitalize text-foreground">{category.name}</p>
                                                            <ChevronRight className="text-muted-foreground h-5 w-5" />
                                                        </button>
                                                    ))}
                                                </div>
                                            
                                        ) : (
                                            <p className="text-md font-semibold text-foreground">No categories to show</p>
                                        )}
                                    </>}
                                </div>
                            </ScrollArea>
                        </div>
                        <DialogFooter className="bg-[#F2F3F5] dark:bg-[#2B2C31] p-5 space-y-2">
                            <div className="flex-1 space-y-2">
                                <h3 className="text-foreground text-center">Have an invite already?</h3>
                                <Button
                                    className="w-full"
                                    type="button"
                                    variant="primary"
                                    onClick={() => setActivePage("joinServer")}
                                    disabled={isLoading}
                                >
                                    Join a Server
                                </Button>
                            </div>
                        </DialogFooter>
                    </div>
                </CSSTransition>
                <CSSTransition
                    classNames="create-server-menu-secondary"
                    in={activePage === "createServer"} 
                    unmountOnExit
                    onEnter={calcHeight}
                    timeout={500} 
                >
                    <div className="create-server-menu w-full">
                        <DialogHeader className=" pt-5 px-5">
                            <DialogTitle>Customize first server</DialogTitle>
                            <DialogDescription>
                                Give your server a personality with a name and image.
                                You can always change it later
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                            >
                                <div className="py-4 px-5 space-y-4">
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
                                                        className="bg-accent"
                                                        {...field}
                                                        disabled={isLoading}
                                                        placeholder="Enter server name"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <DialogFooter className="bg-[#F2F3F5] dark:bg-[#2B2C31] p-5 space-y-2">
                                    <div className="w-full flex justify-end items-center space-x-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setActivePage("categories")}
                                            disabled={isLoading}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={isLoading}
                                        >
                                            Create Server
                                        </Button>
                                    </div>
                                </DialogFooter>
                            </form>
                        </Form>
                    </div>
                </CSSTransition>
                <CSSTransition
                    classNames="create-server-menu-secondary"
                    in={activePage === "joinServer"} 
                    unmountOnExit
                    onEnter={calcHeight}
                    timeout={500} 
                >
                    <div className="create-server-menu w-full">
                        <DialogHeader className="pt-5 pb-2 px-5">
                            <DialogTitle>Join a Server</DialogTitle>
                            <DialogDescription>
                                Enter an invite below to join an existing server
                            </DialogDescription>
                        </DialogHeader>
                        <JoinServer
                            onBackAction={() => setActivePage("categories")}
                            onCloseModal={handleClose }
                        />
                    </div>
                </CSSTransition>
            </DialogContent>
        </Dialog>
    )
}

export default CreateServerModal