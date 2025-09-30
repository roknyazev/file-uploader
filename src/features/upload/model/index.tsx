import { useCallback, useMemo, useState } from 'react'
import { uploadFormSchema } from './types.ts'
import type { UploadFormContext, UploadFormData } from './types.ts'
import type { PropsWithChildren } from 'react'
import { createStrictContext } from '@/shared/hooks/strictContext.ts'

const [useUploadFormContext, Provider] = createStrictContext<UploadFormContext>('UploadForm')

const UploadFormProvider = ({ children, file }: PropsWithChildren<{ file: File }>) => {
  const [name, setName] = useState(file.name)
  const initialData = useMemo(() => ({ name: file.name, file }), [file])
  const reset = useCallback(() => {
    setName(initialData.name)
  }, [file])
  const value: UploadFormContext = useMemo(
    () => ({
      updateName: setName,
      reset,
      data: { name, file },
      parsedData: uploadFormSchema.safeParse({ name, file }),
      initialData: initialData,
    }),
    [name, file, reset, initialData],
  )
  return <Provider value={value}>{children}</Provider>
}

export { useUploadFormContext, UploadFormProvider }
export { type UploadFormContext, type UploadFormData }
