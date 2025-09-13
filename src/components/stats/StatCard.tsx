
import { memo } from "react";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
  onClick?: () => void;
}

export const StatCard = memo(function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
  onClick,
}: StatCardProps) {
  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all hover:shadow-lg",
        onClick && "cursor-pointer hover:scale-105",
        className
      )}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">{title}</p>
            <h3 className={cn(
              "text-2xl font-semibold mt-2",
              onClick && "text-blue-600 font-bold"
            )}>{value}</h3>
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
});
