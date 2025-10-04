
import { cn } from "@/lib/cn";
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-border bg-card p-6 shadow-sm", className)} {...props} />;
}
