import { Card } from "@/components/ui/card";
import { WorldMap } from "react-svg-worldmap";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface GeographicDataPoint {
  country: string;
  value: number;
  code: string; // ISO country code
  trend: number;
}

interface GeographicHeatmapProps {
  data: GeographicDataPoint[];
}

export const GeographicHeatmap = ({ data }: GeographicHeatmapProps) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [mapStyle, setMapStyle] = useState('visitors');

  const mapData = data.map(item => ({
    country: item.code,
    value: item.value,
  }));

  const topCountries = data
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <Card className="p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Geographic Distribution</h3>
          <div className="flex gap-2">
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
            <Select value={mapStyle} onValueChange={setMapStyle}>
              <SelectTrigger className="w-[120px]">
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

        <div className="h-[400px] relative">
          <WorldMap
            color="rgb(99, 102, 241)"
            valueSuffix="visitors"
            data={mapData}
            size="responsive"
            tooltipBgColor="rgb(55, 65, 81)"
            tooltipTextColor="white"
            styleFunction={(context) => ({
              fill: context.countryCode === 'US' ? 'rgb(99, 102, 241)' : 'rgb(229, 231, 235)',
              stroke: 'white',
              strokeWidth: 0.5,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            })}
          />
          <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg shadow-lg backdrop-blur-sm">
            <div className="text-xs text-muted-foreground mb-1">Total Visitors</div>
            <div className="text-2xl font-bold">
              {data.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-5 gap-4">
          {topCountries.map((country) => (
            <motion.div
              key={country.code}
              className="text-center p-3 rounded-lg bg-muted/50"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-2xl mb-1">{country.code}</div>
              <div className="font-semibold">{country.value.toLocaleString()}</div>
              <div className={`text-xs ${country.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {country.trend > 0 ? '+' : ''}{country.trend}%
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Most Active Time</div>
            <div className="text-xl font-semibold mt-1">14:00 - 16:00 UTC</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Top Region</div>
            <div className="text-xl font-semibold mt-1">North America</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Growth Rate</div>
            <div className="text-xl font-semibold mt-1 text-green-500">+12.5%</div>
          </Card>
        </div>
      </motion.div>
    </Card>
  );
};
