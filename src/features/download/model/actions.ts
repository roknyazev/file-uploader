import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import { downloadApi, isApiError } from '@/shared/api'
import { downloadBlob } from '@/shared/lib/utils.ts'

const download = async (name: string): Promise<Blob> => {
  const { href } = await downloadApi.downloadUrl(name)
  return await downloadApi.download(href)
}

export const downloadAction = (name: string) => {
  toast.promise(download(name), {
    loading: 'Preparing file...',
    success: blob => {
      downloadBlob(blob, name)
      return { message: `Download started`, action: undefined }
    },
    error: (error: unknown) => {
      if (!isAxiosError(error)) {
        return { message: 'An error occurred', action: undefined }
      }
      if (isApiError(error)) {
        return { message: error.response?.data.description, action: undefined }
      }
      return { message: error.message, action: undefined }
    },
  })
}
