import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[96px] w-full rounded-lg border border-slate-200/90 bg-white/90 px-3 py-2 text-sm text-slate-950 placeholder:text-slate-400 shadow-sm shadow-slate-900/[0.03] transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
