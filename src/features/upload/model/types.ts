import { z } from 'zod'
import type { SafeParseReturnType } from 'zod'
import type { Dispatch, SetStateAction } from 'react'

export const uploadFormSchema = z.object({
  name: z.string().min(1),
  file: z.instanceof(File),
})

// export interface UploadFormData {
//   name: string
//   file: File
// }

export type UploadFormData = z.infer<typeof uploadFormSchema>

export interface UploadFormContext {
  data: UploadFormData
  parsedData: SafeParseReturnType<UploadFormData, UploadFormData>
  initialData: UploadFormData
  updateName: Dispatch<SetStateAction<string>>
  reset: () => void
}
