import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosProgressEvent } from 'axios'

interface ApiErrorResponse {
  description: string
  error: string
  message?: string
}

export function isApiError(error: AxiosError): error is AxiosError<ApiErrorResponse> {
  const data = error.response?.data
  return typeof data === 'object' && data !== null && 'error' in data && 'description' in data
}

export function isAlreadyExistsError(
  error: AxiosError,
): error is AxiosError<ApiErrorResponse & { error: 'DiskResourceAlreadyExistsError' }> {
  return isApiError(error) && error.response?.data.error === 'DiskResourceAlreadyExistsError'
}

interface UploadUrlResponse {
  href: string
  method: string
  templated: boolean
}

export const uploadApi = (client: AxiosInstance) => ({
  uploadUrl: async (path: string, overwrite: boolean, signal?: AbortSignal): Promise<UploadUrlResponse> => {
    return (
      await client.get<UploadUrlResponse>('/resources/upload', {
        params: {
          path,
          overwrite,
        },
        signal,
      })
    ).data
  },

  upload: async (url: string, file: File, onUploadProgress?: (e: AxiosProgressEvent) => void, signal?: AbortSignal) => {
    return (await axios.put(url, file, { onUploadProgress, signal })).data
  },
})
