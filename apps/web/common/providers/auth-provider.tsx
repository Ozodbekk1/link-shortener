"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { queryKeys } from "@/api/query-keys"
import { usersService } from "@/services/users.service"
import { authService } from "@/services/auth.service"
import { setOnRefreshFailure, clearOnRefreshFailure } from "@/api/clients"
import { useLocale } from "@/hooks/use-locale"
import { redirectToLogin } from "@/lib/auth/post-auth-redirect"
import type { UserProfileResponse } from "@/api/types"

interface AuthContextType {
  user: UserProfileResponse["user"] | null
  profile: UserProfileResponse | null
  isLoading: boolean
  isFetching: boolean
  isAuthenticated: boolean
  error: Error | null
  refetchUser: () => Promise<UserProfileResponse | undefined>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const locale = useLocale()

  const {
    data: profileData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.users.me,
    queryFn: async () => {
      try {
        return await usersService.getMyProfile()
      } catch (err) {
        // If 401 or network failure, return null profile
        return null
      }
    },
    staleTime: 60_000, // Consider fresh for 1 min
    gcTime: 5 * 60_000,
    retry: false, // Don't spam retries on auth check
    refetchOnWindowFocus: false,
  })

  const user =
    profileData?.user ??
    (profileData as any)?.data?.user ??
    (profileData as any)?.data ??
    null
  const isAuthenticated = !!user && !!(user.id || user.email)

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // Ignore logout API errors, clean up locally regardless
    } finally {
      queryClient.setQueryData(queryKeys.users.me, null)
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/auth/")
      ) {
        redirectToLogin(locale)
      }
    }
  }, [queryClient, locale])

  // Setup refresh failure interceptor hook
  useEffect(() => {
    setOnRefreshFailure(() => {
      queryClient.setQueryData(queryKeys.users.me, null)

      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/auth/")
      ) {
        redirectToLogin(locale)
      }
    })

    return () => {
      clearOnRefreshFailure()
    }
  }, [queryClient, locale])

  const refetchUser = useCallback(async () => {
    const result = await refetch()
    return result.data ?? undefined
  }, [refetch])

  return (
    <AuthContext.Provider
      value={{
        user,
        profile: profileData ?? null,
        isLoading,
        isFetching,
        isAuthenticated,
        error: (error as Error) ?? null,
        refetchUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
