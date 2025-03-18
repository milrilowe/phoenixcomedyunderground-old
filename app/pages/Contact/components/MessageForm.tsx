import React from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';


export function MessageForm() {
    const [isPending, startTransition] = React.useTransition();

    async function onSubmit(data: FormData) {
        console.log('hi')
    }

    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4 md:p-6">
                <h2 className="text-xl font-bold text-zinc-50 mb-4">Contact Us</h2>

                <Input
                    type="text"
                    className="absolute -left-[9999px]"
                    tabIndex={-1}
                    autoComplete="off"
                />

                <Input
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') e.preventDefault();
                    }}
                    placeholder="Your name"
                    className="bg-zinc-800 border-zinc-700 text-zinc-50 placeholder:text-zinc-500 mt-1.5"
                />

                <Input
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') e.preventDefault();
                    }}
                    type="email"
                    placeholder="your@email.com"
                    className="bg-zinc-800 border-zinc-700 text-zinc-50 placeholder:text-zinc-500 mt-1.5"
                />

                <Label htmlFor="message" className="text-zinc-50">Message</Label>
                <textarea
                    placeholder="Your message"
                    className="mt-1.5 w-full h-32 md:h-48 rounded-md bg-zinc-800 border border-zinc-700 
                                     text-zinc-50 placeholder:text-zinc-500 p-3 focus:outline-none focus:ring-2 
                                     focus:ring-yellow-500 focus:border-transparent resize-none"
                />


                <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-yellow-500 text-zinc-950 hover:bg-yellow-400 transition-colors disabled:bg-yellow-500/70"
                >
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Message
                </Button>
            </CardContent>
        </Card>
    );
}