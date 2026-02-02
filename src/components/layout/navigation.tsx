"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/contexts/user-context";
import { Loader2 } from "lucide-react";
import Logo from "../logo/logo";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoading, logout } = useUser();

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 shadow-sm shadow-black border-yellow-200/20 bg-white/80 backdrop-blur-md dark:bg-black/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold tracking-tighter text-yellow-600 dark:text-yellow-500">
              <Logo/>
            </Link>
          </div>

          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-yellow-600" />
          ) : user ? (
            <>
              <div className="hidden md:flex items-center space-x-4">
                <Button variant="outline" className="border-yellow-300 text-yellow-700 hover:bg-yellow-50" asChild>
                  <Link href="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </Button>
                <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>

              <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </>
          ) : (
            <>
              <div className="hidden md:flex items-center space-x-4">
                <Button variant="outline" className="border-yellow-300 text-yellow-700 hover:bg-yellow-50" asChild>
                  <Link href='/login'>
                    Sign In
                  </Link>
                </Button>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white" asChild>
                  <Link href="/signup">
                    Get Started
                  </Link>
                </Button>
              </div>

              <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </>
          )}
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-yellow-100 py-4">
            <div className="flex flex-col space-y-3">
              <div className="px-4 pt-4 space-y-3">
                {user ? (
                  <>
                    <Button variant="outline" className="w-full border-yellow-300" asChild>
                      <Link href="/profile">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full border-yellow-300" asChild>
                      <Link href="/settings">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-50" onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full border-yellow-300" asChild>
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button className="w-full bg-yellow-500 hover:bg-yellow-600" asChild>
                      <Link href="/signup">Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}