import { createFileRoute } from '@tanstack/react-router'
import { observer } from 'mobx-react-lite'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card.tsx'
import { Badge } from '@/shared/components/ui/badge.tsx'
import { NameInput, ResetButton, SubmitButton, UploadForm, UploadFormProvider } from '@/features/upload'
import { SelectFileButton, SelectFileProvider, useSelectFileContext } from '@/features/select'
import { cn } from '@/shared/lib/utils.ts'
import { filesStore } from '@/entities/files-storage'
import { DownloadButton } from '@/features/download'
import { ScrollArea } from '@/shared/components/ui/scroll-area.tsx'

export const Route = createFileRoute('/')({
  component: App,
})

const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
}

function App() {
  return (
    <div className={'w-full h-full flex gap-6 justify-center items-start py-10'}>
      <SelectFileProvider>
        <UploadCard />
      </SelectFileProvider>

      <FilesListCard />
    </div>
  )
}

const FilesListCard = observer(() => {
  const { files } = filesStore
  return (
    <Card className="w-full max-w-sm h-full flex flex-col gap-2 overflow-hidden">
      <CardHeader>
        <CardTitle>Uploaded files</CardTitle>
        {files.length === 0 && <CardDescription>There are no uploaded files.</CardDescription>}
      </CardHeader>
      <CardContent className={'h-full'}>
        <ScrollArea className={'pr-3 h-full'}>
          <div className={'flex flex-col gap-2 pb-6'}>
            {files.map(file => (
              <Card key={file.name} className="w-full h-fit">
                <CardHeader>
                  <CardTitle className={'truncate'}>{file.name}</CardTitle>
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
                  <CardAction>
                    <DownloadButton fileName={file.name} />
                  </CardAction>
                </CardHeader>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
})

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

const UploadCard = () => {
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
