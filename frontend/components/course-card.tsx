"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { type Course } from "@/lib/courses-data";
import { useCourses } from "@/lib/courses-context";
import { useAuth } from "@/lib/auth-context";
import { Users, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (enrolled) {
      handleUnenroll();
    } else {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmEnroll = async () => {
    try {
      setIsLoading(true);
      await enrollInCourse(course.id);
      setShowConfirmDialog(false);
    } catch (error) {
      console.error("Failed to enroll:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnenroll = async () => {
    try {
      setIsLoading(true);
      await unenrollFromCourse(course.id);
    } catch (error) {
      console.error("Failed to unenroll:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="flex h-full flex-col border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg">
        {/* Course Image */}
        <div className="relative aspect-video overflow-hidden rounded-t-lg bg-secondary">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover"
          />

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
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{course.students.toLocaleString()} students</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-center ">
          {showEnrollButton && user?.role !== "instructor" && (
            <Button
              size="sm"
              variant={enrolled ? "outline" : "default"}
              onClick={handleEnrollClick}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : enrolled ? "Unenroll" : "Enroll Now"}
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Enrollment Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Enrollment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to enroll in <strong>{course.title}</strong>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2">
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmEnroll}
              disabled={isLoading}
            >
              {isLoading ? "Enrolling..." : "Confirm"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
