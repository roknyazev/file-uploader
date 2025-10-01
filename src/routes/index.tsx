import { createFileRoute } from '@tanstack/react-router'
import { SelectFileProvider } from '@/features/select'
import { UploadCard } from '@/widgets/upload'
import { FilesListCard } from '@/widgets/uploaded'

export const Route = createFileRoute('/')({
  component: App,
})

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
