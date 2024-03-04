import { Handshake } from "lucide-react"

const Me = () => {
    return (
        <div>
            <header className="flex items-center h-12 px-3 border-b-2 border-secondary">
                <div className="group flex items-center gap-x-2">
                    <Handshake
                        className="flex-shrink-0 h-5 w-5 text-muted-foreground"
                    />
                    <p className="capitalize line-clamp-1 font-semibold text-base text-foreground">
                        Friends
                    </p>
                </div>
            </header>
            <main className="relative">
                
            </main>
        </div>
    )
}
 
export default Me