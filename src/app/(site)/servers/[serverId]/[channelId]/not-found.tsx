import Link from "next/link"

type Props = {
    params: {
        serverId: string
    }
}

export default function NotFound({ params }: Props) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
            <h1 className="text-6xl font-bold">404</h1>
            <p className="text-xl text-muted-foreground">Channel not found</p>
            <Link href={`/servers/${params.serverId}`} className="text-blue-500 hover:underline">
                Return to Server
            </Link>
        </div>
    )
}