import { Line } from 'react-chartjs-2';
import { Card } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface VisitorChartProps {
  data: {
    dates: string[];
    visitors: number[];
    pageViews: number[];
  };
  isLoading?: boolean;
  className?: string;
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
}

export const VisitorChart = ({
  data,
  isLoading = false,
  className,
  timeRange = '7d',
  onTimeRangeChange,
}: VisitorChartProps) => {
  const [hoveredDataset, setHoveredDataset] = useState<number | null>(null);

  if (isLoading) {
    return (
      <Card className={className}>
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-[300px] w-full" />
        </div>
      </Card>
    );
  }

  const chartData = {
    labels: data.dates,
    datasets: [
      {
        label: 'Unique Visitors',
        data: data.visitors,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: hoveredDataset === 0 ? 3 : 2,
        pointRadius: hoveredDataset === 0 ? 5 : 3,
        pointHoverRadius: 8,
      },
      {
        label: 'Page Views',
        data: data.pageViews,
        borderColor: 'rgb(244, 63, 94)',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: hoveredDataset === 1 ? 3 : 2,
        pointRadius: hoveredDataset === 1 ? 5 : 3,
        pointHoverRadius: 8,
      }
    ]
  };

  const options = {
    responsive: true,
    interaction: {
      intersect: false,
      mode: 'index' as const,
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
      }
    },
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
      },
    },
    transitions: {
      active: {
        animation: {
          duration: 300,
        },
      },
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
          <h3 className="text-lg font-semibold">Visitor Analytics</h3>
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative">
          <Line data={chartData} options={options} />
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
        </div>
      </motion.div>
    </Card>
  );
};
