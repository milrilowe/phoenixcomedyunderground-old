import React from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';



export function MailingListForm() {
    const [isPending, startTransition] = React.useTransition();


    async function onSubmit(data) {
        console.log('hi')
    }

    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4 md:p-6">
                <h2 className="text-xl font-bold text-zinc-50 mb-4">Join Our Mailing List</h2>

                <Input
                    type="text"
                    className="absolute -left-[9999px]"
                    tabIndex={-1}
                    autoComplete="off"
                />

                <Input
                    type="email"
                    placeholder="your@email.com"
                    autoFocus={false}
                    className="bg-zinc-800 border-zinc-700 text-zinc-50 placeholder:text-zinc-500 flex-1"
                    onBlur={() => {

                    }}
                />

                <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-yellow-500 text-zinc-950 
                        hover:bg-yellow-400 transition-colors 
                        disabled:bg-yellow-500/70"
                >
                    {isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Subscribe
                </Button>
            </CardContent>
        </Card>
    )
}
