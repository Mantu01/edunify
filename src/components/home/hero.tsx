'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function Hero() {
  const { user } = useClerk();
  const [showVideo, setShowVideo] = useState(false);
  const youtubeUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-linear-to-br from-yellow-50/50 via-orange-50/30 to-transparent dark:from-yellow-950/20 dark:via-orange-950/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-50 px-4 py-2 mb-8 animate-in fade-in slide-in-from-bottom-3 duration-700 shadow-sm">
            <span className="text-sm font-medium text-yellow-700">
              AI-Native Learning Platform
            </span>
          </div>
          
          <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl lg:text-7xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            One platform where{" "}
            <span className="bg-linear-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              learning, teaching, and hiring
            </span>{" "}
            adapt to you
          </h1>
          
          <p className="mx-auto mt-8 max-w-2xl text-xl text-gray-600 dark:text-gray-300 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150">
            An AI-native workspace that builds personalized dashboards for students, 
            educators, and companies based on goals, skills, and context.
          </p>
          
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            <Button 
              size="lg" 
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link href={user ? '/room' : '/login'} className="flex items-center">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-orange-300 text-orange-700 hover:bg-orange-50 px-8 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => setShowVideo(true)}
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
          
          <div className="mt-20 grid gap-8 sm:grid-cols-3">
            <div className="group rounded-2xl border border-yellow-200 bg-yellow-50/30 p-6 dark:border-yellow-900 dark:bg-yellow-950/20 hover:shadow-lg hover:border-yellow-300 transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-7 duration-1000 delay-500">
              <h3 className="font-semibold text-yellow-700 dark:text-yellow-400 text-lg">
                For Students
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Learn skills through real projects and get hired based on performance
              </p>
            </div>
            
            <div className="group rounded-2xl border border-orange-200 bg-orange-50/30 p-6 dark:border-orange-900 dark:bg-orange-950/20 hover:shadow-lg hover:border-orange-300 transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-7 duration-1000 delay-700">
              <h3 className="font-semibold text-orange-700 dark:text-orange-400 text-lg">
                For Teachers
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Create, track progress, and scale educational impact with AI tools
              </p>
            </div>
            
            <div className="group rounded-2xl border border-green-200 bg-green-50/30 p-6 dark:border-green-900 dark:bg-green-950/20 hover:shadow-lg hover:border-green-300 transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-7 duration-1000 delay-900">
              <h3 className="font-semibold text-green-700 dark:text-green-400 text-lg">
                For Companies
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Hire based on verified skills and real project outcomes
              </p>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showVideo} onOpenChange={setShowVideo}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Platform Demo</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full">
            <iframe
              width="100%"
              height="100%"
              src={youtubeUrl}
              title="Platform Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}