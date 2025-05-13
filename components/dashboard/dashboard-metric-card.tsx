import { ReactNode } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface DashboardMetricCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: ReactNode;
  trend?: number;
  bgColor: string;
  borderColor: string;
  isMonetary?: boolean;
}

const DashboardMetricCard = ({
  title,
  value,
  description,
  icon,
  trend = 0,
  bgColor,
  borderColor,
  isMonetary = false,
}: DashboardMetricCardProps) => {
  return (
    <Card className={`border ${borderColor} shadow-md ${bgColor}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
            {icon}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-2xl font-bold text-blue-900">{value}</p>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">{description}</p>

            {trend !== 0 && (
              <div className={`flex items-center text-xs ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {trend > 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                <span>{Math.abs(trend as number)}%</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardMetricCard;
