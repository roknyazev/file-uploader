import { useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { SelectFileContext } from '@/features/select/model/types.ts'
import { createStrictContext } from '@/shared/hooks/strictContext.ts'

const [useSelectFileContext, Provider] = createStrictContext<SelectFileContext>('UploadForm')

const SelectFileProvider = ({ children }: PropsWithChildren) => {
  const [file, setFile] = useState<File | null>(null)
  const [dragCounter, setDragCounter] = useState(0)

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
    }

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault()
      setDragCounter(prev => prev + 1)
    }

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault()
      setDragCounter(prev => prev - 1)
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      setDragCounter(0)
      const newFile = e.dataTransfer?.files[0]
      if (newFile && newFile.size !== 0) {
        setFile(newFile)
      }
    }

    document.addEventListener('dragover', handleDragOver)
    document.addEventListener('dragenter', handleDragEnter)
    document.addEventListener('dragleave', handleDragLeave)
    document.addEventListener('drop', handleDrop)

    return () => {
      document.removeEventListener('dragover', handleDragOver)
      document.removeEventListener('dragenter', handleDragEnter)
      document.removeEventListener('dragleave', handleDragLeave)
      document.removeEventListener('drop', handleDrop)
    }
  }, [])

  const value: SelectFileContext = useMemo(() => ({ file, setFile, isDragging: dragCounter > 0 }), [file, dragCounter])
  return <Provider value={value}>{children}</Provider>
}

export { useSelectFileContext, SelectFileProvider }
