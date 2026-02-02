"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Logo from "../logo/logo";
import { useAuth as useAuthContext } from "@/contexts/auth-context";
import { useAuth, useClerk } from "@clerk/nextjs";
import { NAV_LINKS } from "@/lib/constants";
import { usePathname } from "next/navigation";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { handleSignOut } = useAuthContext();
  const { isLoaded } = useAuth();
  const { user } = useClerk();
  const pathname=usePathname();

  const filteredNavLinks = NAV_LINKS.filter(link => {
    if (link.isProtected) {
      return user;
    }
    return true;
  });

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 shadow-sm shadow-black border-yellow-200/20 bg-white/80 backdrop-blur-md dark:bg-black/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center w-1/2 justify-between">
            <Link href="/" className="text-xl font-bold tracking-tighter text-yellow-600 dark:text-yellow-500">
              <Logo />
            </Link>
            <div className="hidden md:flex space-x-1">
              {filteredNavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`
                    relative px-4 py-2 text-sm font-medium transition-all duration-200
                    ${pathname === link.href
                      ? "text-yellow-600 dark:text-yellow-500"
                      : "text-gray-700 hover:text-yellow-600 dark:text-gray-300 dark:hover:text-yellow-500"
                    }
                    group
                  `}
                >
                  <span className="relative z-10">
                    {link.name}
                  </span>
                  
                  {/* Animated underline for active/hover state */}
                  <span className={`
                    absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2
                    bg-yellow-500 transition-all duration-300
                    ${pathname === link.href
                      ? "w-3/4 opacity-100"
                      : "group-hover:w-3/4 opacity-0 group-hover:opacity-100"
                    }
                  `} />
                  
                  {/* Background highlight on hover */}
                  <span className="absolute inset-0 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </Link>
              ))}
            </div>
          </div>
          {!isLoaded ? (
            <Loader2 className="h-5 w-5 animate-spin text-yellow-600" />
          ) : user ? (
            <>
              <div className="hidden md:flex items-center space-x-4">
                <Button
                  variant="outline"
                  className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                  asChild
                >
                  <Link href="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                  onClick={handleSignOut}
                >
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
                <Button
                  variant="outline"
                  className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                  asChild
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  asChild
                >
                  <Link href="/signup">Get Started</Link>
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
            <div className="flex flex-col space-y-1">
              <div className="space-y-1">
                {filteredNavLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium transition-colors
                      ${pathname === link.href
                        ? "text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                        : "text-gray-700 hover:text-yellow-600 dark:text-gray-300"
                      }
                    `}
                  >
                    <span className="relative">
                      {link.name}
                      {pathname === link.href && (
                        <span className="absolute -left-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-yellow-500" />
                      )}
                    </span>
                  </Link>
                ))}
                {user ? (
                  <>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-yellow-300 mt-2"
                      asChild
                    >
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-red-300 text-red-700 hover:bg-red-50"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-yellow-300 mt-2"
                      asChild
                    >
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    </Button>
                    <Button
                      className="w-full justify-start bg-yellow-500 hover:bg-yellow-600 mt-2"
                      asChild
                    >
                      <Link
                        href="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Get Started
                      </Link>
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