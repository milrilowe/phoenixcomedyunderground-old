import { createFileRoute } from '@tanstack/react-router'
import { Contact } from '@/pages'

export const Route = createFileRoute('/_appLayout/contact')({
    component: RouteComponent,
})

function RouteComponent() {
    return <Contact />
}
