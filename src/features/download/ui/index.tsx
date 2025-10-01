import { DownloadIcon } from 'lucide-react'
import { downloadAction } from '../model'
import type { ComponentProps } from 'react'
import { Button } from '@/shared/components/ui/button.tsx'

interface DownloadButtonProps
  extends Omit<ComponentProps<typeof Button>, 'variant' | 'size' | 'disabled' | 'type' | 'onClick'> {
  fileName: string
}

export const DownloadButton = ({ fileName, ...rest }: DownloadButtonProps) => {
  return (
    <Button type="button" onClick={() => downloadAction(fileName)} variant={'default'} size={'icon'} {...rest}>
      <DownloadIcon />
    </Button>
  )
}
