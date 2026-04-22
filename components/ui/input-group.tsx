import * as React from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "./textarea"

const InputGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("relative flex w-full flex-col", className)} {...props} />
  )
)
InputGroup.displayName = "InputGroup"

const InputGroupTextarea = React.forwardRef<React.ElementRef<typeof Textarea>, React.ComponentPropsWithoutRef<typeof Textarea>>(
  ({ className, ...props }, ref) => (
    <Textarea ref={ref} className={cn("pb-8", className)} {...props} />
  )
)
InputGroupTextarea.displayName = "InputGroupTextarea"

const InputGroupAddon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { align?: "block-end" | "inline-end" }>(
  ({ className, align, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("absolute bottom-2 right-2 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
)
InputGroupAddon.displayName = "InputGroupAddon"

const InputGroupText = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={className} {...props} />
  )
)
InputGroupText.displayName = "InputGroupText"

export { InputGroup, InputGroupTextarea, InputGroupAddon, InputGroupText }
