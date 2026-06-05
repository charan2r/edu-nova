"use client";

import { useEffect, useState, Suspense, lazy, useMemo } from "react";
import { Building2, Users, BookOpen, TrendingUp } from "lucide-react";
import { KPICard } from "@/components/kpi-card";

// Lazy load heavy chart components
const EnrollmentChart = lazy(
  () => import("@/components/charts/enrollment-chart"),
);
const CourseChart = lazy(() => import("@/components/charts/course-chart"));
const ActivityChart = lazy(() => import("@/components/charts/activity-chart"));

// Chart loading skeleton
function ChartSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border p-6 h-[350px] animate-pulse">
      <div className="h-4 w-32 bg-muted rounded mb-4" />
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-3 bg-muted rounded w-full" />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInstitutes: 42,
    totalStudents: 1020,
    totalCourses: 156,
    activeEnrollments: 987,
  });

  useEffect(() => {
    // Simulate API call with faster timeout
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

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

      {/* Charts - Lazy loaded */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend */}
        <Suspense fallback={<ChartSkeleton />}>
          <EnrollmentChart />
        </Suspense>

        {/* Courses by Category */}
        <Suspense fallback={<ChartSkeleton />}>
          <CourseChart />
        </Suspense>

        {/* User Activity */}
        <div className="lg:col-span-2">
          <Suspense fallback={<ChartSkeleton />}>
            <ActivityChart />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
