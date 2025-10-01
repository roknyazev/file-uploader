import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Toaster } from '@/shared/components/ui/sonner'

export const Route = createRootRoute({
  component: () => (
    <>
      <main className={'max-w-7xl mx-auto h-screen overflow-hidden'}>
        <Outlet />
      </main>
      <Toaster position={'bottom-left'} closeButton richColors />
    </>
  ),
})
