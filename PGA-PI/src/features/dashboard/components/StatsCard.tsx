import { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "./cardDashboard";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  className 
}: StatsCardProps) => {
  return (
    <Card className={`shadow-[0px_0px_25px_#00000026] rounded-xl ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium text-gray-600 mobile-text-sm">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 mobile-text-lg">{value}</div>
        {description && (
          <p className="text-xs text-gray-500 mt-1 mobile-text-xs">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <span
              className={`text-xs font-medium ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
            <span className="text-xs text-gray-500 ml-1">vs mês anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 