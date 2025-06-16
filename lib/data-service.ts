import { supabase } from "./supabase"
import type { User } from "@supabase/supabase-js"

// Updated Types
export interface Item {
  id: string
  name: string
  description: string
  price: number
  category: string // Changed from category_id to category
  owner_id: string
  location: string
  image: string // Changed from images array to single image
  features: string[]
  is_available: boolean
  created_at: string
  updated_at: string
  // Joined data
  owner?: Profile
  reviews?: Review[]
  average_rating?: number
  review_count?: number
}

export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  location?: string
  bio?: string
  phone?: string
  is_verified: boolean
  is_admin: boolean // Add this line
  rating: number
  review_count: number
  joined_at: string
}

export interface Booking {
  id: string
  item_id: string
  renter_id: string
  owner_id: string
  start_date: string
  end_date: string
  total_price: number
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled"
  created_at: string
  updated_at?: string
  // Joined data
  item?: Item
  renter?: Profile
  owner?: Profile
}

export interface Review {
  id: string
  item_id: string
  booking_id: string
  reviewer_id: string
  rating: number
  comment: string
  created_at: string
  // Joined data
  reviewer?: Profile
}

// Notification Types
export interface Notification {
  id: string
  user_id: string
  booking_id: string
  type: "booking_request" | "booking_approved" | "booking_rejected" | "booking_cancelled"
  title: string
  message: string
  is_read: boolean
  created_at: string
  // Joined data
  booking?: Booking
}

// Admin Analytics Types
export interface AdminAnalytics {
  totalItems: number
  totalBookings: number
  totalUsers: number
  totalReviews: number
  totalRevenue: number
  itemsByCategory: { category: string; count: number }[]
  bookingsByStatus: { status: string; count: number }[]
  bookingsByMonth: { month: string; count: number; revenue: number }[]
  topCategories: { category: string; count: number; revenue: number }[]
  recentBookings: Booking[]
}

// Authentication Functions
export async function signUp(email: string, password: string, fullName: string) {
  console.log("Attempting to sign up user:", email)

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    console.error("Sign up error:", error)
    throw error
  }

  console.log("Sign up successful:", data.user?.email)
  return data
}

export async function signIn(email: string, password: string) {
  console.log("Attempting to sign in user:", email)

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Sign in error:", error)
    throw error
  }

  console.log("Sign in successful:", data.user?.email)
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser(): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

// Check if user is admin using the is_admin column
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.from("profiles").select("is_admin").eq("id", userId).single()

    if (error) {
      console.error("Error checking admin status:", error)
      return false
    }

    return data?.is_admin === true
  } catch (error) {
    console.error("Error in isAdmin function:", error)
    return false
  }
}

// Category Functions (now just returns unique categories from items)
export async function getCategories(): Promise<{ name: string; count: number; icon: string }[]> {
  const { data, error } = await supabase.from("items").select("category").eq("is_available", true)

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  // Count items per category and add icons
  const categoryMap = new Map<string, number>()
  data.forEach((item) => {
    categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1)
  })

  // Define category icons
  const categoryIcons: Record<string, string> = {
    Electronics: "📱",
    Tools: "🔧",
    Sports: "⚽",
    Photography: "📸",
    Outdoor: "🏕️",
    Music: "🎵",
    Vehicles: "🚗",
    "Home & Garden": "🏠",
  }

  return Array.from(categoryMap.entries()).map(([name, count]) => ({
    name,
    count,
    icon: categoryIcons[name] || "📦",
  }))
}

export async function getBookedDatesForItem(itemId: string): Promise<Date[]> {
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("start_date, end_date")
    .eq("item_id", itemId)
    .in("status", ["confirmed", "pending"]) // Don't block cancelled bookings

  if (error) {
    console.error("Error fetching booked dates:", error)
    return []
  }

  const bookedDates: Date[] = []

  bookings.forEach((booking) => {
    const startDate = new Date(booking.start_date)
    const endDate = new Date(booking.end_date)

    // Add all dates in the range
    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      bookedDates.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
  })

  return bookedDates
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false)

  if (error) {
    console.error("Error fetching unread notification count:", error)
    return 0
  }

  return count || 0
}

