import { MailingListForm, MessageForm } from './components';

export function Contact() {

    return (
        <main className="min-h-[calc(100vh-var(--navbar-height))] bg-zinc-950">
            <div className="w-full max-w-3xl mx-auto px-4 py-8 md:py-12">
                <div className="space-y-6">
                    <MessageForm />
                    <MailingListForm />
                </div>
            </div>
        </main>
    )
}