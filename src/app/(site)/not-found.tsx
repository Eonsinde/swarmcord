import Link from "next/link"

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
            <h1 className="text-6xl font-bold">404</h1>
            <p className="text-xl text-muted-foreground">Server not found</p>
            <Link href="/me" className="text-blue-500 hover:underline">
                Return Home
            </Link>
        </div>
    )
}