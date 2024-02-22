import type { Metadata } from "next"
import { Open_Sans } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { EdgeStoreProvider } from "@/lib/edgestore"
import "./globals.css"
import ThemeProvider from "@/providers/ThemeProvider"
import { ModalProvider } from "@/providers/ModalProvider"

const font = Open_Sans({ subsets: ["latin"] });

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
        <body className={font.className} suppressHydrationWarning>
          <EdgeStoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              storageKey="swarmcord"
            >
              <ModalProvider />
              {children}
            </ThemeProvider>
          </EdgeStoreProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
