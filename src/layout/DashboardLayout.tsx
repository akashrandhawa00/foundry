import { Sidebar } from "../components/Sidebar.tsx";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
    return (
        <div className="md:flex min-h-dvh ">
            <Sidebar />
            <main className="md:flex-1 text-primary overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
