"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Search } from "lucide-react"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/ui/command"

type Props = {
    data: {
        label: string
        type: "channel" | "member",
        data: {
            id: string
            name: string
            icon: React.ReactNode
        }[] | undefined
    } []
}

const ServerSearch = ({ data }: Props) => {
    const [open, setOpen] = useState<boolean>(false);
    const router = useRouter();
    const params = useParams<{ serverId: string }>();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        }

        document.addEventListener("keydown", down);

        return () => document.removeEventListener("keydown", down);
    }, []);

    const handleClick = ({ id, type }: { id: string, type: "channel" | "member" }) => {
        setOpen(false);

        if (type === "member")
            return router.push(`/servers/${params?.serverId}/conversations/${id}`);

        if (type === "channel")
            return router.push(`/servers/${params?.serverId}/channels/${id}`);
    }

    return (
        <>
            <button
                className="group p-2 w-full flex items-center gap-x-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 rounded-md transition"
                onClick={() => setOpen(true)}
            >
                <Search className="h-4 w-4 text-muted-foreground" />
                <p className="font-semibold text-sm text-muted-foreground">Search</p>
                <kbd className="pointer-events-none h-5 inline-flex items-center gap-x-1 px-1.5 ml-auto bg-secondary text-muted-foreground font-mono text-md font-medium select-none rounded">
                    <span className="mt-1 text-[9px]">⌘</span>K
                </kbd>
            </button>
            <CommandDialog
                open={open}
                onOpenChange={setOpen}
            >
                <CommandInput placeholder="Search all channels and members" />
                <CommandList>
                    <CommandEmpty>No results found</CommandEmpty>
                    {data.map(({ label, type, data }) => {
                        if (!data?.length) return null

                        return (
                            <CommandGroup
                                key={label}
                                heading={label}
                            >
                                {data?.map(({ id, icon, name }) => (
                                    <CommandItem
                                        key={id}
                                        onSelect={() => handleClick({ id, type })}
                                    >
                                        {icon}
                                        <span>{name}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )
                    })}
                </CommandList>
            </CommandDialog>
        </>
    );
}
 
export default ServerSearch