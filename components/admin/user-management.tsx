"use client"

import { useState, useEffect } from "react"
import { Shield, ShieldCheck, User, Search, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { supabase } from "@/lib/supabase"
import type { Profile } from "@/lib/data-service"

export function UserManagement() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [updatingUser, setUpdatingUser] = useState<string | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setError("")
      const { data, error } = await supabase.from("profiles").select("*").order("joined_at", { ascending: false })

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

      console.log("Fetched users:", data)
      setUsers(data || [])
    } catch (error: any) {
      console.error("Error fetching users:", error)
      setError("Failed to load users. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    setUpdatingUser(userId)
    try {
      const { error } = await supabase.from("profiles").update({ is_admin: !currentStatus }).eq("id", userId)

      if (error) throw error

      // Update local state
      setUsers(users.map((user) => (user.id === userId ? { ...user, is_admin: !currentStatus } : user)))
    } catch (error: any) {
      console.error("Error updating admin status:", error)
      setError("Failed to update admin status")
    } finally {
      setUpdatingUser(null)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <Card className="bg-gray-900/50 border-gray-700">
        <CardContent className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400" />
          <p className="text-gray-400">Loading users...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-gray-900/50 border-gray-700">
        <CardContent className="p-12 text-center">
          <div className="text-red-400 mb-4">
            <p>{error}</p>
          </div>
          <Button onClick={fetchUsers} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (users.length === 0) {
    return (
      <Card className="bg-gray-900/50 border-gray-700">
        <CardContent className="p-12 text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
          <h3 className="text-xl font-semibold mb-2 text-gray-300">No users found</h3>
          <p className="text-gray-400">No users have registered yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <User className="w-5 h-5" />
          User Management ({users.length} users)
        </CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-gray-700">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-800/50">
                <TableHead className="text-gray-300">User</TableHead>
                <TableHead className="text-gray-300">Email</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Joined</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-gray-700 hover:bg-gray-800/50">
                  <TableCell className="text-gray-300">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar_url || "/placeholder.svg?height=32&width=32"} />
                        <AvatarFallback className="bg-gray-700 text-gray-300">
                          {user.full_name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.full_name || "Unknown User"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.is_admin ? (
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                          <User className="w-3 h-3 mr-1" />
                          User
                        </Badge>
                      )}
                      {user.is_verified && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Verified</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {user.joined_at ? new Date(user.joined_at).toLocaleDateString() : "Unknown"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                      disabled={updatingUser === user.id}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      {updatingUser === user.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : user.is_admin ? (
                        <>
                          <Shield className="w-4 h-4 mr-1" />
                          Remove Admin
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 mr-1" />
                          Make Admin
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredUsers.length === 0 && searchTerm && (
          <div className="text-center py-8 text-gray-400">No users found matching "{searchTerm}".</div>
        )}
      </CardContent>
    </Card>
  )
}
