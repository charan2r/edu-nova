import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  GraduationCap, 
  Users, 
  Award, 
  Globe,
  Target,
  Heart,
  Lightbulb,
  ArrowRight
} from "lucide-react"

const team = [
  {
    name: "Sarah Chen",
    role: "CEO & Founder",
    bio: "Former engineering lead at a top tech company with 15+ years in education technology.",
  },
  {
    name: "Michael Roberts",
    role: "CTO",
    bio: "Full-stack developer and architect with experience building scalable learning platforms.",
  },
  {
    name: "Emily Johnson",
    role: "Head of Curriculum",
    bio: "PhD in Computer Science with a passion for making complex topics accessible.",
  },
  {
    name: "David Kim",
    role: "Head of AI",
    bio: "Machine learning expert focused on personalized learning experiences.",
  },
]

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "We strive to provide the highest quality education through expert instructors and rigorous curriculum.",
  },
  {
    icon: Heart,
    title: "Accessibility",
    description: "Education should be accessible to everyone, regardless of background or location.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We continuously explore new technologies and teaching methods to enhance learning.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Learning is better together. We foster a supportive community of learners and educators.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero Section */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold sm:text-5xl">
                Empowering the Next Generation of{" "}
                <span className="text-primary">Tech Professionals</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Edu Nova was founded with a simple mission: make high-quality IT education 
                accessible to everyone. We believe that with the right guidance and resources, 
                anyone can build a successful career in technology.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-border bg-card/50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <p className="text-3xl font-bold">50,000+</p>
                <p className="text-muted-foreground">Active Learners</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <GraduationCap className="h-7 w-7 text-primary" />
                </div>
                <p className="text-3xl font-bold">200+</p>
                <p className="text-muted-foreground">Expert Instructors</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Award className="h-7 w-7 text-primary" />
                </div>
                <p className="text-3xl font-bold">500+</p>
                <p className="text-muted-foreground">Courses Available</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Globe className="h-7 w-7 text-primary" />
                </div>
                <p className="text-3xl font-bold">120+</p>
                <p className="text-muted-foreground">Countries Reached</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold">Our Values</h2>
              <p className="text-muted-foreground">
                These core values guide everything we do at Edu Nova
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <Card key={value.title} className="border-border bg-card">
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-card/50 py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold">Meet Our Team</h2>
              <p className="text-muted-foreground">
                Passionate educators and technologists dedicated to your success
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member) => (
                <Card key={member.name} className="border-border bg-card">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-2xl font-bold text-primary">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="mb-2 text-sm text-primary">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 text-center sm:p-12">
              <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
                Ready to Start Learning?
              </h2>
              <p className="mb-8 text-muted-foreground">
                Join our community of learners and take the first step toward your new career in tech.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/register">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/courses">Browse Courses</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            2026 Edu Nova. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
