import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Authorization | Swarmcord",
    description: "Login/Register to access your swarmcord account",
    keywords: "swarmcord authorization page, swarmcord sign up page, swarmcord sign in page, sign up,  register, login, sign-in, sign-up"
}

export default function AuthenticationLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-full flex justify-center items-center">
            {children}
        </div>
    )
}
