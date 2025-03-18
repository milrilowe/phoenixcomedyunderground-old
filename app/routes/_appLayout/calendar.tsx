import { createFileRoute } from '@tanstack/react-router'
import { Calendar } from '@/pages'

export const Route = createFileRoute('/_appLayout/calendar')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Calendar />
}
