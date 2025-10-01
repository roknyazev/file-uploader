import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'
import { Toaster } from '@/shared/components/ui/sonner'

export const Route = createRootRoute({
  component: () => (
    <>
      <main className={'max-w-7xl mx-auto h-screen overflow-hidden'}>
        <Outlet />
      </main>
      <TanstackDevtools
        config={{
          position: 'bottom-left',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
      <Toaster position={'top-center'} closeButton richColors />
    </>
  ),
})
