import { API_URL } from "../constant"
import { type ApiResponse } from "../interface/ApiResponse"

async function coreRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
): Promise<ApiResponse<T>> {
  const config: RequestInit = {
    method,
    headers: {} as HeadersInit, // 👈 On initialise des headers vides
    credentials: "include",
  }

  if (body) {
    if (body instanceof FormData) {
      // Si c'est un FormData (comme pour notre image), on NE MET PAS de Content-Type.
      // Le navigateur va le deviner tout seul et ajouter le bon 'boundary' multipart.
      config.body = body
    } else {
      // Si c'est autre chose (comme du texte), on force le format JSON.
      ;(config.headers as Record<string, string>)["Content-Type"] =
        "application/json"
      config.body = JSON.stringify(body)
    }
  }

  try {
    const response = await fetch(`${API_URL}/api/${endpoint}`, config)
    const result = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        success: false,
        data: null,
        error: {
          code: result?.error?.code || "HTTP_ERROR",
          message:
            result?.error?.message || `Erreur serveur (${response.status})`,
        },
      }
    }

    return result as ApiResponse<T>
  } catch (err) {
    return {
      success: false,
      data: null,
      error: {
        code: "NETWORK_ERROR",
        message: "Impossible de contacter le serveur SoundPlay.",
      },
    }
  }
}

export const apiRequest = {
  get: <T>(endpoint: string) => coreRequest<T>(endpoint, "GET"),
  post: <T>(endpoint: string, body: any) =>
    coreRequest<T>(endpoint, "POST", body),
  put: <T>(endpoint: string, body: any) =>
    coreRequest<T>(endpoint, "PUT", body),
  delete: <T>(endpoint: string, body?: any) =>
    coreRequest<T>(endpoint, "DELETE", body),
}
