"use client"

import { useState } from "react"
import { Bell, Calendar, CheckCircle, X, Clock, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { NotificationModal } from "./notification-modal"
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/data-service"
import type { Notification } from "@/lib/data-service"

interface NotificationsListProps {
  notifications: Notification[]
}

export function NotificationsList({ notifications: initialNotifications }: NotificationsListProps) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [loading, setLoading] = useState(false)

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const handleNotificationClick = async (notification: Notification) => {
    setSelectedNotification(notification)

    // Mark as read if not already read
    if (!notification.is_read) {
      try {
        await markNotificationAsRead(notification.id)
        setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n)))
      } catch (error) {
        console.error("Error marking notification as read:", error)
      }
    }
  }

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return

    setLoading(true)
    try {
      await markAllNotificationsAsRead(notifications[0]?.user_id)
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    } finally {
      setLoading(false)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking_request":
        return <Calendar className="w-5 h-5 text-blue-400" />
      case "booking_approved":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "booking_rejected":
        return <X className="w-5 h-5 text-red-400" />
      case "booking_cancelled":
        return <X className="w-5 h-5 text-orange-400" />
      default:
        return <Bell className="w-5 h-5 text-gray-400" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "booking_request":
        return "border-blue-500/30 bg-blue-500/10"
      case "booking_approved":
        return "border-green-500/30 bg-green-500/10"
      case "booking_rejected":
        return "border-red-500/30 bg-red-500/10"
      case "booking_cancelled":
        return "border-orange-500/30 bg-orange-500/10"
      default:
        return "border-gray-500/30 bg-gray-500/10"
    }
  }

  if (notifications.length === 0) {
    return (
      <Card className="bg-gray-900/50 border-gray-700">
        <CardContent className="p-12 text-center">
          <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
          <h3 className="text-xl font-semibold mb-2 text-gray-300">No notifications yet</h3>
          <p className="text-gray-400">You'll see booking requests and updates here</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header with Mark All as Read */}
        {unreadCount > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={loading}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              {loading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Marking...
                </>
              ) : (
                "Mark all as read"
              )}
            </Button>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`bg-gray-900/50 border-gray-700 cursor-pointer transition-all hover:bg-gray-800/50 ${
                !notification.is_read ? "ring-1 ring-blue-500/30" : ""
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-white mb-1">
                          {notification.title}
                          {!notification.is_read && <Badge className="ml-2 h-2 w-2 p-0 bg-blue-500" />}
                        </h3>
                        <p className="text-gray-400 text-sm mb-2">{notification.message}</p>

                        {/* Booking Info Preview */}
                        {notification.booking && (
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {notification.type === "booking_request"
                                ? notification.booking.renter?.full_name
                                : notification.booking.owner?.full_name}
                            </span>
                            <span>{notification.booking.item?.name}</span>
                            <span>${notification.booking.total_price}</span>
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Notification Modal */}
      {selectedNotification && (
        <NotificationModal
          notification={selectedNotification}
          isOpen={!!selectedNotification}
          onClose={() => setSelectedNotification(null)}
          onStatusUpdate={(bookingId, newStatus) => {
            // Update the notification's booking status in the local state
            setNotifications((prev) =>
              prev.map((n) =>
                n.booking?.id === bookingId ? { ...n, booking: { ...n.booking!, status: newStatus } } : n,
              ),
            )
          }}
        />
      )}
    </>
  )
}
