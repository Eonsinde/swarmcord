import { create } from "zustand"

type State = {
    servers: {
        activeServerId: string
        activeChannelId: string
    } []
}

type Payload = {
    serverId: string
    channelId: string
}

type Actions = {
    setActiveServerChannelId: (payload: Payload) => void
}

const reducer = (state: State, payload: Payload) => {
    const servers = state.servers;

    // if no servers exist yet
    if (servers.length === 0)
        return {
            servers: [{
                activeServerId: payload.serverId,
                activeChannelId: payload.channelId
            }]
        };

    const foundServer = servers.find((server) => server.activeServerId === payload.serverId);

    if (foundServer) // update existing details
        return {
            servers: servers.map((server) => server.activeServerId === payload.serverId ? { ...server, activeChannelId: payload.channelId } : server)
        }

    // If there are servers and the payload serverId hasn't being added, append new details
    return {
        servers: [
            ...servers,
            {
                activeServerId: payload.serverId,
                activeChannelId: payload.channelId
            }
        ]
    }
}

export const useActiveChannel = create<State & Actions>((set) => ({
    servers: [],
    setActiveServerChannelId: (payload: Payload) => {
        set((state) => reducer(state, payload))
    }
}));