"use client"

import Link, { LinkProps } from "next/link"
import type { ReactNode } from "react"
import { trackEvent } from "@/lib/ga4"

interface BlogTrackingLinkProps extends LinkProps {
  children: ReactNode
  className?: string
  eventName: string
  eventParams?: Record<string, unknown>
}

export function BlogTrackingLink({
  href,
  children,
  className,
  eventName,
  eventParams,
  ...linkProps
}: BlogTrackingLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackEvent(eventName, eventParams)}
      {...linkProps}
    >
      {children}
    </Link>
  )
}
