import { Bar } from 'react-chartjs-2';
import { Card } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BlogAnalyticsProps {
  posts: Array<{
    title: string;
    views: number;
    likes: number;
    comments: number;
  }>;
}

export const BlogAnalytics = ({ posts }: BlogAnalyticsProps) => {
  const data = {
    labels: posts.map(post => post.title),
    datasets: [
      {
        label: 'Views',
        data: posts.map(post => post.views),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
      },
      {
        label: 'Likes',
        data: posts.map(post => post.likes),
        backgroundColor: 'rgba(244, 63, 94, 0.8)',
      },
      {
        label: 'Comments',
        data: posts.map(post => post.comments),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Blog Post Performance'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };

  return (
    <Card className="p-6">
      <Bar data={data} options={options} />
    </Card>
  );
};
