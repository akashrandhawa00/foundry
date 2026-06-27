import { Sidebar } from "../components/Navbar.tsx";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 text-white">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
