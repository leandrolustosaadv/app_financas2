import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant: "income" | "expense" | "balance";
}

const variants = {
  income: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    value: "text-emerald-700",
    border: "border-emerald-100",
  },
  expense: {
    bg: "bg-red-50",
    icon: "text-red-500",
    value: "text-red-600",
    border: "border-red-100",
  },
  balance: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    value: "text-blue-700",
    border: "border-blue-100",
  },
};

export function SummaryCard({ title, value, icon: Icon, variant }: SummaryCardProps) {
  const style = variants[variant];

  return (
    <Card className={cn("border shadow-sm", style.border)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-slate-500 font-medium">{title}</p>
            <p className={cn("text-2xl font-bold", style.value)}>
              {formatCurrency(value)}
            </p>
          </div>
          <div className={cn("p-3 rounded-xl", style.bg)}>
            <Icon className={cn("h-6 w-6", style.icon)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
