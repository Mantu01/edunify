'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

export function Hero() {
  const {user}=useClerk();
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="inline-flex items-center rounded-full border border-yellow-50 bg-yellow-50 px-4 py-2 mb-8">
            <span className="text-sm font-medium text-yellow-700">
              AI-Native Learning Platform
            </span>
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl lg:text-7xl">
            One platform where{" "}
            <span className="bg-linear-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              learning, teaching, and hiring
            </span>{" "}
            adapt to you
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
            An AI-native workspace that builds personalized dashboards for students, 
            educators, and companies based on goals, skills, and context.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-white px-8">
              <Link href={user?'/room':'/login'} className="flex items-center">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50 px-8">
              <PlayCircle className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          <div className="mt-20 grid gap-8 sm:grid-cols-3">
            <div className="rounded-2xl border border-yellow-200 bg-yellow-50/30 p-6 dark:border-yellow-900 dark:bg-yellow-950/20">
              <h3 className="font-semibold text-yellow-700 dark:text-yellow-400">For Students</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Learn skills through real projects and get hired based on performance
              </p>
            </div>
            <div className="rounded-2xl border border-orange-200 bg-orange-50/30 p-6 dark:border-orange-900 dark:bg-orange-950/20">
              <h3 className="font-semibold text-orange-700 dark:text-orange-400">For Teachers</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Create, track progress, and scale educational impact with AI tools
              </p>
            </div>
            <div className="rounded-2xl border border-green-200 bg-green-50/30 p-6 dark:border-green-900 dark:bg-green-950/20">
              <h3 className="font-semibold text-green-700 dark:text-green-400">For Companies</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Hire based on verified skills and real project outcomes
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}