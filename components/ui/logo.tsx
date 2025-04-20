import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <span className={cn("font-nordique font-bold relative whitespace-nowrap", className)}>
      r<span className="inline-block relative">i<span className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full border-0"></span></span>dercritic
    </span>
  )
} 