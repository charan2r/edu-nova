"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LearningPathData,
  LearningPathStep,
  updateStepStatus,
  deleteMyLearningPath,
} from "@/lib/learning-path-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Lock,
  PlayCircle,
  Clock,
  Calendar,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Target,
  GraduationCap,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdaptiveRoadmapProps {
  learningPath: LearningPathData;
  onPathUpdated: (path: LearningPathData | null) => void;
  onOpenGenerator: () => void;
}

export function AdaptiveRoadmap({
  learningPath,
  onPathUpdated,
  onOpenGenerator,
}: AdaptiveRoadmapProps) {
  const { toast } = useToast();
  const [updatingStepId, setUpdatingStepId] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const completedStepsCount = learningPath.steps.filter(
    (s) => s.status === "completed"
  ).length;
  const totalStepsCount = learningPath.steps.length;
  const progressPercentage =
    totalStepsCount > 0
      ? Math.round((completedStepsCount / totalStepsCount) * 100)
      : 0;

  const handleStepComplete = async (stepId: string) => {
    setUpdatingStepId(stepId);
    try {
      const response = await updateStepStatus(stepId, "completed");
      toast({
        title: "Step Completed!",
        description: "Great progress! The next step in your path is now unlocked.",
      });
      onPathUpdated(response.learningPath);
    } catch (err) {
      toast({
        title: "Failed to update step",
        description:
          err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setUpdatingStepId(null);
    }
  };

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset your current learning path?")) {
      return;
    }

    setIsResetting(true);
    try {
      await deleteMyLearningPath();
      toast({
        title: "Learning Path Reset",
        description: "You can now generate a new personalized path.",
      });
      onPathUpdated(null);
    } catch (err) {
      toast({
        title: "Reset Failed",
        description:
          err instanceof Error ? err.message : "Failed to reset learning path",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="border-border bg-card overflow-hidden relative shadow-sm">
        <div className="absolute top-0 right-0 h-32 w-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Adaptive AI Path
                </Badge>
                {learningPath.status === "completed" && (
                  <Badge variant="default" className="bg-emerald-500 text-white">
                    Path Completed! 🎉
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl font-bold">
                {learningPath.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                <Target className="h-4 w-4 text-primary" />
                Target Goal: <span className="font-medium text-foreground">{learningPath.careerGoal}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenGenerator}
                className="text-xs"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1 text-primary" />
                Re-generate
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                disabled={isResetting}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                {isResetting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                )}
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-secondary/50 border border-border">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-blue-500" /> Duration
              </p>
              <p className="text-lg font-bold mt-0.5">
                ~{learningPath.estimatedWeeks} Weeks
              </p>
            </div>

            <div className="p-3 rounded-lg bg-secondary/50 border border-border">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-emerald-500" /> Pace
              </p>
              <p className="text-lg font-bold mt-0.5">
                {learningPath.weeklyHours} hrs/week
              </p>
            </div>

            <div className="p-3 rounded-lg bg-secondary/50 border border-border">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <GraduationCap className="h-3.5 w-3.5 text-purple-500" /> Total Steps
              </p>
              <p className="text-lg font-bold mt-0.5">
                {totalStepsCount} Courses
              </p>
            </div>

            <div className="p-3 rounded-lg bg-secondary/50 border border-border">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-500" /> Progress
              </p>
              <p className="text-lg font-bold mt-0.5">
                {progressPercentage}%
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Path Progress</span>
              <span>
                {completedStepsCount} of {totalStepsCount} courses completed
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Skills Breakdown Badges */}
          <div className="space-y-2 pt-2 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Skills You are Building in this Path
            </p>
            <div className="flex flex-wrap gap-1.5">
              {learningPath.missingSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs capitalize">
                  + {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step by Step Timeline / Roadmap */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span>Curriculum Sequence</span>
          <span className="text-xs text-muted-foreground font-normal">
            (Prerequisites ordered dynamically)
          </span>
        </h3>

        <div className="space-y-4 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-border before:hidden sm:before:block">
          {learningPath.steps.map((step, idx) => {
            const courseObj = typeof step.course === "object" ? step.course : null;
            const courseId = courseObj ? courseObj._id : step.course;
            const isCompleted = step.status === "completed";
            const isAvailable = step.status === "available" || step.status === "in-progress";
            const isLocked = step.status === "locked";
            const isUpdating = updatingStepId === step._id;

            return (
              <div
                key={step._id}
                className={`relative flex flex-col sm:flex-row gap-4 p-5 rounded-xl border transition-all ${
                  isCompleted
                    ? "bg-secondary/30 border-border opacity-90"
                    : isAvailable
                    ? "bg-card border-primary/50 shadow-md ring-1 ring-primary/20"
                    : "bg-secondary/20 border-border/50 opacity-70"
                }`}
              >
                {/* Step Circle Indicator */}
                <div className="flex items-center gap-3 sm:block sm:pt-0.5">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-sm z-10 transition-colors ${
                      isCompleted
                        ? "bg-emerald-500 text-white"
                        : isAvailable
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : isLocked ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      step.order
                    )}
                  </div>
                  <span className="sm:hidden font-semibold text-sm">
                    Step {step.order}: {step.title}
                  </span>
                </div>

                {/* Card Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Step {step.order}
                        </span>
                        {courseObj?.level && (
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {courseObj.level}
                          </Badge>
                        )}
                        {courseObj?.category && (
                          <Badge variant="secondary" className="text-[10px] capitalize">
                            {courseObj.category.replace("-", " ")}
                          </Badge>
                        )}
                      </div>
                      <h4 className="text-base font-semibold mt-1">
                        {step.title}
                      </h4>
                    </div>

                    <div className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                      <Clock className="h-3.5 w-3.5" />
                      <span>~{step.estimatedHours} Hours</span>
                    </div>
                  </div>

                  {/* AI Rationale */}
                  <div className="p-3 rounded-lg bg-secondary/60 border border-border/60 text-xs">
                    <p className="text-muted-foreground flex items-start gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-foreground">Why this step:</strong> {step.reason}
                      </span>
                    </p>
                  </div>

                  {/* Skills Gained */}
                  {step.skillsGained && step.skillsGained.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] text-muted-foreground">Skills Gained:</span>
                      {step.skillsGained.map((skill) => (
                        <span
                          key={skill}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    {isAvailable && (
                      <>
                        <Button size="sm" asChild className="h-8 text-xs">
                          <Link href={`/courses/${courseId}`}>
                            <PlayCircle className="h-3.5 w-3.5 mr-1" />
                            Go to Course
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStepComplete(step._id)}
                          disabled={isUpdating}
                          className="h-8 text-xs"
                        >
                          {isUpdating ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                          ) : (
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                          )}
                          Mark Complete
                        </Button>
                      </>
                    )}

                    {isCompleted && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 bg-emerald-500/10">
                          ✓ Completed
                        </Badge>
                        <Button size="sm" variant="ghost" asChild className="h-7 text-xs">
                          <Link href={`/courses/${courseId}`}>
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Review
                          </Link>
                        </Button>
                      </div>
                    )}

                    {isLocked && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Lock className="h-3.5 w-3.5" />
                        <span>Complete previous step to unlock</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
