
type Props = {
    params: {
        serverId: string,
        channelId: string
    }
}

const ServerDetails = ({ params: { serverId, channelId } }: Props) => {
    // const { serverId } = useParams<{ serverId: string }>();
    
    return (
        <div>
            Server Details Page {serverId} | Channel: {channelId}
        </div>
    )
}

export default ServerDetails