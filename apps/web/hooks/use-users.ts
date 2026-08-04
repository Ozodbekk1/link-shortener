"use client"

import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/api/query-keys"
import type { UsersQueryParams } from "@/api/types"
import { usersService } from "@/services/users.service"

export const useAllUsersQuery = (params?: UsersQueryParams) =>
  useQuery({
    queryKey: queryKeys.users.all(params as Record<string, unknown>),
    queryFn: () => usersService.getAllUsers(params),
  })

export const useUserByIdQuery = (id: string) =>
  useQuery({
    queryKey: queryKeys.users.byId(id),
    queryFn: () => usersService.getUserById(id),
    enabled: !!id,
  })

export const useMyProfileQuery = () =>
  useQuery({
    queryKey: queryKeys.users.me,
    queryFn: () => usersService.getMyProfile(),
  })
