"use client"

import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/api/query-keys"
import type { UsersQueryParams } from "@/api/types"
import { usersService } from "@/services/users.service"

/**
 * Fetches all users (paginated). Admin only.
 * Usage: const { data, isLoading } = useAllUsersQuery({ page: 1, limit: 20 })
 */
export const useAllUsersQuery = (params?: UsersQueryParams) =>
  useQuery({
    queryKey: queryKeys.users.all(params as Record<string, unknown>),
    queryFn: () => usersService.getAllUsers(params),
  })

/**
 * Fetches a single user by their ID.
 * Usage: const { data, isLoading } = useUserByIdQuery("some-uuid")
 */
export const useUserByIdQuery = (id: string) =>
  useQuery({
    queryKey: queryKeys.users.byId(id),
    queryFn: () => usersService.getUserById(id),
    enabled: !!id,
  })

/**
 * Fetches the authenticated user's full profile.
 * Usage: const { data, isLoading } = useMyProfileQuery()
 */
export const useMyProfileQuery = () =>
  useQuery({
    queryKey: queryKeys.users.me,
    queryFn: () => usersService.getMyProfile(),
  })
