"use client"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useModal } from "@/hooks/use-modal-store"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { SearchInput } from "@/components/ui/search-input"
import Profile from "./pages/profile"
import Rocket from "./pages/rocket"

const MENU = [
    { label: "My Account", value: "account" },
    { label: "Rocket", value: "rocket" }
]

const SettingsModal = () => {
    const { type, isOpen, onClose } = useModal();

    const [activeMenu, setActiveMenu] = useState<string>(() => MENU[0].value);
    const [menuQuery, setMenuQuery] = useState<string>("");

    // This is the magic: filtered list based on query
    const filteredMenu = useMemo(() => {
        if (!menuQuery.trim()) return MENU;

        const query = menuQuery.toLowerCase();
        return MENU.filter((item) =>
            item.label.toLowerCase().includes(query)
        );
    }, [menuQuery]);

    const isModalOpen = useMemo(() => isOpen && type === "userSettings", [isOpen, type]);

    const handleClose = () => {
        onClose();
        setTimeout(() => setActiveMenu(MENU[0].value), 10);
        setMenuQuery("");
    }

    const getModalHeader = useMemo(() => {
        const found = MENU.filter(item => item.value === activeMenu)

        if (found.length) return found[0]
        else return null
    }, [activeMenu])

    const renderActiveMenuContent = useCallback(() => {
        if (activeMenu === "account") return <Profile />
        else if (activeMenu === "rocket") return <Rocket />
    }, [activeMenu])

    return (
        <Dialog
            key={String(isModalOpen)}
            open={isModalOpen}
            onOpenChange={handleClose}
        >
            <DialogContent className="h-full max-w-full w-full flex flex-row p-0 border-0 rounded-none sm:rounded-none">
                <div className="w-4/12 bg-[#F2F3F5] dark:bg-[#2B2C31] py-20 px-5 overflow-hidden">
                    <div className="w-5/12 ml-auto flex flex-col gap-4">
                        {/* search bar */}
                        <SearchInput
                            value={menuQuery}
                            onChange={(e) => setMenuQuery(e.target.value)}
                            placeholder="Search"
                        />
                        <div className="">
                            {filteredMenu.length > 0 ? (
                                filteredMenu.map((item) => (
                                    <button
                                        key={item.value} // ← use value, not index!
                                        className={cn(
                                            "group p-2 mb-1 flex items-center gap-x-2 w-full hover:bg-zinc-700/5 dark:hover:bg-zinc-700/50 rounded-md transition",
                                            activeMenu === item.value && "bg-zinc-700/10 dark:bg-zinc-700 hover:bg-zinc-700/10 dark:hover:bg-zinc-700"
                                        )}
                                        onClick={() => setActiveMenu(item.value)}
                                    >
                                        <p
                                            className={cn(
                                                "line-clamp-1 text-sm text-muted-foreground transition",
                                                activeMenu === item.value && "text-foreground font-semibold"
                                            )}
                                        >
                                            {item.label}
                                        </p>
                                    </button>
                                ))
                            ) : (
                                <p className=" px-3 py-2 text-sm text-muted-foreground italic text-wrap">
                                    No results found for "<span className="text-foreground">{menuQuery}</span>"
                                </p>
                            )}
                            {/* logout button */}
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="w-9/12 py-20 px-10">
                        <DialogHeader>
                            <DialogTitle>{getModalHeader?.label}</DialogTitle>
                        </DialogHeader>
                        {renderActiveMenuContent()}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SettingsModal