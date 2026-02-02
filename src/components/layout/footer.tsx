import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin } from "lucide-react";
import Logo from "../logo/logo";

export function Footer() {
  return (
    <footer className="border-t border-yellow-200/20 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Logo/>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              An AI-native platform where learning, teaching, and hiring adapt to you.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Product</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="#features" className="text-sm text-gray-600 hover:text-yellow-600 dark:text-gray-300">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-sm text-gray-600 hover:text-yellow-600 dark:text-gray-300">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-gray-600 hover:text-yellow-600 dark:text-gray-300">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Company</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-yellow-600 dark:text-gray-300">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-gray-600 hover:text-yellow-600 dark:text-gray-300">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-gray-600 hover:text-yellow-600 dark:text-gray-300">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Connect</h4>
            <div className="mt-4 flex space-x-4">
              <Button variant="outline" size="icon" className="border-gray-300">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-gray-300">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-gray-300">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-800">
          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            © {new Date().getFullYear()} edunify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}