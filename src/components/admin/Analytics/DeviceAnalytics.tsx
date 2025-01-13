import { Card } from "@/components/ui/card";
import { Doughnut } from 'react-chartjs-2';
import { Laptop, Smartphone, Tablet, Monitor } from "lucide-react";
import { motion } from "framer-motion";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
}

interface DeviceAnalyticsProps {
  data: DeviceData;
  className?: string;
}

export const DeviceAnalytics = ({ data, className }: DeviceAnalyticsProps) => {
  const [timeRange, setTimeRange] = useState('7d');
  const total = Object.values(data).reduce((acc, val) => acc + val, 0);
  
  const devices: DeviceInfo[] = [
    { icon: Monitor, label: 'Desktop', color: 'rgb(99, 102, 241)', value: data.desktop },
    { icon: Smartphone, label: 'Mobile', color: 'rgb(244, 63, 94)', value: data.mobile },
    { icon: Tablet, label: 'Tablet', color: 'rgb(34, 197, 94)', value: data.tablet },
  ];

  const chartData = {
    labels: devices.map(d => d.label),
    datasets: [{
      data: devices.map(d => d.value),
      backgroundColor: devices.map(d => d.color),
      borderColor: 'transparent',
      hoverOffset: 4
    }]
  };

  const options = {
    cutout: '75%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    maintainAspectRatio: false
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
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="relative h-[200px] mb-6">
          <Doughnut data={chartData} options={options} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold">{total.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Visits</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {devices.map((device) => (
            <motion.div
              key={device.label}
              className="text-center"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-center mb-2">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${device.color}20` }}
                >
                  <device.icon 
                    className="h-6 w-6"
                    style={{ color: device.color }}
                  />
                </div>
              </div>
              <div className="text-sm font-medium">{device.label}</div>
              <div className="text-2xl font-bold">
                {((device.value / total) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                {device.value.toLocaleString()} visits
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Card>
  );
};
