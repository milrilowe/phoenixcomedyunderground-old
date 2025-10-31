import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribe } from "@/lib/actions/subscribers";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";

const subscribeSchema = z.object({
	email: z.string().email("Please provide a valid email address"),
});

export function EmailForm({ className = "" }) {
	const [isPending, startTransition] = React.useTransition();
	const [buttonText, setButtonText] = React.useState("Join");
	const form = useForm({
		resolver: zodResolver(subscribeSchema),
		defaultValues: { email: "" },
	});

	const onSubmit = React.useCallback(async (data: { email: string }) => {
		startTransition(async () => {
			try {
				const result = await subscribe({ data });
				setButtonText(result.alreadySubscribed ? "Already subscribed!" : "Welcome!");
				form.reset();
				setTimeout(() => setButtonText("Join"), 3000);
			} catch {
				setButtonText("Try again");
				setTimeout(() => setButtonText("Join"), 3000);
			}
		});
	}, [form]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className={className}>
				<div className="flex flex-col sm:flex-row gap-3">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormControl>
									<Input
										type="email"
										placeholder="your@email.com"
										className="bg-white text-foreground placeholder:text-muted-foreground border-2 border-border rounded-none font-medium focus:border-primary focus:ring-0"
										{...field}
									/>
								</FormControl>
								<FormMessage className="text-destructive text-xs" />
							</FormItem>
						)}
					/>
					<Button
						type="submit"
						disabled={isPending}
						className="bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground font-bold px-6 py-2 rounded-none border-2 border-primary hover:border-secondary uppercase tracking-wide text-sm"
					>
						{isPending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
						{buttonText}
					</Button>
				</div>
			</form>
		</Form>
	);
}
