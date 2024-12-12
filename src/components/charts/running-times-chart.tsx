import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Database } from "@/utils/supabase/autogen.types";

const RunningTimesChart = ({data} : { data: Database["public"]["Tables"]["times"]["Row"][]}) => {
  // Transform the data
  // We'll subtract the time in seconds from a baseline (30 minutes = 1800 seconds)
  // This way, faster times will have higher values
  type TransformedDatum = {
    year: number
    value: number
    originalTime: number
  }
  const transformedData: TransformedDatum[] = data.map(run => ({
    year: run.year,
    value: 1800 - run.time,  // Higher value = better performance
    originalTime: run.time  // Keep original time for tooltip
  }));

  const formatYAxis = (value: number) => {
    // Convert the transformed value back to a time
    const seconds = 1800 - value;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const CustomTooltip = ({ active, payload } : { active: boolean, payload: {payload: TransformedDatum}[]}) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="text-sm">Time: {payload[0].payload.originalTime}</p>
          <p className="text-sm">Date: {payload[0].payload.year}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>5K Running Times Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <LineChart width={600} height={400} data={transformedData} margin={{ top: 20, right: 30, left: 50, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={formatYAxis} />
          {/* @ts-expect-error: some type thing */}
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            name="Running Time"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ fill: '#2563eb', strokeWidth: 2 }}
          />
        </LineChart>
      </CardContent>
    </Card>
  );
};

export default RunningTimesChart