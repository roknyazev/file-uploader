import { RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import type { ComponentProps, DetailedHTMLProps, FormHTMLAttributes } from 'react'
import { Input } from '@/shared/components/ui/input.tsx'
import { useUploadFormContext } from '@/features/upload/model'
import { Button } from '@/shared/components/ui/button.tsx'
import { cn } from '@/shared/lib/utils.ts'
import { isAlreadyExistsError, isApiError, uploadApi } from '@/shared/api'
import { filesStore } from '@/entities/files-storage'

export const NameInput = ({
  className,
  ...rest
}: Omit<ComponentProps<typeof Input>, 'value' | 'onChange' | 'placeholder' | 'aria-invalid'>) => {
  const { data, parsedData, updateName } = useUploadFormContext()
  const errors = parsedData.error?.formErrors.fieldErrors.name
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <Input
        aria-invalid={!!errors}
        value={data.name}
        onChange={e => updateName(e.target.value)}
        placeholder={'File name'}
        {...rest}
      />
      {errors && <p className={'text-destructive text-xs'}>{errors[0]}</p>}
    </div>
  )
}

export const ResetButton = (
  props: Omit<ComponentProps<typeof Button>, 'variant' | 'size' | 'disabled' | 'type' | 'onClick'>,
) => {
  const {
    reset,
    data: { name: name },
    initialData: { name: initialName },
  } = useUploadFormContext()
  return (
    <Button
      disabled={name === initialName}
      type="button"
      onClick={() => reset()}
      variant={'secondary'}
      size={'icon'}
      {...props}
    >
      <RotateCcw />
    </Button>
  )
}

const upload = async (name: string, file: File, overwrite: boolean, signal: AbortSignal) => {
  const { href } = await uploadApi.uploadUrl(name, overwrite, signal)
  await uploadApi.upload(href, file, undefined, signal)
  return name
}

const handleRequest = (name: string, file: File, overwrite: boolean) => {
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
          action: { label: 'Overwrite', onClick: () => handleRequest(name, file, true) },
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

export const UploadForm = (
  props: Omit<DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, 'onSubmit'>,
) => {
  const {
    data: { name, file },
  } = useUploadFormContext()
  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        handleRequest(name, file, false)
      }}
      {...props}
    />
  )
}

export const SubmitButton = (props: Omit<ComponentProps<typeof Button>, 'type'>) => {
  const { parsedData } = useUploadFormContext()
  return (
    <Button type={'submit'} {...props} disabled={!parsedData.success}>
      Upload
    </Button>
  )
}
