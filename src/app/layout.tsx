import type { Metadata } from "next"
import { Open_Sans, Archivo_Black } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { GlobalProvider } from "@/providers/GlobalProvider"
import { EdgeStoreProvider } from "@/lib/edgestore"
import ThemeProvider from "@/providers/ThemeProvider"
import { ModalProvider } from "@/providers/ModalProvider"
import SocketProvider from "@/providers/SocketProvider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const font = Open_Sans({ subsets: ["latin"] });

const archivo_black = Archivo_Black({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-archivo-black"
})

export const metadata: Metadata = {
  title: "Home | Swarmcord",
  description: "Welcome to Swarmcord",
  keywords: "swarmcord home page, swarmcord home"
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
        </head>
        <body className={`${font.className} ${archivo_black.variable}`} suppressHydrationWarning>
            <EdgeStoreProvider>
              <GlobalProvider>
                <SocketProvider>
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    storageKey="swarmcord"
                  >
                    <ModalProvider />
                    {children}
                    <Toaster />
                  </ThemeProvider>
                </SocketProvider>
              </GlobalProvider>
            </EdgeStoreProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
