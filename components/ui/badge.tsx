import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-[#191917]/10 text-[#191917]",
        pending: "bg-amber-100 text-amber-800",
        active: "bg-emerald-100 text-emerald-800",
        inactive: "bg-gray-100 text-gray-600",
        paid: "bg-blue-100 text-blue-800",
        scheduled: "bg-violet-100 text-violet-800",
        danger: "bg-red-100 text-red-700",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
