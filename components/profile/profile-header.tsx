"use client"

import { useState } from "react"
import { Calendar, MapPin, Shield, Edit, Camera } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { EditProfileModal } from "./edit-profile-modal"
import type { Profile } from "@/lib/data-service"
import type { User } from "@supabase/supabase-js"

interface ProfileHeaderProps {
  profile: Profile
  user: User
}

export function ProfileHeader({ profile, user }: ProfileHeaderProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  return (
    <>
      <Card className="bg-gray-900/50 border-gray-700 mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center md:items-start">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-gray-700">
                  <AvatarImage
                    src={
                      profile.avatar_url || user.user_metadata?.avatar_url || "/placeholder.svg?height=128&width=128"
                    }
                    alt={profile.full_name}
                  />
                  <AvatarFallback className="text-2xl bg-gray-800">
                    {profile.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 border-gray-600 bg-gray-800 hover:bg-gray-700"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{profile.full_name}</h1>
                    {profile.is_verified && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-400">{profile.email}</p>
                </div>
                <Button
                  onClick={() => setIsEditModalOpen(true)}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              {/* Profile Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.location && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{profile.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Joined {new Date(profile.joined_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <div className="pt-2">
                  <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <EditProfileModal profile={profile} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </>
  )
}
