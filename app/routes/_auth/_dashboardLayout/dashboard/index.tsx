import { createFileRoute } from '@tanstack/react-router'
import { Dashboard } from '@/pages'

export const Route = createFileRoute('/_auth/_dashboardLayout/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Dashboard />
}
