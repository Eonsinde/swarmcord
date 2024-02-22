import type { Metadata } from "next"
import { Open_Sans } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server"
import { ourFileRouter } from "./api/uploadthing/core"
import "./globals.css"
import ThemeProvider from "@/providers/ThemeProvider"

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
          <NextSSRPlugin
            /**
             * The `extractRouterConfig` will extract **only** the route configs
             * from the router to prevent additional information from being
             * leaked to the client. The data passed to the client is the same
             * as if you were to fetch `/api/uploadthing` directly.
             */
            routerConfig={extractRouterConfig(ourFileRouter)}
          />
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            storageKey="swarmcord"
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
