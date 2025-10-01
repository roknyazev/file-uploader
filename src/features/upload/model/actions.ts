import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import { isAlreadyExistsError, isApiError, uploadApi } from '@/shared/api'
import { filesStore } from '@/entities/files-storage'

const upload = async (name: string, file: File, overwrite: boolean, signal: AbortSignal) => {
  const { href } = await uploadApi.uploadUrl(name, overwrite, signal)
  await uploadApi.upload(href, file, undefined, signal)
  return name
}

export const uploadAction = (name: string, file: File, overwrite: boolean) => {
  const ctrl = new AbortController()
  const { addFile } = filesStore
  toast.promise(upload(name, file, overwrite, ctrl.signal), {
    loading: 'Uploading...',
    success: fileName => {
      addFile({ name: fileName, size: file.size, type: file.type, lastModified: file.lastModified })
      return { message: `${fileName} uploaded successfully`, action: undefined }
    },
    error: (error: unknown) => {
      if (!isAxiosError(error)) {
        return { message: 'An error occurred', action: undefined }
      }
      if (isAlreadyExistsError(error)) {
        return {
          message: error.response?.data.description,
          duration: Infinity,
          action: { label: 'Overwrite', onClick: () => uploadAction(name, file, true) },
        }
      }
      if (isApiError(error)) {
        return { message: error.response?.data.description, action: undefined }
      }
      return { message: error.message, action: undefined }
    },
    action: {
      label: 'Cancel',
      onClick: () => ctrl.abort('Upload canceled'),
    },
  })
}
