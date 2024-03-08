import type { Metadata } from "next"
import { Open_Sans, Archivo_Black } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { EdgeStoreProvider } from "@/lib/edgestore"
import "./globals.css"
import ThemeProvider from "@/providers/ThemeProvider"
import { ModalProvider } from "@/providers/ModalProvider"

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
