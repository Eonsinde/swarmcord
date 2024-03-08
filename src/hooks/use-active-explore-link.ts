import { create } from "zustand"

interface ModalStore {
    activeLink: string
    setActiveLink: (name: string) => void
}

export const useActiveExploreLink = create<ModalStore>((set) => ({
    activeLink: "",
    setActiveLink: (name) => set({ activeLink: name })
}));