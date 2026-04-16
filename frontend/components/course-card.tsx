"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Course } from "@/lib/courses-data";
import { useCourses } from "@/lib/courses-context";
import { useAuth } from "@/lib/auth-context";
import { Star, Users, Clock, BookOpen, CheckCircle } from "lucide-react";

interface CourseCardProps {
  course: Course;
  showEnrollButton?: boolean;
}

export function CourseCard({
  course,
  showEnrollButton = true,
}: CourseCardProps) {
  const { enrollInCourse, unenrollFromCourse, isEnrolled } = useCourses();
  const { isAuthenticated, user } = useAuth();
  const enrolled = isEnrolled(course.id);

  const handleEnroll = () => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    if (enrolled) {
      unenrollFromCourse(course.id);
    } else {
      enrollInCourse(course.id);
    }
  };

  const levelColors = {
    Beginner: "bg-green-500/10 text-green-500 border-green-500/20",
    Intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    Advanced: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <Card className="flex h-full flex-col border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg">
      {/* Course Image */}
      <div className="relative aspect-video overflow-hidden rounded-t-lg bg-secondary">
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/30" />
        </div>

        {enrolled && (
          <div className="absolute right-3 top-3">
            <Badge className="bg-primary text-primary-foreground">
              <CheckCircle className="mr-1 h-3 w-3" />
              Enrolled
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col p-4">
        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-tight">
          {course.title}
        </h3>

        {/* Description */}
        <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted-foreground">
          {course.description}
        </p>

        {/* Instructor */}
        <p className="mb-3 text-sm text-muted-foreground">
          by{" "}
          <span className="font-medium text-foreground">
            {course.instructor}
          </span>
        </p>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span className="font-medium text-foreground">
              {course.rating.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.students.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border p-4">
        {showEnrollButton && user?.role !== "instructor" && (
          <Button
            size="sm"
            variant={enrolled ? "outline" : "default"}
            onClick={handleEnroll}
          >
            {enrolled ? "Unenroll" : "Enroll Now"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