// Notification Functions
export async function getNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select(`
      *,
      booking:bookings(
        *,
        item:items(*),
        renter:renter_id(id, email, full_name, avatar_url, location, bio, phone, is_verified, is_admin, rating, review_count, joined_at),
        owner:owner_id(id, email, full_name, avatar_url, location, bio, phone, is_verified, is_admin, rating, review_count, joined_at)
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching notifications:", error)
    return []
  }

  return data
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId)

  if (error) {
    console.error("Error marking notification as read:", error)
    throw error
  }
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false)

  if (error) {
    console.error("Error marking all notifications as read:", error)
    throw error
  }
}

// Admin Analytics Functions
export async function getAdminAnalytics(): Promise<AdminAnalytics> {
  try {
    console.log("Fetching admin analytics...")

    const [
      itemsResult,
      bookingsResult,
      usersResult,
      reviewsResult,
      itemsByCategoryResult,
      bookingsByStatusResult,
      recentBookingsResult,
    ] = await Promise.all([
      supabase.from("items").select("id, category"),
      supabase.from("bookings").select("id, total_price, status, created_at"),
      supabase.from("profiles").select("id"),
      supabase.from("reviews").select("id"),
      supabase.from("items").select("category"),
      supabase.from("bookings").select("status"),
      supabase
        .from("bookings")
        .select(`
        *,
        item:items(*),
        renter:renter_id(id, email, full_name, avatar_url, location, bio, phone, is_verified, is_admin, rating, review_count, joined_at),
        owner:owner_id(id, email, full_name, avatar_url, location, bio, phone, is_verified, is_admin, rating, review_count, joined_at)
      `)
        .order("created_at", { ascending: false })
        .limit(10),
    ])

    console.log("Items result:", itemsResult.data?.length)
    console.log("Bookings result:", bookingsResult.data?.length)

    // Calculate total revenue
    const totalRevenue = bookingsResult.data?.reduce((sum, booking) => sum + (booking.total_price || 0), 0) || 0

    // Group items by category
    const categoryMap = new Map<string, number>()
    itemsByCategoryResult.data?.forEach((item) => {
      categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1)
    })

    // Group bookings by status
    const statusMap = new Map<string, number>()
    bookingsByStatusResult.data?.forEach((booking) => {
      statusMap.set(booking.status, (statusMap.get(booking.status) || 0) + 1)
    })

    // Group bookings by month (last 6 months)
    const monthMap = new Map<string, { count: number; revenue: number }>()
    const now = new Date()

    // Initialize last 6 months with zero values
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = date.toLocaleDateString("en-US", { year: "numeric", month: "short" })
      monthMap.set(monthKey, { count: 0, revenue: 0 })
    }

    // Add actual booking data
    bookingsResult.data?.forEach((booking) => {
      const bookingDate = new Date(booking.created_at)
      const monthKey = bookingDate.toLocaleDateString("en-US", { year: "numeric", month: "short" })
      const existing = monthMap.get(monthKey) || { count: 0, revenue: 0 }
      monthMap.set(monthKey, {
        count: existing.count + 1,
        revenue: existing.revenue + (booking.total_price || 0),
      })
    })

    const itemsByCategory = Array.from(categoryMap.entries()).map(([category, count]) => ({ category, count }))
    const bookingsByStatus = Array.from(statusMap.entries()).map(([status, count]) => ({ status, count }))
    const bookingsByMonth = Array.from(monthMap.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())

    console.log("Items by category:", itemsByCategory)
    console.log("Bookings by status:", bookingsByStatus)
    console.log("Bookings by month:", bookingsByMonth)

    return {
      totalItems: itemsResult.data?.length || 0,
      totalBookings: bookingsResult.data?.length || 0,
      totalUsers: usersResult.data?.length || 0,
      totalReviews: reviewsResult.data?.length || 0,
      totalRevenue,
      itemsByCategory,
      bookingsByStatus,
      bookingsByMonth,
      topCategories: Array.from(categoryMap.entries()).map(([category, count]) => ({
        category,
        count,
        revenue: 0, // You can calculate this if needed
      })),
      recentBookings: recentBookingsResult.data || [],
    }
  } catch (error) {
    console.error("Error fetching admin analytics:", error)
    throw error
  }
}

// Get all bookings for admin dashboard
export async function getAllBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      item:items(*),
      renter:renter_id(id, email, full_name, avatar_url, location, bio, phone, is_verified, is_admin, rating, review_count, joined_at),
      owner:owner_id(id, email, full_name, avatar_url, location, bio, phone, is_verified, is_admin, rating, review_count, joined_at)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching all bookings:", error)
    return []
  }

  return data
}

// Profile Functions
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching profile:", error)
    return null
  }

  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single()

  if (error) throw error
  return data
}

// Get profile stats (items listed, bookings, etc.)
export async function getProfileStats(userId: string) {
  try {
    const [itemsResult, bookingsAsOwnerResult, bookingsAsRenterResult, reviewsResult] = await Promise.all([
      supabase.from("items").select("id").eq("owner_id", userId),
      supabase.from("bookings").select("id").eq("owner_id", userId),
      supabase.from("bookings").select("id").eq("renter_id", userId),
      supabase.from("reviews").select("rating").eq("reviewer_id", userId),
    ])

    return {
      itemsListed: itemsResult.data?.length || 0,
      bookingsAsOwner: bookingsAsOwnerResult.data?.length || 0,
      bookingsAsRenter: bookingsAsRenterResult.data?.length || 0,
      reviewsGiven: reviewsResult.data?.length || 0,
    }
  } catch (error) {
    console.error("Error fetching profile stats:", error)
    return {
      itemsListed: 0,
      bookingsAsOwner: 0,
      bookingsAsRenter: 0,
      reviewsGiven: 0,
    }
  }
}

// Item Functions
export async function getItems(filters?: {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  location?: string
  sortBy?: "price_asc" | "price_desc" | "rating" | "newest"
  limit?: number
  offset?: number
}): Promise<Item[]> {
  let query = supabase
    .from("items")
    .select(`
      *,
      owner:owner_id(id, email, full_name, avatar_url, location, bio, phone, is_verified, is_admin, rating, review_count, joined_at),
      reviews(rating)
    `)
    .eq("is_available", true)

  // Apply filters
  if (filters?.category) {
    query = query.eq("category", filters.category)
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters?.minPrice) {
    query = query.gte("price", filters.minPrice)
  }

  if (filters?.maxPrice) {
    query = query.lte("price", filters.maxPrice)
  }

  if (filters?.location) {
    query = query.ilike("location", `%${filters.location}%`)
  }

  // Apply sorting
  switch (filters?.sortBy) {
    case "price_asc":
      query = query.order("price", { ascending: true })
      break
    case "price_desc":
      query = query.order("price", { ascending: false })
      break
    case "newest":
      query = query.order("created_at", { ascending: false })
      break
    default:
      query = query.order("created_at", { ascending: false })
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching items:", error)
    return []
  }

  // Calculate average rating and review count
  return data.map((item) => ({
    ...item,
    average_rating:
      item.reviews?.length > 0
        ? item.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / item.reviews.length
        : 0,
    review_count: item.reviews?.length || 0,
  }))
}

export async function getItemById(id: string): Promise<Item | null> {
  const { data, error } = await supabase
    .from("items")
    .select(`
      *,
      owner:owner_id(id, email, full_name, avatar_url, location, bio, phone, is_verified, is_admin, rating, review_count, joined_at),
      reviews(
        *,
        reviewer:reviewer_id(id, email, full_name, avatar_url, location, bio, phone, is_verified, is_admin, rating, review_count, joined_at)
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching item:", error)
    return null
  }

  // Calculate average rating
  const averageRating =
    data.reviews?.length > 0
      ? data.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / data.reviews.length
      : 0

  return {
    ...data,
    average_rating: averageRating,
    review_count: data.reviews?.length || 0,
  }
}

