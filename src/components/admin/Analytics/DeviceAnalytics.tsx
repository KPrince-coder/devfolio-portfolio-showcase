import { Card } from "@/components/ui/card";
import { Doughnut } from 'react-chartjs-2';
import { Laptop, Smartphone, Tablet, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DeviceData {
  desktop: number;
  mobile: number;
  tablet: number;
  other?: number;
}

interface DeviceInfo {
  icon: React.ElementType;
  label: string;
  color: string;
  value: number;
  percentage: number;
}

interface DeviceAnalyticsProps {
  data: DeviceData;
  className?: string;
  isLoading?: boolean;
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
}

export const DeviceAnalytics = ({
  data,
  className,
  isLoading = false,
  timeRange = '7d',
  onTimeRangeChange,
}: DeviceAnalyticsProps) => {
  const [hoveredDevice, setHoveredDevice] = useState<string | null>(null);
  const total = Object.values(data).reduce((acc, val) => acc + val, 0);

  if (isLoading) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="flex justify-center">
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </div>
      </Card>
    );
  }
  
  const devices: DeviceInfo[] = [
    {
      icon: Monitor,
      label: 'Desktop',
      color: 'rgb(99, 102, 241)',
      value: data.desktop,
      percentage: (data.desktop / total) * 100,
    },
    {
      icon: Smartphone,
      label: 'Mobile',
      color: 'rgb(244, 63, 94)',
      value: data.mobile,
      percentage: (data.mobile / total) * 100,
    },
    {
      icon: Tablet,
      label: 'Tablet',
      color: 'rgb(34, 197, 94)',
      value: data.tablet,
      percentage: (data.tablet / total) * 100,
    },
    ...(data.other ? [{
      icon: Laptop,
      label: 'Other',
      color: 'rgb(161, 161, 170)',
      value: data.other,
      percentage: (data.other / total) * 100,
    }] : []),
  ];

  const chartData = {
    labels: devices.map(d => d.label),
    datasets: [{
      data: devices.map(d => d.value),
      backgroundColor: devices.map(d => d.color),
      borderColor: devices.map(d => hoveredDevice === d.label ? '#fff' : 'transparent'),
      borderWidth: 2,
      hoverOffset: 8,
      hoverBorderWidth: 3,
    }]
  };

  const options = {
    cutout: '75%',
    plugins: {
      legend: {
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
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value.toLocaleString()} (${percentage}%)`;
          },
        },
      }
    },
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      animateScale: true,
    },
    onHover: (event: any, elements: any) => {
      if (elements && elements.length) {
        const index = elements[0].index;
        setHoveredDevice(devices[index].label);
      } else {
        setHoveredDevice(null);
      }
    },
  };

  return (
    <Card className={cn("p-6", className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Device Distribution</h3>
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time Range" />
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
        
        <div className="relative h-[200px] mb-6">
          <Doughnut data={chartData} options={options} />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-3xl font-bold"
              >
                {total.toLocaleString()}
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sm text-muted-foreground"
              >
                Total Visits
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <AnimatePresence>
            {devices.map((device, index) => (
              <motion.div
                key={device.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setHoveredDevice(device.label)}
                onHoverEnd={() => setHoveredDevice(null)}
                className={cn(
                  "p-4 rounded-lg border transition-colors",
                  hoveredDevice === device.label
                    ? "bg-accent border-accent-foreground"
                    : "bg-card border-border"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-md"
                    style={{ backgroundColor: `${device.color}20` }}
                  >
                    <device.icon
                      className="h-5 w-5"
                      style={{ color: device.color }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{device.label}</p>
                    <p className="text-2xl font-bold">
                      {device.percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </Card>
  );
};
