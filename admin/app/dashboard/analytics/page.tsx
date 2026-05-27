'use client'

import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { KPICard } from '@/components/kpi-card'
import { TrendingUp, Users, Clock, CheckCircle } from 'lucide-react'

const courseEnrollmentData = [
  { course: 'Web Dev', enrollments: 450 },
  { course: 'Business', enrollments: 380 },
  { course: 'Science', enrollments: 320 },
  { course: 'Arts', enrollments: 220 },
  { course: 'Medical', enrollments: 290 },
]

const completionRateData = [
  { month: 'Jan', completed: 65, pending: 35 },
  { month: 'Feb', completed: 72, pending: 28 },
  { month: 'Mar', completed: 68, pending: 32 },
  { month: 'Apr', completed: 80, pending: 20 },
  { month: 'May', completed: 75, pending: 25 },
  { month: 'Jun', completed: 82, pending: 18 },
]

const institutePerformanceData = [
  { name: 'Tech Institute', value: 28, fill: 'hsl(var(--chart-1))' },
  { name: 'Business Academy', value: 22, fill: 'hsl(var(--chart-2))' },
  { name: 'Science Hub', value: 25, fill: 'hsl(var(--chart-3))' },
  { name: 'Arts Institute', value: 15, fill: 'hsl(var(--chart-4))' },
  { name: 'Medical College', value: 10, fill: 'hsl(var(--chart-5))' },
]

const engagementScoreData = [
  { week: 'Week 1', engagement: 72 },
  { week: 'Week 2', engagement: 78 },
  { week: 'Week 3', engagement: 75 },
  { week: 'Week 4', engagement: 82 },
  { week: 'Week 5', engagement: 85 },
  { week: 'Week 6', engagement: 88 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Avg Completion Rate"
          value="76%"
          change={8}
          icon={<CheckCircle size={24} />}
        />
        <KPICard
          title="Avg Engagement Score"
          value="82/100"
          change={5}
          icon={<TrendingUp size={24} />}
        />
        <KPICard
          title="Active Learners"
          value="2,450"
          change={12}
          icon={<Users size={24} />}
        />
        <KPICard
          title="Avg Time per Course"
          value="12 hrs"
          change={-3}
          icon={<Clock size={24} />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Enrollments */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Enrollments by Course</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseEnrollmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="course" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="enrollments" fill="hsl(var(--primary))" name="Enrollments" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Institute Distribution */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Students by Institute</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={institutePerformanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {institutePerformanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Completion Rates */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Course Completion Rates</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={completionRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="completed" stackId="a" fill="hsl(var(--accent))" name="Completed" radius={[8, 8, 0, 0]} />
              <Bar dataKey="pending" stackId="a" fill="hsl(var(--muted))" name="Pending" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Trend */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Engagement Score Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementScoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="engagement" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
                name="Engagement Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
