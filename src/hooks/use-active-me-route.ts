import { create } from "zustand"

interface ModalStore {
    activeRoute: string
    setActiveRoute: (name: string) => void
}

export const useActiveMeRoute = create<ModalStore>((set) => ({
    activeRoute: "",
    setActiveRoute: (name) => set({ activeRoute: name })
}));