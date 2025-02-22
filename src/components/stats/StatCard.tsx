
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all hover:shadow-lg",
      className
    )}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-semibold mt-2">{value}</h3>
            {trend && (
              <p className="text-xs text-muted-foreground mt-1">
                {trend.value >= 0 ? "+" : "-"}{Math.abs(trend.value)}% {trend.label}
              </p>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>
    </Card>
  );
}
