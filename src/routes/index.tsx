import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card.tsx'
import { Button } from '@/shared/components/ui/button.tsx'
import { Badge } from '@/shared/components/ui/badge.tsx'
import { NameInput, ResetButton, SubmitButton, UploadForm, UploadFormProvider } from '@/features/upload'

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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  return (
    <div className={'w-full h-full flex gap-6 items-center'}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Upload file</CardTitle>
          <CardDescription>Select or drag and drop a file to upload.</CardDescription>
          <CardAction>
            <Button variant={selectedFile ? 'outline' : 'default'} onClick={() => fileInputRef.current?.click()}>
              Select file
            </Button>
            <input
              multiple={false}
              ref={fileInputRef}
              type={'file'}
              className={'hidden'}
              onChange={e => setSelectedFile(e.target.files?.[0] || null)}
            />
          </CardAction>
        </CardHeader>
        {selectedFile && (
          <CardContent className={'flex flex-col gap-2'}>
            <UploadFormProvider file={selectedFile}>
              <UploadForm className={'flex gap-2'}>
                <NameInput />
                <ResetButton />
                <SubmitButton />
              </UploadForm>
            </UploadFormProvider>

            <div className={'flex gap-1 flex-wrap'}>
              {selectedFile.size && <Badge>{formatFileSize(selectedFile.size)}</Badge>}
              {selectedFile.type && <Badge variant={'secondary'}>{selectedFile.type}</Badge>}
              {selectedFile.lastModified && (
                <Badge variant={'secondary'}>
                  {new Date(selectedFile.lastModified).toLocaleDateString('en', {
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
      <Card className="w-full max-w-sm h-fit">
        <CardHeader>
          <CardTitle>Uploaded files</CardTitle>
          <CardDescription>There are no uploaded files.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
