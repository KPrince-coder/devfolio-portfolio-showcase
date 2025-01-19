import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid 
} from 'recharts';
import { 
  Activity, 
  TrendingUp, 
  MessageCircle, 
  Archive,
  Calendar,
  ArrowUp,
  ArrowDown 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MessageAnalyticsProps {
  analytics: {
    totalMessages: number;
    unreadMessages: number;
    repliedMessages: number;
    archivedMessages: number;
    dailyMessageTrend: Array<{ date: string; count: number }>;
    percentageChange?: {
      total: number;
      unread: number;
      replied: number;
      archived: number;
    };
  };
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{label}</p>
        <p className="text-primary">Messages: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export const MessageAnalytics: React.FC<MessageAnalyticsProps> = ({ 
  analytics,
  className 
}) => {
  const analyticsCards = [
    {
      icon: MessageCircle,
      title: "Total Messages",
      value: analytics.totalMessages,
      change: analytics.percentageChange?.total,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/50"
    },
    {
      icon: Activity,
      title: "Unread Messages",
      value: analytics.unreadMessages,
      change: analytics.percentageChange?.unread,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/50"
    },
    {
      icon: TrendingUp,
      title: "Replied Messages",
      value: analytics.repliedMessages,
      change: analytics.percentageChange?.replied,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/50"
    },
    {
      icon: Archive,
      title: "Archived Messages",
      value: analytics.archivedMessages,
      change: analytics.percentageChange?.archived,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/50"
    }
  ];

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={cn(
              "p-4 transition-all duration-200 hover:shadow-md",
              card.bgColor
            )}>
              <div className="flex items-center justify-between">
                <div className={cn("p-2 rounded-lg", card.bgColor)}>
                  <card.icon className={cn("h-5 w-5", card.color)} />
                </div>
                {card.change !== undefined && (
                  <div className={cn(
                    "flex items-center text-sm",
                    card.change > 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {card.change > 0 ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(card.change)}%
                  </div>
                )}
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
                <p className={cn(
                  "text-2xl font-bold mt-1",
                  card.color
                )}>
                  {card.value}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Message Trend</h3>
            <p className="text-sm text-muted-foreground flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Daily message activity
            </p>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.dailyMessageTrend}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                stroke="currentColor" 
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="currentColor"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="url(#colorCount)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};