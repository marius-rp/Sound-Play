import { apiRequest } from "./APIRequest"
import { API_URL } from "../constant"
import type { ApiResponse } from "../interface/ApiResponse"
import type { IPlaylist, IPlaylistPayload } from "../interface/IPlaylist"
import { formatPlaylistImage } from "../utils/request.helper"

export const playlistService = {
  getUserPlaylists: async (): Promise<ApiResponse<IPlaylist[]>> => {
    const res = await apiRequest.get<IPlaylist[]>("playlist/userPlaylists")
    // On formate toutes les playlists avant de les envoyer à la Vue
    if (res.success && res.data) {
      res.data = res.data.map(formatPlaylistImage)
    }
    return res
  },

  getPlaylistById: async (id: number): Promise<ApiResponse<IPlaylist>> => {
    const res = await apiRequest.get<IPlaylist>(`playlist/playlistById/${id}`)
    // On formate l'image avant de l'envoyer à la Vue
    if (res.success && res.data) {
      res.data = formatPlaylistImage(res.data)
    }
    return res
  },

  createPlaylist: async (
    data: IPlaylistPayload,
  ): Promise<ApiResponse<{ insertId: number }>> => {
    return apiRequest.post<{ insertId: number }>("playlist/create", data)
  },

  // 👇 Le service prend un objet simple et génère la requête (FormData) lui-même
  updatePlaylist: async (
    id: number,
    data: { title: string; description: string; coverFile?: File | null },
  ): Promise<ApiResponse<{ cover_image?: string } | null>> => {
    // Création du paquet de données
    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("description", data.description)
    if (data.coverFile) {
      formData.append("cover", data.coverFile)
    }

    const res = await apiRequest.put<{ cover_image?: string } | null>(
      `playlist/update/${id}`,
      formData,
    )

    // Si on reçoit une nouvelle URL du backend, on la formate avec API_URL
    if (res.success && res.data && res.data.cover_image) {
      res.data.cover_image = `${API_URL}${res.data.cover_image}`
    }

    return res
  },

  updateAleatoirePlaylist: async (
    playlistId: number | string,
    data: Partial<IPlaylistPayload>,
  ): Promise<ApiResponse<null>> => {
    return apiRequest.put<null>(`playlist/updateAleatoire/${playlistId}`, data)
  },

  deletePlaylist: async (id: number): Promise<ApiResponse<null>> => {
    return apiRequest.delete<null>(`playlist/delete/${id}`)
  },
}
