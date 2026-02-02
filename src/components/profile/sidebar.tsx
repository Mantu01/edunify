'use client'

import { SignOutButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, LogOut, History } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"

export function Sidebar() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'profile'
  const navigation = [
    {
      name: "Profile",
      href: "/profile?type=info",
      icon: LayoutDashboard,
    },
    {
      name: "Activity",
      href: "/profile?type=activity",
      icon: History,
    },
  ]

  return (
    <div className="w-full lg:w ">
      <div className="rounded-xl border shadow-sm p-6 bg-amber-50">
        <nav className="space-y-2 ">
          {navigation.map((item) => {
            const isActive = type === item.href.split('=')[1]
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="mt-8 pt-6 border-t">
          <SignOutButton>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </SignOutButton>
        </div>
      </div>
    </div>
  )
}