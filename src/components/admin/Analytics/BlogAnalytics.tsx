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
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BlogPost {
  title: string;
  views: number;
  likes: number;
  comments: number;
}

interface BlogAnalyticsProps {
  posts: BlogPost[];
  isLoading?: boolean;
  className?: string;
  sortBy?: 'views' | 'likes' | 'comments';
  onSortChange?: (sort: 'views' | 'likes' | 'comments') => void;
}

export const BlogAnalytics = ({
  posts,
  isLoading = false,
  className,
  sortBy = 'views',
  onSortChange,
}: BlogAnalyticsProps) => {
  const [hoveredDataset, setHoveredDataset] = useState<number | null>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  if (isLoading) {
    return (
      <Card className={className}>
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      </Card>
    );
  }

  // Sort posts based on selected metric
  const sortedPosts = [...posts].sort((a, b) => b[sortBy] - a[sortBy]);

  const data = {
    labels: sortedPosts.map(post => post.title),
    datasets: [
      {
        label: 'Views',
        data: sortedPosts.map(post => post.views),
        backgroundColor: hoveredDataset === 0 ? 'rgba(99, 102, 241, 0.9)' : 'rgba(99, 102, 241, 0.8)',
        borderRadius: 4,
        borderWidth: hoveredDataset === 0 ? 2 : 0,
        borderColor: 'rgb(79, 82, 221)',
        hoverBackgroundColor: 'rgba(99, 102, 241, 1)',
      },
      {
        label: 'Likes',
        data: sortedPosts.map(post => post.likes),
        backgroundColor: hoveredDataset === 1 ? 'rgba(244, 63, 94, 0.9)' : 'rgba(244, 63, 94, 0.8)',
        borderRadius: 4,
        borderWidth: hoveredDataset === 1 ? 2 : 0,
        borderColor: 'rgb(224, 43, 74)',
        hoverBackgroundColor: 'rgba(244, 63, 94, 1)',
      },
      {
        label: 'Comments',
        data: sortedPosts.map(post => post.comments),
        backgroundColor: hoveredDataset === 2 ? 'rgba(34, 197, 94, 0.9)' : 'rgba(34, 197, 94, 0.8)',
        borderRadius: 4,
        borderWidth: hoveredDataset === 2 ? 2 : 0,
        borderColor: 'rgb(14, 177, 74)',
        hoverBackgroundColor: 'rgba(34, 197, 94, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        onHover: (event: any, legendItem: any) => {
          setHoveredDataset(legendItem.datasetIndex);
        },
        onLeave: () => {
          setHoveredDataset(null);
        },
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgb(255, 255, 255)',
        bodyColor: 'rgb(255, 255, 255)',
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false,
        },
        ticks: {
          callback: (value: any) => value.toLocaleString(),
          padding: 10,
        },
        border: {
          dash: [4, 4],
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          padding: 10,
        },
      },
    },
    animation: {
      duration: 1000,
      onProgress: (animation: any) => {
        if (animation.currentStep === animation.numSteps) {
          setHoveredBar(null);
        }
      },
    },
    onHover: (event: any, elements: any) => {
      if (elements && elements.length) {
        setHoveredBar(elements[0].index);
      } else {
        setHoveredBar(null);
      }
    },
  };

  return (
    <Card className={className}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Blog Post Performance</h3>
          <Select
            value={sortBy}
            onValueChange={(value: 'views' | 'likes' | 'comments') =>
              onSortChange?.(value)
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="views">Sort by Views</SelectItem>
              <SelectItem value="likes">Sort by Likes</SelectItem>
              <SelectItem value="comments">Sort by Comments</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="h-[400px] relative">
          <Bar data={data} options={options} />
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
        </div>
      </motion.div>
    </Card>
  );
};
