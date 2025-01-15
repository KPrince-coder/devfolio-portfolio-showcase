import { Users, Eye, ThumbsUp, Clock } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: string;
  trend: number;
  icon: React.ReactNode;
  color: string;
}

const AnalyticsCard = ({ title, value, trend, icon: Icon, color }: AnalyticsCardProps) => (
  <div className={`${color} p-4 rounded-lg text-white`}>
    <div className="flex justify-between items-center">
      {Icon}
      <span className={trend > 0 ? "text-green-300" : "text-red-300"}>{trend}%</span>
    </div>
    <h3 className="mt-2 text-xl font-bold">{value}</h3>
    <p className="text-sm opacity-80">{title}</p>
  </div>
);

export const AnalyticsSummary = () => {
  const stats = [
    {
      label: "Total Visitors",
      value: "12.5K",
      trend: 12,
      icon: <Users className="h-6 w-6 text-white" />,
      color: "bg-indigo-600",
    },
    {
      label: "Page Views",
      value: "48.2K",
      trend: 18,
      icon: <Eye className="h-6 w-6 text-white" />,
      color: "bg-pink-600",
    },
    {
      label: "Engagement Rate",
      value: "6.8%",
      trend: 2.3,
      icon: <ThumbsUp className="h-6 w-6 text-white" />,
      color: "bg-green-600",
    },
    {
      label: "Avg. Session",
      value: "3m 45s",
      trend: 0.8,
      icon: <Clock className="h-6 w-6 text-white" />,
      color: "bg-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {stats.map((stat) => (
        <AnalyticsCard
          key={stat.label}
          title={stat.label}
          value={stat.value}
          trend={stat.trend}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
};