import { FEATURES } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Target, ShieldCheck, Wand2, Briefcase, Users } from "lucide-react";

const iconMap = {
  LayoutDashboard,
  Target,
  ShieldCheck,
  Wand2,
  Briefcase,
  Users
};

export function Features() {
  return (
    <section id="features" className="py-20 dark:bg-gray-950/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            No Static Dashboards. No Generic Courses.
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            The interface changes based on who you are and what you want to achieve
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <Card key={feature.title} className="border-yellow-200 hover:border-yellow-300 transition-colors">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="rounded-lg bg-yellow-100 p-3 dark:bg-yellow-900/30">
                      <Icon className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
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
  );
}