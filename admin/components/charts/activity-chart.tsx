"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Memoized data
const ACTIVITY_DATA = [
  { week: "Week 1", active: 600, inactive: 200 },
  { week: "Week 2", active: 750, inactive: 150 },
  { week: "Week 3", active: 920, inactive: 100 },
  { week: "Week 4", active: 1100, inactive: 80 },
];

export default function ActivityChart() {
  const data = useMemo(() => ACTIVITY_DATA, []);

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        User Activity
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="active"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))" }}
            name="Active Users"
          />
          <Line
            type="monotone"
            dataKey="inactive"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--muted-foreground))" }}
            name="Inactive Users"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