// Add Item Function with Authentication Check (Updated with dates)
export async function addItem(itemData: {
  name: string
  description: string
  price: number
  category: string
  location: string
  image?: string
  features: string[]
}): Promise<Item> {
  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error("You must be logged in to list an item")
  }

  // Prepare item data with owner_id
  const newItem = {
    ...itemData,
    owner_id: user.id,
    image: itemData.image || null,
    is_available: true,
  }

  const { data, error } = await supabase
    .from("items")
    .insert(newItem)
    .select(`
      *,
      owner:owner_id(id, email, full_name, avatar_url, location, bio, phone, is_verified, is_admin, rating, review_count, joined_at)
    `)
    .single()

  if (error) {
    console.error("Error adding item:", error)
    throw new Error(error.message || "Failed to add item")
  }

  return data
}

export async function createItem(item: Omit<Item, "id" | "created_at" | "updated_at">): Promise<Item> {
  const { data, error } = await supabase
    .from("items")
    .insert(item)
    .select(`
      *,
      owner:owner_id(id, email, full_name, avatar_url, location, bio, phone, is_verified, is_admin, rating, review_count, joined_at)
    `)
    .single()

  if (error) throw error
  return data
}

export async function updateItem(id: string, updates: Partial<Item>): Promise<Item> {
  const { data, error } = await supabase
    .from("items")
    .update(updates)
    .eq("id", id)
    .select(`
      *,
      owner:owner_id(id, email, full_name, avatar_url, location, bio, phone, is_verified, is_admin, rating, review_count, joined_at)
    `)
    .single()

  if (error) throw error
  return data
}

