import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card.tsx'
import { Badge } from '@/shared/components/ui/badge.tsx'
import { NameInput, ResetButton, SubmitButton, UploadForm, UploadFormProvider } from '@/features/upload'
import { SelectFileButton, useSelectFileContext } from '@/features/select'
import { cn, formatFileSize } from '@/shared/lib/utils.ts'

const DnDOverlay = ({ isDragging }: { isDragging: boolean }) => {
  return (
    <div
      className={cn(
        'z-10 fixed inset-0 w-screen h-screen bg-black/50 p-4 transition-opacity duration-200 ease-out',
        isDragging ? 'opacity-100' : 'opacity-0 pointer-events-none',
      )}
    >
      <div className={`w-full h-full border-dashed border-4 border-primary/50 rounded-2xl`} />
    </div>
  )
}

export const UploadCard = () => {
  const { file, isDragging } = useSelectFileContext()
  return (
    <Card className="w-full max-w-sm">
      <DnDOverlay isDragging={isDragging} />

      <CardHeader>
        <CardTitle>Upload file</CardTitle>
        <CardDescription>Select or drag and drop a file to upload.</CardDescription>
        <CardAction>
          <SelectFileButton />
        </CardAction>
      </CardHeader>
      {file && (
        <CardContent className={'flex flex-col gap-2'}>
          <CardDescription className={'truncate'}>{file.name}</CardDescription>
          <UploadFormProvider file={file}>
            <UploadForm className={'flex gap-2 justify-between w-full'}>
              <NameInput className={'grow'} />
              <ResetButton />
              <SubmitButton />
            </UploadForm>
          </UploadFormProvider>

          <div className={'flex gap-1 flex-wrap'}>
            {file.size && <Badge>{formatFileSize(file.size)}</Badge>}
            {file.type && <Badge variant={'secondary'}>{file.type}</Badge>}
            {file.lastModified && (
              <Badge variant={'secondary'}>
                {new Date(file.lastModified).toLocaleDateString('en', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Badge>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
