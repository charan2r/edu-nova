"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Play,
  ArrowRight,
  Code,
  Database,
  Cloud,
  Shield,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const stats = [
  { label: "Active Students", value: "50,000+" },
  { label: "Expert Instructors", value: "200+" },
  { label: "Courses Available", value: "500+" },
  { label: "Completion Rate", value: "94%" },
];

const features = [
  {
    icon: Code,
    title: "Fullstack Development",
    description:
      "Learn React, Node.js, and other modern web technologies with hands-on projects.",
  },
  {
    icon: Database,
    title: "Data Science",
    description:
      "Learn Python, machine learning, and data analysis from industry experts.",
  },
  {
    icon: Cloud,
    title: "Cloud Computing",
    description: "Get certified in AWS, Azure, and Google Cloud platforms.",
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    description:
      "Protect digital assets with ethical hacking and security fundamentals.",
  },
];

const benefits = [
  "Self-paced learning with lifetime access",
  "Real-world projects and case studies",
  "Certificate of completion",
  "AI-powered course recommendations",
];

export function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI-Powered Learning Platform</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
              Build IT Skills with <span className="text-primary">Guided</span>{" "}
              Courses
            </h1>
            <p className="mb-8 text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Join others growing in tech. Learn Fullstack development, machine
              learning, and get helpful advice from AI.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="min-w-[180px]">
                <Link href="/register">
                  Start Learning Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="min-w-[180px]"
              >
                <Link href="/courses">
                  <Play className="mr-2 h-4 w-4" />
                  Browse Courses
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/*<section className="border-y border-border bg-card/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>*/}

      {/* Features Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Learn In-Demand Skills
            </h2>
            <p className="text-muted-foreground">
              Our program is built by experts to teach you the most needed
              technologies.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border-border bg-card transition-colors hover:border-primary/50"
              >
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-card/50 py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                Why Choose Edu Nova?
              </h2>
              <p className="mb-8 text-muted-foreground">
                We use modern technology and expert teaching to provide a great
                online learning experience.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-border bg-card p-6">
                <BookOpen className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-semibold">Learn at Your Pace</h3>
                <p className="text-sm text-muted-foreground">
                  Access course materials anytime, anywhere. Learn on your
                  schedule.
                </p>
              </Card>
              <Card className="border-border bg-card p-6 sm:mt-8">
                <Users className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-semibold">Join the Community</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with fellow learners and industry professionals.
                </p>
              </Card>
              <Card className="border-border bg-card p-6">
                <GraduationCap className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-semibold">Expert Instructors</h3>
                <p className="text-sm text-muted-foreground">
                  Learn from professionals with real-world experience.
                </p>
              </Card>
              <Card className="border-border bg-card p-6 sm:mt-8">
                <Award className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-semibold">Get Certified</h3>
                <p className="text-sm text-muted-foreground">
                  Earn certificates to showcase your new skills.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 text-center sm:p-12">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="mb-8 text-muted-foreground">
              Join thousands of learners who have transformed their careers with
              Edu Nova. Start with our free courses or get personalized
              recommendations from our AI assistant.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/register">Create Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">Edu Nova</span>
            </div>
            <p className="text-sm text-muted-foreground">
              2026 Edu Nova. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
