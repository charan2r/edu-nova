"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { useCourses } from "@/lib/courses-context"
import { categories, type Course } from "@/lib/courses-data"
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Star,
  MoreVertical,
  Loader2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function InstructorDashboard() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { courses, addCourse, updateCourse, deleteCourse, getInstructorCourses } = useCourses()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "" as "Beginner" | "Intermediate" | "Advanced" | "",
    duration: "",
    lessons: 0,
    price: 0,
    tags: "",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else if (user?.role !== "instructor") {
      router.push("/student/dashboard")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "instructor") {
    return null
  }

  const instructorCourses = getInstructorCourses(user.id)
  const totalStudents = instructorCourses.reduce((sum, course) => sum + course.students, 0)
  const totalRevenue = instructorCourses.reduce((sum, course) => sum + course.price * course.students * 0.7, 0)
  const avgRating = instructorCourses.length > 0
    ? instructorCourses.reduce((sum, course) => sum + course.rating, 0) / instructorCourses.length
    : 0

  const stats = [
    {
      label: "Total Courses",
      value: instructorCourses.length,
      icon: BookOpen,
      color: "text-blue-500",
    },
    {
      label: "Total Students",
      value: totalStudents.toLocaleString(),
      icon: Users,
      color: "text-green-500",
    },
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-yellow-500",
    },
    {
      label: "Avg Rating",
      value: avgRating.toFixed(1),
      icon: TrendingUp,
      color: "text-primary",
    },
  ]

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      level: "",
      duration: "",
      lessons: 0,
      price: 0,
      tags: "",
    })
  }

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 500))

    addCourse({
      title: formData.title,
      description: formData.description,
      instructor: user.name,
      instructorId: user.id,
      category: formData.category,
      level: formData.level as "Beginner" | "Intermediate" | "Advanced",
      duration: formData.duration,
      lessons: formData.lessons,
      price: formData.price,
      image: "/api/placeholder/400/225",
      tags: formData.tags.split(",").map((tag) => tag.trim()),
    })

    setIsLoading(false)
    setIsCreateOpen(false)
    resetForm()
  }

  const handleEditCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCourse) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    updateCourse(editingCourse.id, {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      level: formData.level as "Beginner" | "Intermediate" | "Advanced",
      duration: formData.duration,
      lessons: formData.lessons,
      price: formData.price,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
    })

    setIsLoading(false)
    setIsEditOpen(false)
    setEditingCourse(null)
    resetForm()
  }

  const openEditDialog = (course: Course) => {
    setEditingCourse(course)
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      duration: course.duration,
      lessons: course.lessons,
      price: course.price,
      tags: course.tags.join(", "),
    })
    setIsEditOpen(true)
  }

  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      deleteCourse(courseId)
    }
  }

  const levelColors = {
    Beginner: "bg-green-500/10 text-green-500 border-green-500/20",
    Intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    Advanced: "bg-red-500/10 text-red-500 border-red-500/20",
  }

  const CourseForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => void, isEdit?: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Course Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Complete React Developer Course"
          required
          className="bg-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe what students will learn..."
          required
          className="min-h-[100px] bg-input"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger className="bg-input">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Level</Label>
          <Select
            value={formData.level}
            onValueChange={(value) => setFormData({ ...formData, level: value as any })}
          >
            <SelectTrigger className="bg-input">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="e.g., 24 hours"
            required
            className="bg-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lessons">Lessons</Label>
          <Input
            id="lessons"
            type="number"
            value={formData.lessons}
            onChange={(e) => setFormData({ ...formData, lessons: parseInt(e.target.value) || 0 })}
            placeholder="Number of lessons"
            required
            className="bg-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            placeholder="Course price"
            required
            className="bg-input"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="e.g., React, JavaScript, Frontend"
          className="bg-input"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            isEdit ? setIsEditOpen(false) : setIsCreateOpen(false)
            resetForm()
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEdit ? "Updating..." : "Creating..."}
            </>
          ) : (
            isEdit ? "Update Course" : "Create Course"
          )}
        </Button>
      </div>
    </form>
  )

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">
              Instructor Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your courses and track performance
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new course
                </DialogDescription>
              </DialogHeader>
              <CourseForm onSubmit={handleCreateCourse} />
            </DialogContent>
          </Dialog>
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

        {/* My Courses Section */}
        <section>
          <h2 className="mb-6 text-2xl font-bold">My Courses</h2>

          {instructorCourses.length > 0 ? (
            <div className="grid gap-4">
              {instructorCourses.map((course) => (
                <Card key={course.id} className="border-border bg-card">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <Badge variant="secondary" className={levelColors[course.level]}>
                            {course.level}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{course.category}</span>
                        </div>
                        <h3 className="mb-1 text-lg font-semibold">{course.title}</h3>
                        <p className="line-clamp-1 text-sm text-muted-foreground">
                          {course.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <span className="font-medium">{course.rating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{course.students.toLocaleString()} students</span>
                        </div>
                        <div className="font-semibold text-primary">
                          ${course.price.toFixed(2)}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(course)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Course
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteCourse(course.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Course
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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
                  Create your first course and start teaching
                </p>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Course
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
              <DialogDescription>
                Update the course details
              </DialogDescription>
            </DialogHeader>
            <CourseForm onSubmit={handleEditCourse} isEdit />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
