import { FEATURES, HOW_IT_WORKS, ROLES } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, Target, ShieldCheck, Wand2, Briefcase, Users } from "lucide-react";
import { Footer } from "@/components/layout/footer";

const iconMap = {
  LayoutDashboard,
  Target,
  ShieldCheck,
  Wand2,
  Briefcase,
  Users
};

const colorClasses: Record<string, string> = {
  yellow: "border-yellow-300 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20",
  orange: "border-orange-300 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20",
  green: "border-green-300 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20"
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-yellow-50/20 via-white to-orange-50/20 dark:from-gray-950 dark:via-black dark:to-gray-900">
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-2 mb-8">
              <span className="text-sm font-medium text-amber-700">
                AI-Native Learning Platform
              </span>
            </div>
            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
              About{" "}
              <span className="bg-linear-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                EduNify
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              An AI-native workspace that builds personalized dashboards for students, educators, and companies. The interface adapts to who you are and what you want to achieve—no static dashboards, no generic courses.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 dark:bg-gray-950/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              What Makes EduNify Different
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              The interface changes based on who you are and what you want to achieve
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = iconMap[feature.icon as keyof typeof iconMap];
              return (
                <Card key={feature.title} className="border-amber-200 hover:border-amber-300 transition-colors dark:border-amber-900">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="rounded-lg bg-amber-100 p-3 dark:bg-amber-900/30">
                        <Icon className="h-6 w-6 text-amber-600 dark:text-amber-500" />
                      </div>
                      <CardTitle className="text-lg text-gray-900 dark:text-white">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Simple steps to transform how you learn, teach, or hire
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((item) => (
              <Card key={item.step} className="border-orange-200 dark:border-orange-900">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                      <span className="text-xl font-bold">{item.step}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="mb-2 text-gray-900 dark:text-white">{item.title}</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 dark:bg-gray-950/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Built for Everyone
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Choose your role and get a workspace designed for your goals
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {ROLES.map((role) => (
              <Card key={role.title} className={colorClasses[role.color] || colorClasses.yellow}>
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">{role.title}</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" asChild>
                    <Link href="/signup" className="flex items-center justify-center">
                      {role.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Join EduNify and experience learning, teaching, and hiring that adapts to you.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white px-8" asChild>
              <Link href="/signup" className="flex items-center">
                Create Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50 px-8" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
