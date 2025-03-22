import { NotFound } from '@/components'
import { DashboardLayout } from '@/layouts/dashboard-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_dashboardLayout')({
  component: DashboardLayout,
  notFoundComponent: () => <NotFound />,

})