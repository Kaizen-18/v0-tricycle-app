import axios from "axios"

const API_BASE_URL = "http://127.0.0.1:8000"

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("tricy_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("tricy_token")
      localStorage.removeItem("tricy_user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  register: (data: {
    name: string
    email: string
    phone_number: string
    password: string
    role: "passenger" | "driver"
  }) => api.post("/auth/register", data),

  login: (email: string, password: string) => api.post("/auth/login", { email, password }),
}

// Users API
export const usersAPI = {
  getUser: (userId: string) => api.get(`/users/${userId}`),
  updateUser: (userId: string, data: any) => api.patch(`/users/${userId}`, data),
}

// Drivers API
export const driversAPI = {
  getDrivers: () => api.get("/drivers"),
  getDriver: (driverId: string) => api.get(`/drivers/${driverId}`),
}

// Bookings API
export const bookingsAPI = {
  getBookings: () => api.get("/bookings"),
  createBooking: (data: {
    pickup_location: string
    destination: string
    fare_estimate: number
    notes?: string
  }) => api.post("/bookings", data),
  completeBooking: (bookingId: string) => api.post(`/bookings/${bookingId}/complete`),
}

// Transactions API
export const transactionsAPI = {
  getUserTransactions: (userId: string) => api.get(`/transactions/user/${userId}`),
  getDriverTransactions: (driverId: string) => api.get(`/transactions/driver/${driverId}`),
  confirmTransaction: (transactionId: string) => api.post(`/transactions/${transactionId}/confirm`),
}

// Ratings API
export const ratingsAPI = {
  rateUser: (userId: string, data: { rating: number; comment?: string }) =>
    api.post(`/ratings/user/${userId}/rate`, data),
}

// Notifications API
export const notificationsAPI = {
  getUserNotifications: (userId: string) => api.get(`/notifications/user/${userId}`),
}
