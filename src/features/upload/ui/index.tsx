import { RotateCcw } from 'lucide-react'
import { uploadAction } from '../model'
import type { ComponentProps, DetailedHTMLProps, FormHTMLAttributes } from 'react'
import { Input } from '@/shared/components/ui/input.tsx'
import { useUploadFormContext } from '@/features/upload/model'
import { Button } from '@/shared/components/ui/button.tsx'
import { cn } from '@/shared/lib/utils.ts'

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
        uploadAction(name, file, false)
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
