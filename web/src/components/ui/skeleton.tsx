import { cn } from "@/lib/utils";

function Skeleton({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    >
      <div className="pointer-events-none invisible w-fit">{children}</div>
    </div>
  );
}

export { Skeleton };
