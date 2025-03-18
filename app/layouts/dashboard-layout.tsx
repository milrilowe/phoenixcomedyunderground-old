import { Outlet } from "@tanstack/react-router";

export function DashboardLayout() {

    return (
        <div>
            <div>I'm a layout</div>
            <div>
                <Outlet />
            </div>
        </div>
    )
}