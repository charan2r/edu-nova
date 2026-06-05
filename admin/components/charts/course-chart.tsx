"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Memoized data
const COURSE_DATA = [
  { name: "Engineering", students: 320 },
  { name: "Business", students: 280 },
  { name: "Arts", students: 220 },
  { name: "Science", students: 350 },
  { name: "Commerce", students: 290 },
];

export default function CourseChart() {
  const data = useMemo(() => COURSE_DATA, []);

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Students by Course
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Bar
            dataKey="students"
            fill="hsl(var(--accent))"
            name="Students"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
