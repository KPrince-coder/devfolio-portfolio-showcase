import { Card } from "@/components/ui/card";
import { WorldMap } from "react-svg-worldmap";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface GeographicDataPoint {
  country: string;
  value: number;
  code: string; // ISO country code
  trend: number;
  previousValue?: number;
}

interface GeographicHeatmapProps {
  data: GeographicDataPoint[];
  isLoading?: boolean;
  className?: string;
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
  mapStyle?: string;
  onMapStyleChange?: (style: string) => void;
}

export const GeographicHeatmap = ({
  data,
  isLoading = false,
  className,
  timeRange = '7d',
  onTimeRangeChange,
  mapStyle = 'visitors',
  onMapStyleChange,
}: GeographicHeatmapProps) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-40" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-[120px]" />
              <Skeleton className="h-10 w-[120px]" />
            </div>
          </div>
          <Skeleton className="h-[400px] w-full" />
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const mapData = data.map(item => ({
    country: item.code,
    value: item.value,
  }));

  const topCountries = data
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const totalVisitors = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className={cn("p-6", className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-semibold"
          >
            Geographic Distribution
          </motion.h3>
          <div className="flex gap-2">
            <Select
              value={timeRange}
              onValueChange={onTimeRangeChange}
            >
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
            <Select
              value={mapStyle}
              onValueChange={onMapStyleChange}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Map Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visitors">Visitors</SelectItem>
                <SelectItem value="pageviews">Page Views</SelectItem>
                <SelectItem value="sessions">Sessions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-[400px] relative"
        >
          <WorldMap
            color="rgb(99, 102, 241)"
            valueSuffix="visitors"
            data={mapData}
            size="responsive"
            tooltipBgColor="rgb(55, 65, 81)"
            tooltipTextColor="white"
            styleFunction={(context) => {
              const isHovered = context.countryCode === hoveredCountry;
              const value = data.find(d => d.code === context.countryCode)?.value || 0;
              const maxValue = Math.max(...data.map(d => d.value));
              const opacity = value ? 0.2 + (value / maxValue) * 0.8 : 0.1;
              
              return {
                fill: value
                  ? `rgba(99, 102, 241, ${opacity})`
                  : 'rgb(229, 231, 235)',
                stroke: isHovered ? 'rgb(99, 102, 241)' : 'white',
                strokeWidth: isHovered ? 2 : 0.5,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              };
            }}
            onClickFunction={(_, code) => {
              setHoveredCountry(code === hoveredCountry ? null : code);
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow-lg backdrop-blur-sm"
          >
            <div className="text-xs text-muted-foreground mb-1">Total Visitors</div>
            <div className="text-2xl font-bold">
              {totalVisitors.toLocaleString()}
            </div>
          </motion.div>
        </motion.div>

        <div className="mt-6 grid grid-cols-5 gap-4">
          <AnimatePresence mode="wait">
            {topCountries.map((country, index) => (
              <motion.div
                key={country.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setHoveredCountry(country.code)}
                onHoverEnd={() => setHoveredCountry(null)}
                className={cn(
                  "p-4 rounded-lg border transition-all",
                  hoveredCountry === country.code
                    ? "bg-accent border-accent-foreground shadow-lg"
                    : "bg-card hover:shadow-md"
                )}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="w-full text-left">
                      <div>
                        <div className="text-2xl mb-1 font-bold">{country.code}</div>
                        <div className="font-semibold">{country.value.toLocaleString()}</div>
                        <div
                          className={cn(
                            "text-xs font-medium",
                            country.trend > 0 ? "text-green-500" : "text-red-500"
                          )}
                        >
                          {country.trend > 0 ? "+" : ""}
                          {country.trend}%
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Country: {country.country}
                        <br />
                        Current: {country.value.toLocaleString()}
                        <br />
                        Previous: {country.previousValue?.toLocaleString() || "N/A"}
                        <br />
                        Change: {country.trend > 0 ? "+" : ""}
                        {country.trend}%
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </Card>
  );
};
