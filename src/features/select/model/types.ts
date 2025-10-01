import type { Dispatch, SetStateAction } from 'react'

export type SelectFileContext = {
  file: File | null
  setFile: Dispatch<SetStateAction<File | null>>
  isDragging: boolean
}
