import { apiClient } from "@/api/clients"
import type {
  User,
  UserProfileResponse,
  UsersListResponse,
  UsersQueryParams,
} from "@/api/types"

export const usersService = {
  getAllUsers: async (
    params?: UsersQueryParams
  ): Promise<UsersListResponse> => {
    const res = await apiClient.get<any>("/users", { query: params })
    return (res?.data ?? res) as UsersListResponse
  },

  getUserById: async (id: string): Promise<User> => {
    const res = await apiClient.get<any>(`users/id/${id}`)
    return (res?.data ?? res) as User
  },

  getMyProfile: async (): Promise<UserProfileResponse> => {
    const res = await apiClient.get<any>("/users/me")

    const unwrappedData = res?.data ?? res
    const user = unwrappedData?.user ?? unwrappedData

    return { user }
  },
}
