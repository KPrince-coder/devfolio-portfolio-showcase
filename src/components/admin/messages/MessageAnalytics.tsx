import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Activity, 
  TrendingUp, 
  MessageCircle, 
  Archive 
} from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MessageAnalyticsProps {
  analytics: {
    totalMessages: number;
    unreadMessages: number;
    repliedMessages: number;
    archivedMessages: number;
    dailyMessageTrend: Array<{ date: string; count: number }>;
  };
}

export const MessageAnalytics: React.FC<MessageAnalyticsProps> = ({ analytics }) => {
  const analyticsCards = [
    {
      icon: MessageCircle,
      title: "Total Messages",
      value: analytics.totalMessages,
      color: "text-blue-600 bg-blue-50"
    },
    {
      icon: Activity,
      title: "Unread Messages",
      value: analytics.unreadMessages,
      color: "text-red-600 bg-red-50"
    },
    {
      icon: TrendingUp,
      title: "Replied Messages",
      value: analytics.repliedMessages,
      color: "text-green-600 bg-green-50"
    },
    {
      icon: Archive,
      title: "Archived Messages",
      value: analytics.archivedMessages,
      color: "text-purple-600 bg-purple-50"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {analyticsCards.map((card) => (
          <Card 
            key={card.title} 
            className={`p-4 flex items-center ${card.color}`}
          >
            <card.icon className="mr-4 h-8 w-8" />
            <div>
              <p className="text-sm font-medium">{card.title}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Daily Message Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.dailyMessageTrend}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};