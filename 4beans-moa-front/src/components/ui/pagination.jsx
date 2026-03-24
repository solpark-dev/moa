import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button";

const Pagination = ({
  className,
  ...props
}) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props} />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props} />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  disabled,
  ...props
}) => (
  <button
    type="button"
    aria-current={isActive ? "page" : undefined}
    disabled={disabled}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9",
      isActive
        ? "bg-white text-gray-900 border border-gray-300"
        : "hover:bg-gray-100 text-gray-700",
      disabled && "pointer-events-none opacity-50",
      "cursor-pointer transition-colors",
      className
    )}
    {...props} />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  disabled,
  ...props
}) => (
  <button
    type="button"
    aria-label="이전 페이지로 이동"
    disabled={disabled}
    className={cn(
      buttonVariants({
        variant: "ghost",
        size: "default",
      }),
      "gap-1 pl-2.5",
      disabled && "pointer-events-none opacity-50",
      "cursor-pointer",
      className
    )}
    {...props}>
    <ChevronLeft className="h-4 w-4" />
    <span></span>
  </button>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  disabled,
  ...props
}) => (
  <button
    type="button"
    aria-label="다음 페이지로 이동"
    disabled={disabled}
    className={cn(
      buttonVariants({
        variant: "ghost",
        size: "default",
      }),
      "gap-1 pr-2.5",
      disabled && "pointer-events-none opacity-50",
      "cursor-pointer",
      className
    )}
    {...props}>
    <span></span>
    <ChevronRight className="h-4 w-4" />
  </button>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">더 많은 페이지</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
