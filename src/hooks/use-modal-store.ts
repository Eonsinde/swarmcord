import { create } from "zustand"
import { ChannelType, Server } from "@prisma/client"

export type ModalType = 
    "userSettings"  |
    "createServer"  |
    "editServer"    |
    "leaveServer"   |
    "deleteServer"  |
    "invite"        |
    "manageMembers" |
    "createChannel" |
    "editChannel"   |
    "deleteChannel" |
    "messageFile"   |
    "deleteAccount";

// type ModalData = {
//     server?: Server
//     channel?: { id?: string, name: string, type: ChannelType }
//     isAdmin?: boolean
// }

interface ModalStore {
    type: ModalType | null
    data?: any
    isOpen: boolean
    onOpen: (type: ModalType, modalData?: any) => void
    onClose: () => void
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
    onClose: () => set({ type: null, isOpen: false })
}));