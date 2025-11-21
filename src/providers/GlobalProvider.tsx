"use client"
import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export function GlobalProvider({ children }: { children: React.ReactNode }) {
    // Create QueryClient here (stays in Client context)
    const [queryClient] = useState(
        () =>
        new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 60 * 1000, // Optional: Customize defaults
                }
            }
        })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}