import axios from 'axios'
import type { AxiosInstance } from 'axios'

interface DownloadUrlResponse {
  href: string
  method: string
  templated: boolean
}

export const downloadApi = (client: AxiosInstance) => ({
  downloadUrl: async (path: string, signal?: AbortSignal): Promise<DownloadUrlResponse> => {
    return (
      await client.get<DownloadUrlResponse>('/resources/download', {
        params: {
          path,
        },
        signal,
      })
    ).data
  },

  download: async (url: string, signal?: AbortSignal) => {
    return (await axios.get<Blob>(url, { responseType: 'blob', signal })).data
  },
})
