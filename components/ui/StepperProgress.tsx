import { Check } from "lucide-react";
import { STATUS_LABELS, TIMELINE_STATUSES, type OrderStatus } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function StepperProgress({ status }: { status: OrderStatus }) {
  const currentIndex = TIMELINE_STATUSES.indexOf(status);

  return (
    <div className="overflow-x-auto no-scrollbar rounded-3xl bg-card p-5 card-shadow">
      <div className="flex min-w-[680px] items-center">
        {TIMELINE_STATUSES.map((step, index) => {
          const complete = currentIndex >= index;
          return (
            <div key={step} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold", complete ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted text-muted-foreground")}>
                  {complete ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span className="text-xs font-bold text-muted-foreground">{STATUS_LABELS[step]}</span>
              </div>
              {index < TIMELINE_STATUSES.length - 1 ? <div className={cn("mx-2 h-1 flex-1 rounded", currentIndex > index ? "bg-primary" : "bg-border")} /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
