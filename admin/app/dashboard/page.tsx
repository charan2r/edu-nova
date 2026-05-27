'use client'

import { useEffect, useState } from 'react'
import { Building2, Users, BookOpen, TrendingUp } from 'lucide-react'
import { KPICard } from '@/components/kpi-card'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'

// Mock data for charts
const enrollmentData = [
  { month: 'Jan', students: 400, institutes: 24 },
  { month: 'Feb', students: 520, institutes: 28 },
  { month: 'Mar', students: 680, institutes: 32 },
  { month: 'Apr', students: 750, institutes: 35 },
  { month: 'May', students: 890, institutes: 38 },
  { month: 'Jun', students: 1020, institutes: 42 },
]

const courseData = [
  { name: 'Engineering', students: 320 },
  { name: 'Business', students: 280 },
  { name: 'Arts', students: 220 },
  { name: 'Science', students: 350 },
  { name: 'Commerce', students: 290 },
]

const userGrowthData = [
  { week: 'Week 1', active: 600, inactive: 200 },
  { week: 'Week 2', active: 750, inactive: 150 },
  { week: 'Week 3', active: 920, inactive: 100 },
  { week: 'Week 4', active: 1100, inactive: 80 },
]

export default function DashboardPage() {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalInstitutes: 42,
    totalStudents: 1020,
    totalCourses: 156,
    activeEnrollments: 987,
  })

  useEffect(() => {
    // Simulate API call
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Institutes"
          value={stats.totalInstitutes}
          change={12}
          icon={<Building2 size={24} />}
          loading={loading}
        />
        <KPICard
          title="Total Students"
          value={stats.totalStudents}
          change={23}
          icon={<Users size={24} />}
          loading={loading}
        />
        <KPICard
          title="Total Courses"
          value={stats.totalCourses}
          change={8}
          icon={<BookOpen size={24} />}
          loading={loading}
        />
        <KPICard
          title="Active Enrollments"
          value={stats.activeEnrollments}
          change={18}
          icon={<TrendingUp size={24} />}
          loading={loading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Enrollment Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={enrollmentData}>
              <defs>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
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

        {/* Courses by Category */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Students by Course</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="students" fill="hsl(var(--accent))" name="Students" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User Activity */}
        <div className="bg-card rounded-lg border border-border p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-foreground mb-4">User Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="active" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
                name="Active Users"
              />
              <Line 
                type="monotone" 
                dataKey="inactive" 
                stroke="hsl(var(--muted-foreground))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--muted-foreground))' }}
                name="Inactive Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
