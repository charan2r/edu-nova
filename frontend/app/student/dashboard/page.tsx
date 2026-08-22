"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { CourseCard } from "@/components/course-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useCourses } from "@/lib/courses-context";
import { useChat } from "@/lib/chat-context";
import {
  BookOpen,
  GraduationCap,
  Clock,
  Trophy,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Route,
  Loader2,
} from "lucide-react";
import {
  LearningPathData,
  getMyLearningPath,
} from "@/lib/learning-path-api";
import { LearningPathDialog } from "@/components/learning-path-dialog";
import { AdaptiveRoadmap } from "@/components/adaptive-roadmap";

export default function StudentDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { courses, enrolledCourses } = useCourses();
  const { openChat } = useChat();

  const [learningPath, setLearningPath] = useState<LearningPathData | null>(null);
  const [isLoadingPath, setIsLoadingPath] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user?.role !== "student") {
      router.push("/instructor/dashboard");
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    async function fetchLearningPath() {
      if (!isAuthenticated) return;
      try {
        const response = await getMyLearningPath();
        setLearningPath(response.learningPath);
      } catch (err) {
        console.error("Failed to load learning path:", err);
      } finally {
        setIsLoadingPath(false);
      }
    }

    fetchLearningPath();
  }, [isAuthenticated]);

  if (!isAuthenticated || user?.role !== "student") {
    return null;
  }

  const enrolledCourseData = courses.filter((course) =>
    enrolledCourses.includes(course.id),
  );

  const stats = [
    {
      label: "Enrolled Courses",
      value: enrolledCourses.length,
      icon: BookOpen,
      color: "text-blue-500",
    },
    {
      label: "Learning Path Steps",
      value: learningPath ? `${learningPath.steps.filter((s) => s.status === "completed").length}/${learningPath.steps.length}` : "0",
      icon: Route,
      color: "text-purple-500",
    },
    {
      label: "Hours Planned",
      value: learningPath ? `${learningPath.steps.reduce((sum, s) => sum + s.estimatedHours, 0)}h` : "0h",
      icon: Clock,
      color: "text-green-500",
    },
    {
      label: "Weekly Target",
      value: learningPath ? `${learningPath.weeklyHours}h` : "0h",
      icon: Trophy,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Your personalized, AI-driven adaptive learning workspace
            </p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="shadow-sm"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {learningPath ? "Customize Learning Path" : "Create Learning Path"}
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border bg-card">
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`rounded-lg bg-secondary p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Adaptive Learning Path Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Route className="h-6 w-6 text-primary" />
              Your Adaptive Learning Roadmap
            </h2>
          </div>

          {isLoadingPath ? (
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                <p className="text-sm text-muted-foreground">
                  Loading your personalized curriculum...
                </p>
              </CardContent>
            </Card>
          ) : learningPath ? (
            <AdaptiveRoadmap
              learningPath={learningPath}
              onPathUpdated={(updated) => setLearningPath(updated)}
              onOpenGenerator={() => setIsDialogOpen(true)}
            />
          ) : (
            <Card className="border-dashed border-2 border-primary/40 bg-gradient-to-br from-primary/5 via-background to-secondary/30">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center max-w-xl mx-auto space-y-4">
                <div className="rounded-2xl bg-primary/15 p-4 ring-8 ring-primary/5">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">
                    No Adaptive Learning Path Yet
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Tell our AI your career goals, current skills, and weekly schedule. We will generate a prerequisite-ordered curriculum from the catalog just for you.
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={() => setIsDialogOpen(true)}
                  className="mt-2"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate My AI Learning Path
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* AI Assistant Banner */}
        <Card className="border-primary/50 bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/20 p-3">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Need Instant Advice?</h3>
                <p className="text-sm text-muted-foreground">
                  Chat with the AI Course Advisor anytime for custom course recommendations and path planning
                </p>
              </div>
            </div>
            <Button onClick={openChat}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Ask AI Assistant
            </Button>
          </CardContent>
        </Card>

        {/* My Enrolled Courses Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Enrolled Courses</h2>
            {enrolledCourseData.length > 0 && (
              <Button variant="ghost" asChild>
                <Link href="/courses">
                  Browse more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>

          {enrolledCourseData.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {enrolledCourseData.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  showEnrollButton={false}
                />
              ))}
            </div>
          ) : (
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="mb-2 font-semibold">No direct enrollments yet</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Browse individual courses or start with your adaptive learning path steps above
                </p>
                <Button asChild variant="outline">
                  <Link href="/courses">Browse Catalog</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      {/* Intake Dialog */}
      <LearningPathDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onPathGenerated={(path) => setLearningPath(path)}
      />
    </div>
  );
}

