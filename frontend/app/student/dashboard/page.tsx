"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { CourseCard } from "@/components/course-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import { useCourses } from "@/lib/courses-context"
import { 
  BookOpen, 
  GraduationCap, 
  Clock, 
  Trophy,
  ArrowRight,
  MessageSquare,
  Sparkles
} from "lucide-react"

export default function StudentDashboard() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { courses, enrolledCourses } = useCourses()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else if (user?.role !== "student") {
      router.push("/instructor/dashboard")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "student") {
    return null
  }

  const enrolledCourseData = courses.filter((course) => 
    enrolledCourses.includes(course.id)
  )

  const recommendedCourses = courses
    .filter((course) => !enrolledCourses.includes(course.id))
    .slice(0, 4)

  const stats = [
    {
      label: "Enrolled Courses",
      value: enrolledCourses.length,
      icon: BookOpen,
      color: "text-blue-500",
    },
    {
      label: "Hours Learned",
      value: Math.floor(Math.random() * 50) + 10,
      icon: Clock,
      color: "text-green-500",
    },
    {
      label: "Certificates",
      value: Math.floor(enrolledCourses.length / 2),
      icon: GraduationCap,
      color: "text-yellow-500",
    },
    {
      label: "Achievements",
      value: enrolledCourses.length * 2,
      icon: Trophy,
      color: "text-primary",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">
            Welcome back, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">
            Continue your learning journey and track your progress
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        {/* AI Assistant Card */}
        <Card className="mb-8 border-primary/50 bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/20 p-3">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Need Help Choosing?</h3>
                <p className="text-sm text-muted-foreground">
                  Get personalized course recommendations from our AI assistant
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/ai-assistant">
                <MessageSquare className="mr-2 h-4 w-4" />
                Ask AI Assistant
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* My Courses Section */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Courses</h2>
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
            <div className="space-y-4">
              {enrolledCourseData.map((course) => (
                <Card key={course.id} className="border-border bg-card">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <div className="mb-1 text-xs font-medium text-primary">
                          {course.category}
                        </div>
                        <h3 className="mb-1 font-semibold">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          by {course.instructor} &bull; {course.lessons} lessons
                        </p>
                      </div>
                      <div className="w-full sm:w-48">
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{Math.floor(Math.random() * 60) + 20}%</span>
                        </div>
                        <Progress value={Math.floor(Math.random() * 60) + 20} className="h-2" />
                      </div>
                      <Button variant="outline" size="sm">
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="mb-2 font-semibold">No courses yet</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Start your learning journey by enrolling in a course
                </p>
                <Button asChild>
                  <Link href="/courses">Browse Courses</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Recommended Courses */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recommended For You</h2>
            <Button variant="ghost" asChild>
              <Link href="/courses">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recommendedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
