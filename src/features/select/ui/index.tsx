import { useCallback, useRef } from 'react'
import type { ChangeEvent, ComponentProps } from 'react'
import { useSelectFileContext } from '@/features/select/model'
import { Button } from '@/shared/components/ui/button.tsx'

export const SelectFileButton = (props: Omit<ComponentProps<typeof Button>, 'variant' | 'onClick'>) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { file, setFile } = useSelectFileContext()
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0]
    if (newFile) {
      setFile(newFile)
    }
  }, [])

  return (
    <>
      <Button variant={file ? 'outline' : 'default'} onClick={() => fileInputRef.current?.click()} {...props}>
        Select file
      </Button>
      <input multiple={false} ref={fileInputRef} type={'file'} className={'hidden'} onChange={handleChange} />
    </>
  )
}
