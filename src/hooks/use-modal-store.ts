import { create } from "zustand"
import { Server } from "@prisma/client"

export type ModalType = "createServer" | "editServer" | "deleteServer" | "invite";

type ModalData = {
    server?: Server
    isAdmin?: boolean
}

interface ModalStore {
    type: ModalType | null
    data?: ModalData
    isOpen: boolean
    onOpen: (type: ModalType, modalData?: ModalData) => void
    onClose: () => void
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
    onClose: () => set({ type: null, isOpen: false })
}));