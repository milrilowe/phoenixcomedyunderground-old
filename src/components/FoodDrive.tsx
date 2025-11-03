import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function FoodDrive() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<button className="w-full bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground font-bold lg:text-lg text-sm lg:px-8 px-4 lg:py-4 py-3 rounded-none border-4 border-primary hover:border-secondary shadow-lg transform hover:scale-105 transition-all duration-200 uppercase tracking-wide">
					PHX Snaps Back
				</button>
			</DialogTrigger>

			<DialogContent className="max-w-2xl p-0 overflow-hidden">
				<img
					src="/phx-snaps-back.jpg"
					alt="PHX Snaps Back - A Food Fight Against the Shutdown. Help families affected by the shutdown! Comedy shows all over the valley! Donate and laugh! Non-perishable food items! St. Mary's Food Bank Alliance"
					className="w-full h-auto"
				/>
				<div className="p-4 -mt-4 bg-white">
					<p className="text-center text-sm font-medium text-gray-800">
						<strong>We will be collecting food items at this show!</strong><br />
						If you'd like to help, bring non-perishable items to donate!
					</p>
				</div>
			</DialogContent>
		</Dialog>
	);
}