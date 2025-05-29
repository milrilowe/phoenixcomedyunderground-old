import { MailingListDialog } from "@/components"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import { Link, Outlet } from "@tanstack/react-router"
import { MobileNav } from "./components"
import { Toaster } from "sonner"

export function AppLayout({ children }) {
    return (
        <>
            <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-background backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="flex items-center h-full">
                            <img
                                src="/logo-transparent.svg"
                                alt="Phoenix Comedy Underground"
                                className='h-full'
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:block">
                            <NavigationMenu>
                                <NavigationMenuList className="flex space-x-8">
                                    <NavigationMenuItem>
                                        <NavigationMenuLink
                                            href="/contact"
                                            className="text-zinc-300 hover:text-zinc-100 transition-colors"
                                        >
                                            Contact
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                    <MailingListDialog />
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        {/* Mobile Navigation */}
                        <MobileNav />
                    </div>
                </div>
            </nav>
            <div className="p-6">
                {children ?
                    children : <Outlet />
                }
                <Toaster position="bottom-right" />
            </div>
        </>
    )
}

