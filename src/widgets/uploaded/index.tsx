import { observer } from 'mobx-react-lite'
import { filesStore } from '@/entities/files-storage'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card.tsx'
import { ScrollArea } from '@/shared/components/ui/scroll-area.tsx'
import { Badge } from '@/shared/components/ui/badge.tsx'
import { DownloadButton } from '@/features/download'
import { formatFileSize } from '@/shared/lib/utils.ts'

export const FilesListCard = observer(() => {
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
