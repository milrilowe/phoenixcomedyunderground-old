import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Lock, Mail } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { login } from '@/lib/actions/auth'
import { loginSchema } from '@/lib/schemas/auth'
import type { LoginInput } from '@/lib/schemas/auth'

export default function Login() {
  const navigate = useNavigate()
  const [isPending, startTransition] = React.useTransition()
  
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  async function onSubmit(data: LoginInput) {
    startTransition(async () => {
      try {
        const result = await login({ data })
        
        if (!result.success) {
          toast.error(result.message)
          return
        }
        
        toast.success('Login successful!')
        navigate({ to: '/dashboard' })
      } catch (error) {
        toast.error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    })
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-950">
      <div className="w-full max-w-md space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 relative">
            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center">
              <Lock className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-400">
            Or{' '}
            <a href="/register" className="font-medium text-yellow-500 hover:text-yellow-400">
              register for a new account
            </a>
          </p>
        </div>
        
        <div className="mt-8 bg-zinc-900 p-6 rounded-lg border border-zinc-800">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-200">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                        <Input
                          type="email"
                          className="bg-zinc-800 border-zinc-700 text-zinc-100 pl-10
                            focus-visible:ring-yellow-500 focus-visible:border-yellow-500"
                          placeholder="your@email.com"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-200">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                        <Input
                          type="password"
                          className="bg-zinc-800 border-zinc-700 text-zinc-100 pl-10
                            focus-visible:ring-yellow-500 focus-visible:border-yellow-500"
                          placeholder="••••••••"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <div>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-yellow-500 text-zinc-950 hover:bg-yellow-400 
                    focus-visible:ring-yellow-500 transition-colors"
                >
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign in
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}