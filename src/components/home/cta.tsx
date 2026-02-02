'use client'

import { ROLES } from "@/lib/constants";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const colorClasses = {
  yellow: "border-yellow-300 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20",
  orange: "border-orange-300 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20",
  green: "border-green-300 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20"
};

export function CtaSection() {
  const {user}=useUser();
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Ready to Transform Your Journey?
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Join thousands who are already experiencing adaptive learning and hiring
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {ROLES.map((role) => (
            <Card key={role.title} className={colorClasses[role.color as keyof typeof colorClasses]}>
              <CardHeader>
                <CardTitle>{role.title}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {role.description}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href={user?'/room':`/login?role=${role.role}`} className="flex items-center justify-center">
                    {role.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="rounded-2xl border border-red-200 bg-red-50/30 p-8 dark:border-red-900 dark:bg-red-950/20">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Why It's Different
            </h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <h4 className="font-semibold text-red-700 dark:text-red-400">UI Adapts</h4>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Interface evolves with your goals
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-red-700 dark:text-red-400">Learning = Proof</h4>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Every lesson produces verifiable outcomes
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-red-700 dark:text-red-400">Measurable Impact</h4>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Track progress and educational outcomes
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-red-700 dark:text-red-400">Performance First</h4>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Hiring based on skills, not credentials
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}