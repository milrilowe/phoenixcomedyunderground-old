import { MailingListDialog } from "@/components"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Link } from "@tanstack/react-router"
import { Menu } from "lucide-react"
import { useState } from "react"

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false)

    const handleLinkClick = () => {
        setIsOpen(false)
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    className="md:hidden text-zinc-400 w-12 h-12 rounded-md hover:bg-zinc-800/50"
                >
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-zinc-950 border-zinc-800 p-0">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-zinc-800">
                        <h2 className="text-xl font-semibold text-zinc-100">Menu</h2>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 py-6">
                        <nav className="space-y-1">
                            <Link
                                to="/"
                                className="flex items-center px-6 py-4 text-base font-medium text-zinc-100 hover:bg-zinc-900 transition-colors"
                                onClick={handleLinkClick}
                            >
                                <span>Home</span>
                            </Link>

                            <div className="h-px bg-zinc-800/60 mx-6 my-2"></div>

                            <Link
                                to="/calendar"
                                className="flex items-center px-6 py-4 text-base font-medium text-zinc-100 hover:bg-zinc-900 transition-colors"
                                onClick={handleLinkClick}
                            >
                                <span>Events</span>
                            </Link>

                            <div className="h-px bg-zinc-800/60 mx-6 my-2"></div>

                            <Link
                                to="/contact"
                                className="flex items-center px-6 py-4 text-base font-medium text-zinc-100 hover:bg-zinc-900 transition-colors"
                                onClick={handleLinkClick}
                            >
                                <span>Contact</span>
                            </Link>
                        </nav>
                    </div>

                    {/* Footer with Mailing List */}
                    <div className="border-t border-zinc-800 p-6">
                        <div className="mb-3 text-sm text-zinc-400">
                            Stay updated on upcoming shows
                        </div>
                        <MailingListDialog />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}