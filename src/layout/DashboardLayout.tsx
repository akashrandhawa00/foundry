import { Sidebar } from "../components/Sidebar.tsx";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
