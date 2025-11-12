import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <span className={cn("font-nordique font-bold relative whitespace-nowrap", className)}>
      <span className="text-foreground">rider</span>
      <span className="text-red-600 dark:text-red-500">critic</span>
    </span>
  )
} 