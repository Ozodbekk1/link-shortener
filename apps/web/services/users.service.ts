import { apiClient } from "@/api/clients"
import type {
  User,
  UserProfileResponse,
  UsersListResponse,
  UsersQueryParams,
} from "@/api/types"

export const usersService = {
  getAllUsers: (params?: UsersQueryParams) =>
    apiClient.get<UsersListResponse>("/users", { query: params }),

  getUserById: (id: string) => apiClient.get<User>(`users/id/${id}`),

  getMyProfile: () => apiClient.get<UserProfileResponse>("/users/me"),
}
