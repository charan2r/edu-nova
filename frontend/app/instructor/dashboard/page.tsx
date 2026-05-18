"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import { useCourses } from "@/lib/courses-context";
import { categories, type Course } from "@/lib/courses-data";
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
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function InstructorDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const {
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    getInstructorCourses,
  } = useCourses();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    content: "",
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isCreateOpen) {
      setFormData({ name: "", description: "", content: "" });
      setImageFile(null);
      setFormError(null);
    }
  }, [isCreateOpen]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user?.role !== "instructor") {
      router.push("/student/dashboard");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "instructor") {
    return null;
  }

  const instructorCourses = getInstructorCourses(user.id);
  const totalStudents = instructorCourses.reduce(
    (sum, course) => sum + course.students,
    0,
  );
  const avgRating =
    instructorCourses.length > 0
      ? instructorCourses.reduce((sum, course) => sum + course.rating, 0) /
        instructorCourses.length
      : 0;

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
  ];

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!formData.name.trim()) {
      setFormError("Course title is required");
      return;
    }
    if (!formData.description.trim()) {
      setFormError("Description is required");
      return;
    }
    if (!formData.content.trim()) {
      setFormError("Course content/syllabus is required");
      return;
    }
    if (!imageFile) {
      setFormError("Please select a course image");
      return;
    }

    setIsLoading(true);

    try {
      await addCourse(
        {
          title: formData.name,
          description: formData.description,
          instructor: user.name,
          instructorId: user.id,
          image: "/api/placeholder/400/225",
        },
        imageFile,
        formData.content,
      );
      setIsCreateOpen(false);
      // Reset is handled by useEffect on isCreateOpen change
    } catch (err) {
      console.error("Error creating course:", err);
      setFormError(
        err instanceof Error ? err.message : "Failed to create course",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      await updateCourse(editingCourse.id, {
        title: formData.name,
        description: formData.description,
        instructor: user.name,
        instructorId: user.id,
        image: editingCourse.image,
      });
      setIsEditOpen(false);
      setEditingCourse(null);
    } catch (err) {
      console.error("Error updating course:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse(courseId);
      } catch (err) {
        console.error("Error deleting course:", err);
      }
    }
  };

  const CourseForm = ({
    onSubmit,
    isEdit = false,
  }: {
    onSubmit: (e: React.FormEvent) => void;
    isEdit?: boolean;
  }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      {formError && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
          {formError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Course Title *</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            setFormError(null);
          }}
          placeholder="e.g., Complete React Developer Course"
          required
          disabled={isLoading}
          className="bg-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => {
            setFormData({ ...formData, description: e.target.value });
            setFormError(null);
          }}
          placeholder="Describe what students will learn..."
          required
          disabled={isLoading}
          className="min-h-[100px] bg-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Course Content / Syllabus *</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => {
            setFormData({ ...formData, content: e.target.value });
            setFormError(null);
          }}
          placeholder="Outline the course content and lessons..."
          required
          disabled={isLoading}
          className="min-h-[120px] bg-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Course Image *</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setImageFile(file);
              setFormError(null);
            }
          }}
          disabled={isLoading}
          className="bg-input cursor-pointer"
        />
        {imageFile && (
          <p className="text-sm text-green-600 flex items-center gap-2">
            ✓ Selected: {imageFile.name}
          </p>
        )}
        {!imageFile && (
          <p className="text-xs text-muted-foreground">
            Supported formats: JPG, PNG, GIF, WebP
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsCreateOpen(false);
          }}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !imageFile}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Course"
          )}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Instructor Dashboard</h1>
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
                        <h3 className="mb-1 text-lg font-semibold">
                          {course.title}
                        </h3>
                        <p className="line-clamp-1 text-sm text-muted-foreground">
                          {course.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <span className="font-medium">
                            {course.rating.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {course.students.toLocaleString()} students
                          </span>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
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
              <DialogDescription>Update the course details</DialogDescription>
            </DialogHeader>
            <CourseForm onSubmit={handleEditCourse} isEdit />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
