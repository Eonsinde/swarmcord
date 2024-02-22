
type Props = {
    params: {
        serverId: string
    }
}

const ServerDetails = ({ params: { serverId } }: Props) => {
    // const { serverId } = useParams<{ serverId: string }>();
    
    return (
        <div>Server Details Page ${serverId}</div>
    )
}
 
export default ServerDetails;