import { DownloadIcon } from 'lucide-react'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import type { ComponentProps } from 'react'
import { Button } from '@/shared/components/ui/button.tsx'
import { downloadApi, isApiError } from '@/shared/api'

const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

const download = async (name: string): Promise<Blob> => {
  const { href } = await downloadApi.downloadUrl(name)
  return await downloadApi.download(href)
}

const handleRequest = (name: string) => {
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

interface DownloadButtonProps
  extends Omit<ComponentProps<typeof Button>, 'variant' | 'size' | 'disabled' | 'type' | 'onClick'> {
  fileName: string
}

export const DownloadButton = ({ fileName, ...rest }: DownloadButtonProps) => {
  return (
    <Button type="button" onClick={() => handleRequest(fileName)} variant={'default'} size={'icon'} {...rest}>
      <DownloadIcon />
    </Button>
  )
}
