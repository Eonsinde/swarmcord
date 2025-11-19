import * as React from "react"

import { Search } from "lucide-react"

import { cn } from "@/lib/utils"

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement> , "type"> {}

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => {
        return (
            <div className="flex items-center gap-2 w-full px-3 py-2 rounded-md border border-input bg-background overflow-hidden focus-within:outline-none ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <Search className="h-4 w-4" />
                <input
                    type="text"
                    className={cn(
                        "flex-1 w-full bg-transparent text-sm box-border placeholder:text-muted-foreground outline-none disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        )
    }
)
SearchInput.displayName = "SearchInput"

export { SearchInput }
