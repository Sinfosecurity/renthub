"use client"

import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Settings, LogOut, Plus, Bell } from "lucide-react"
import { isAdmin, getUnreadNotificationCount } from "@/lib/data-service"
import { useState, useEffect } from "react"

export function Navigation() {
  const { user, loading, signOut } = useAuth()
  const [userIsAdmin, setUserIsAdmin] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const adminStatus = await isAdmin(user.id)
        setUserIsAdmin(adminStatus)

        // Get unread notification count
        const count = await getUnreadNotificationCount(user.id)
        setUnreadCount(count)
      }
    }
    checkAdminStatus()
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    window.location.href = "/"
  }

  return (
    <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-xl font-bold">RentHub</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/browse" className="text-gray-300 hover:text-white transition-colors">
              Browse
            </Link>
            <Link href="/profile" className="text-gray-300 hover:text-white transition-colors">
              Profile
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse" />
            ) : user ? (
              <>
                <Link href="/items/new">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    <Plus className="w-4 h-4 mr-2" />
                    List Item
                  </Button>
                </Link>

                {/* Notifications Button */}
                <Link href="/notifications">
                  <Button variant="ghost" className="relative text-gray-300 hover:text-white">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.user_metadata?.avatar_url || "/placeholder.svg"}
                          alt={user.user_metadata?.full_name}
                        />
                        <AvatarFallback>
                          {user.user_metadata?.full_name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("") || user.email?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-white">{user.user_metadata?.full_name || "User"}</p>
                        <p className="w-[200px] truncate text-sm text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="text-gray-300 hover:text-white">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/notifications" className="text-gray-300 hover:text-white">
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                        {unreadCount > 0 && (
                          <Badge className="ml-auto h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                            {unreadCount > 9 ? "9+" : unreadCount}
                          </Badge>
                        )}
                      </Link>
                    </DropdownMenuItem>
                    {userIsAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="text-gray-300 hover:text-white">
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="text-gray-300 hover:text-white">
                        <Settings className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem onClick={handleSignOut} className="text-gray-300 hover:text-white">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost" className="text-gray-300 hover:text-white">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