export async function deleteItem(id: string): Promise<void> {
  const { error } = await supabase.from("items").delete().eq("id", id)

  if (error) throw error
}

export async function getItemsByOwner(ownerId: string): Promise<Item[]> {
  const { data, error } = await supabase
    .from("items")
    .select(`
      *,
      reviews(rating)
    `)
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching owner items:", error)
    return []
  }

  return data.map((item) => ({
    ...item,
    average_rating:
      item.reviews?.length > 0
        ? item.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / item.reviews.length
        : 0,
    review_count: item.reviews?.length || 0,
  }))
}

// Booking Functions
export async function createBooking(booking: Omit<Booking, "id" | "created_at">): Promise<Booking> {
  const { data, error } = await supabase
    .from("bookings")
    .insert(booking)
    .select(`
      *,
      item:items(*),
      renter:renter_id(id, email, full_name, avatar_url, location, bio, phone, is_verified, is_admin, rating, review_count, joined_at),
      owner:owner_id(id, email, full_name, avatar_url, location, bio, phone, is_verified, is_admin, rating, review_count, joined_at)
    `)
    .single()

  if (error) throw error
  return data
}

export async function getBookingsByUser(userId: string, type: "renter" | "owner" = "renter"): Promise<Booking[]> {
  const column = type === "renter" ? "renter_id" : "owner_id"

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      item:items(*),
      renter:renter_id(id, email, full_name, avatar_url, location, bio, phone, is_verified, is_admin, rating, review_count, joined_at),
      owner:owner_id(id, email, full_name, avatar_url, location, bio, phone, is_verified, is_admin, rating, review_count, joined_at)
    `)
    .eq(column, userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching bookings:", error)
    return []
  }

  return data
}

export async function updateBookingStatus(id: string, status: Booking["status"]): Promise<Booking> {
  const { data, error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id)
    .select(`
      *,
      item:items(*),
      renter:renter_id(id, email, full_name, avatar_url, location, bio, phone, is_verified, is_admin, rating, review_count, joined_at),
      owner:owner_id(id, email, full_name, avatar_url, location, bio, phone, is_verified, is_admin, rating, review_count, joined_at)
    `)
    .single()

  if (error) throw error
  return data
}

export async function checkItemAvailability(itemId: string, startDate: string, endDate: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("bookings")
    .select("id")
    .eq("item_id", itemId)
    .in("status", ["confirmed", "active"])
    .or(`start_date.lte.${endDate},end_date.gte.${startDate}`)

  if (error) {
    console.error("Error checking availability:", error)
    return false
  }

  return data.length === 0
}

export async function createBookingWithDates(bookingData: {
  item_id: string
  start_date: string
  end_date: string
  total_price: number
}): Promise<Booking> {
  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error("You must be logged in to make a booking")
  }

  // Get item details to find the owner
  const { data: item, error: itemError } = await supabase
    .from("items")
    .select("owner_id, price, name")
    .eq("id", bookingData.item_id)
    .single()

  if (itemError || !item) {
    throw new Error("Item not found")
  }

  // Check if user is trying to book their own item
  if (item.owner_id === user.id) {
    throw new Error("You cannot book your own item")
  }

  // Check availability
  const isAvailable = await checkItemAvailability(bookingData.item_id, bookingData.start_date, bookingData.end_date)

  if (!isAvailable) {
    throw new Error("Item is not available for the selected dates")
  }

  // Create the booking
  const newBooking = {
    item_id: bookingData.item_id,
    renter_id: user.id,
    owner_id: item.owner_id,
    start_date: bookingData.start_date,
    end_date: bookingData.end_date,
    total_price: bookingData.total_price,
    status: "pending" as const,
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert(newBooking)
    .select(`
      *,
      item:items(*),
      renter:renter_id(id, email, full_name, avatar_url, location, bio, phone, is_verified, is_admin, rating, review_count, joined_at),
      owner:owner_id(id, email, full_name, avatar_url, location, bio, phone, is_verified, is_admin, rating, review_count, joined_at)
    `)
    .single()

  if (error) {
    console.error("Error creating booking:", error)
    throw new Error(error.message || "Failed to create booking")
  }

  return data
}

// Booking cancellation function with business logic
export async function cancelBooking(
  bookingId: string,
  reason?: string,
): Promise<{ success: boolean; message: string }> {
  try {
    console.log("Starting cancelBooking for ID:", bookingId)

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error("Auth error:", authError)
      return { success: false, message: "Authentication error: " + authError.message }
    }

    if (!user) {
      return { success: false, message: "You must be logged in to cancel a booking" }
    }

    console.log("User authenticated:", user.id)

    // Get booking details with simpler query first
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single()

    if (bookingError) {
      console.error("Booking fetch error:", bookingError)
      return { success: false, message: "Error fetching booking: " + bookingError.message }
    }

    if (!booking) {
      return { success: false, message: "Booking not found" }
    }

    console.log("Booking found:", booking)

    // Check if user has permission to cancel
    const userIsAdmin = await isAdmin(user.id)
    const isRenter = booking.renter_id === user.id
    const isOwner = booking.owner_id === user.id

    console.log("Permissions:", { userIsAdmin, isRenter, isOwner })

    if (!isRenter && !isOwner && !userIsAdmin) {
      return { success: false, message: "You don't have permission to cancel this booking" }
    }

    // Check booking status - can only cancel pending or confirmed bookings
    if (!["pending", "confirmed"].includes(booking.status)) {
      const statusMessages = {
        active: "Cannot cancel an active rental that has already started",
        completed: "Cannot cancel a completed booking",
        cancelled: "This booking is already cancelled",
      }
      return {
        success: false,
        message: statusMessages[booking.status as keyof typeof statusMessages] || "Cannot cancel this booking",
      }
    }

    // Check timing - cannot cancel if rental has already started
    const startDate = new Date(booking.start_date)
    const now = new Date()

    if (startDate <= now && booking.status === "confirmed") {
      return { success: false, message: "Cannot cancel a booking that has already started" }
    }

    // For confirmed bookings, check if it's too close to start date (24 hour grace period)
    if (booking.status === "confirmed" && isRenter) {
      const hoursUntilStart = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60)
      if (hoursUntilStart < 24) {
        return { success: false, message: "Cannot cancel within 24 hours of the rental start time" }
      }
    }

    console.log("All checks passed, updating booking status...")

    // Update booking status to cancelled
    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
      })
      .eq("id", bookingId)

    if (updateError) {
      console.error("Error updating booking:", updateError)
      return { success: false, message: "Failed to cancel booking: " + updateError.message }
    }

    console.log("Booking updated successfully, creating notification...")

    // Get additional booking details for notification
    const { data: bookingWithDetails, error: detailsError } = await supabase
      .from("bookings")
      .select(`
        *,
        item:items(name),
        renter:renter_id(full_name),
        owner:owner_id(full_name)
      `)
      .eq("id", bookingId)
      .single()

    if (detailsError) {
      console.error("Error fetching booking details for notification:", detailsError)
      // Don't fail the cancellation if notification fails
    } else {
      // Create notification for the other party
      const notificationUserId = isRenter ? booking.owner_id : booking.renter_id
      const notificationTitle = isRenter ? "Booking Cancelled by Renter" : "Booking Cancelled by Owner"
      const notificationMessage = isRenter
        ? `${bookingWithDetails.renter?.full_name || "A renter"} has cancelled their booking for "${bookingWithDetails.item?.name || "an item"}"`
        : `${bookingWithDetails.owner?.full_name || "The owner"} has cancelled the booking for "${bookingWithDetails.item?.name || "an item"}"`

      const { error: notificationError } = await supabase.from("notifications").insert({
        user_id: notificationUserId,
        booking_id: bookingId,
        type: "booking_cancelled",
        title: notificationTitle,
        message: notificationMessage,
        is_read: false,
      })

      if (notificationError) {
        console.error("Error creating notification:", notificationError)
        // Don't fail the cancellation if notification fails
      }
    }

    console.log("Cancellation completed successfully")

    return {
      success: true,
      message: isRenter
        ? "Booking cancelled successfully. The owner has been notified."
        : "Booking cancelled successfully. The renter has been notified.",
    }
  } catch (error) {
    console.error("Unexpected error in cancelBooking:", error)
    return { success: false, message: "An unexpected error occurred: " + (error as Error).message }
  }
}

// Function to check if a booking can be cancelled
export async function canCancelBooking(bookingId: string): Promise<{ canCancel: boolean; reason?: string }> {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return { canCancel: false, reason: "You must be logged in" }
    }

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single()

    if (bookingError || !booking) {
      return { canCancel: false, reason: "Booking not found" }
    }

    // Check permissions
    const userIsAdmin = await isAdmin(user.id)
    const isRenter = booking.renter_id === user.id
    const isOwner = booking.owner_id === user.id

    if (!isRenter && !isOwner && !userIsAdmin) {
      return { canCancel: false, reason: "No permission" }
    }

    // Check status
    if (!["pending", "confirmed"].includes(booking.status)) {
      return { canCancel: false, reason: "Cannot cancel this booking status" }
    }

    // Check timing
    const startDate = new Date(booking.start_date)
    const now = new Date()

    if (startDate <= now && booking.status === "confirmed") {
      return { canCancel: false, reason: "Rental has already started" }
    }

    // Check 24-hour rule for renters
    if (booking.status === "confirmed" && isRenter) {
      const hoursUntilStart = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60)
      if (hoursUntilStart < 24) {
        return { canCancel: false, reason: "Cannot cancel within 24 hours of start time" }
      }
    }

    return { canCancel: true }
  } catch (error) {
    console.error("Error checking cancellation eligibility:", error)
    return { canCancel: false, reason: "Error checking eligibility" }
  }
}

// Review Functions
export async function createReview(review: Omit<Review, "id" | "created_at">): Promise<Review> {
  const { data, error } = await supabase
    .from("reviews")
    .insert(review)
    .select(`
      *,
      reviewer:reviewer_id(id, email, full_name, avatar_url, location, bio, phone, is_verified, is_admin, rating, review_count, joined_at)
    `)
    .single()

  if (error) throw error
  return data
}

export async function getReviewsByItem(itemId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      reviewer:reviewer_id(id, email, full_name, avatar_url, location, bio, phone, is_verified, is_admin, rating, review_count, joined_at)
    `)
    .eq("item_id", itemId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching reviews:", error)
    return []
  }

  return data
}

// File Upload Functions
export async function uploadImage(file: File, bucket = "item-images"): Promise<string> {
  const fileExt = file.name.split(".").pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${fileName}`

  const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)

  return data.publicUrl
}

export async function deleteImage(url: string, bucket = "item-images"): Promise<void> {
  const fileName = url.split("/").pop()
  if (!fileName) return

  const { error } = await supabase.storage.from(bucket).remove([fileName])

  if (error) throw error
}
