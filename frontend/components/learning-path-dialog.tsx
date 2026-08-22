"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Target, Zap, Clock, Compass, AlertCircle } from "lucide-react";
import {
  generateLearningPath,
  LearningPathData,
  GeneratePathInput,
} from "@/lib/learning-path-api";
import { useToast } from "@/hooks/use-toast";

interface LearningPathDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPathGenerated: (path: LearningPathData) => void;
}

const CAREER_SUGGESTIONS = [
  "Full Stack Developer",
  "Frontend Web Developer",
  "Backend Node.js Developer",
  "DevOps Engineer",
  "Cloud & Cybersecurity Specialist",
  "Data Science & AI Practitioner",
];

const SKILL_SUGGESTIONS = [
  "HTML/CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "Git",
  "SQL",
  "Docker",
  "AWS",
];

export function LearningPathDialog({
  open,
  onOpenChange,
  onPathGenerated,
}: LearningPathDialogProps) {
  const { toast } = useToast();
  const [careerGoal, setCareerGoal] = useState("");
  const [currentSkillsText, setCurrentSkillsText] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<
    "beginner" | "intermediate" | "advanced"
  >("beginner");
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleSkill = (skill: string) => {
    const canonical = skill.toLowerCase();
    if (selectedSkills.includes(canonical)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== canonical));
    } else {
      setSelectedSkills([...selectedSkills, canonical]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerGoal.trim()) {
      setErrorMessage("Please specify your career goal or target role.");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    // Combine tags and manual text
    const manualSkills = currentSkillsText
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    const combinedSkills = Array.from(new Set([...selectedSkills, ...manualSkills]));

    try {
      const payload: GeneratePathInput = {
        careerGoal: careerGoal.trim(),
        currentSkills: combinedSkills,
        experienceLevel,
        weeklyHours: Number(weeklyHours) || 10,
      };

      const response = await generateLearningPath(payload);

      if (response.status === "created" && response.learningPath) {
        toast({
          title: "Adaptive Learning Path Generated!",
          description: `Customized roadmap created for ${response.learningPath.careerGoal}.`,
        });
        onPathGenerated(response.learningPath);
        onOpenChange(false);
      } else if (response.status === "clarification-required") {
        setErrorMessage(
          response.question ||
            "Please provide more specifics about your learning goal."
        );
      } else if (response.status === "no-matching-courses") {
        setErrorMessage(
          response.message ||
            "No published courses in the catalog currently match these skill gaps."
        );
      } else if (response.status === "prerequisites-unavailable") {
        setErrorMessage(
          "Some courses require foundational prerequisites not currently met. Try adding relevant starting skills."
        );
      } else {
        setErrorMessage(response.message || "Failed to generate path.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to generate learning path.";
      setErrorMessage(msg);
      toast({
        title: "Generation Failed",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <DialogTitle className="text-xl">
              AI Adaptive Learning Path Generator
            </DialogTitle>
          </div>
          <DialogDescription>
            Tell our AI what you want to achieve. We will analyze your skill gap and build a step-by-step ordered roadmap tailored to your schedule.
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-xs uppercase tracking-wider">Notice</p>
              <p className="text-xs">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* 1. Career Goal */}
          <div className="space-y-2">
            <Label htmlFor="careerGoal" className="text-sm font-medium flex items-center gap-1.5">
              <Target className="h-4 w-4 text-primary" /> Target Career Goal / Role *
            </Label>
            <Input
              id="careerGoal"
              placeholder="e.g., Full Stack Web Developer, Cloud Architect"
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              disabled={isLoading}
              required
            />
            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {CAREER_SUGGESTIONS.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setCareerGoal(item)}
                  className="text-xs px-2.5 py-1 rounded-full border border-border bg-secondary/40 hover:bg-primary/20 hover:border-primary/40 transition-colors text-muted-foreground hover:text-foreground"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Current Skills */}
          <div className="space-y-2">
            <Label htmlFor="currentSkills" className="text-sm font-medium flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-500" /> Current Skills & Technologies Already Known
            </Label>
            <div className="flex flex-wrap gap-1.5 pb-1">
              {SKILL_SUGGESTIONS.map((skill) => {
                const active = selectedSkills.includes(skill.toLowerCase());
                return (
                  <Badge
                    key={skill}
                    variant={active ? "default" : "outline"}
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => toggleSkill(skill)}
                  >
                    {active ? "✓ " : "+ "}
                    {skill}
                  </Badge>
                );
              })}
            </div>
            <Input
              id="currentSkills"
              placeholder="Add other skills (comma-separated, e.g., git, sql, tailwind)"
              value={currentSkillsText}
              onChange={(e) => setCurrentSkillsText(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* 3. Experience Level & Weekly Hours Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-blue-500" /> Experience Level
              </Label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["beginner", "intermediate", "advanced"] as const).map((lvl) => (
                  <Button
                    key={lvl}
                    type="button"
                    variant={experienceLevel === lvl ? "default" : "outline"}
                    size="sm"
                    className="capitalize text-xs h-9"
                    onClick={() => setExperienceLevel(lvl)}
                    disabled={isLoading}
                  >
                    {lvl}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-emerald-500" /> Time Commitment / Week
              </Label>
              <div className="grid grid-cols-4 gap-1.5">
                {[5, 10, 15, 20].map((hours) => (
                  <Button
                    key={hours}
                    type="button"
                    variant={weeklyHours === hours ? "default" : "outline"}
                    size="sm"
                    className="text-xs h-9"
                    onClick={() => setWeeklyHours(hours)}
                    disabled={isLoading}
                  >
                    {hours} hrs
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !careerGoal.trim()}
              className="min-w-[160px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Path...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Build My Path
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
