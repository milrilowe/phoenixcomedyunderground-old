import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, List } from 'lucide-react'

interface ViewToggleProps {
    children: (view: 'list' | 'calendar') => React.ReactNode
}

export function ViewToggle({ children }: ViewToggleProps) {
    const [view, setView] = useState<'list' | 'calendar'>('calendar')

    return (
        <>
            <div className="flex justify-center">
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setView('calendar')}
                        className={`min-w-32 justify-center flex gap-2 ${view === 'calendar' ? '' : 'bg-zinc-800 text-white'}`}
                    >
                        <Calendar className="h-4 w-4" />
                        Calendar
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setView('list')}
                        className={`min-w-32 justify-center flex gap-2 ${view === 'list' ? '' : 'bg-zinc-800 text-white'}`}
                    >
                        <List className="h-4 w-4" />
                        List
                    </Button>
                </div>
            </div>
            {children(view)}
        </>
    )
}