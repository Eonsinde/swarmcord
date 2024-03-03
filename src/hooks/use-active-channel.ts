import { create } from "zustand"

interface ModalStore {
    activeServerId: string
    activeChannelId: string
    setActiveServerId: (id: string) => void
    setActiveChannelId: (id: string) => void
    setActiveServerChannelId: (severId: string, channelId: string) => void
}

export const useActiveChannel = create<ModalStore>((set) => ({
    activeServerId: "",
    activeChannelId: "",
    setActiveServerId: (id) => set({ activeServerId: id }),
    setActiveChannelId: (id) => set({ activeChannelId: id }),
    setActiveServerChannelId: (serverId, channelId) => set({ activeServerId: serverId, activeChannelId: channelId }),
}));