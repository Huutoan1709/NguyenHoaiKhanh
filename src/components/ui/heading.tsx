
import { cn } from "@/lib/cn";
export function H2({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-2xl md:text-3xl font-semibold tracking-tight", className)} {...props} />;
}
