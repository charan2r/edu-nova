"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Memoized data
const ENROLLMENT_DATA = [
  { month: "Jan", students: 400, institutes: 24 },
  { month: "Feb", students: 520, institutes: 28 },
  { month: "Mar", students: 680, institutes: 32 },
  { month: "Apr", students: 750, institutes: 35 },
  { month: "May", students: 890, institutes: 38 },
  { month: "Jun", students: 1020, institutes: 42 },
];

export default function EnrollmentChart() {
  const data = useMemo(() => ENROLLMENT_DATA, []);

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Enrollment Trend
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Area
            type="monotone"
            dataKey="students"
            stroke="hsl(var(--primary))"
            fillOpacity={1}
            fill="url(#colorStudents)"
            name="Students"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
