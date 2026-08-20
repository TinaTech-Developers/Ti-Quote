import { ArrowDownRight, ArrowUpRight, LucideIcon } from "lucide-react";

interface ReportStatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  trend?: number;
}

export default function ReportStatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: ReportStatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>

          {description && (
            <p className="mt-1 text-xs text-slate-500">{description}</p>
          )}

          {trend !== undefined && (
            <div
              className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold ${
                trend >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {trend >= 0 ?
                <ArrowUpRight className="h-3.5 w-3.5" />
              : <ArrowDownRight className="h-3.5 w-3.5" />}
              {Math.abs(trend).toFixed(1)}%
            </div>
          )}
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
      </div>
    </div>
  );
}
