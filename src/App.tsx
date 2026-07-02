import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { Overview } from "./pages/Overview";
import DashboardLayout from "./layout/DashboardLayout";
import { ProductionRuns } from "./pages/ProductionRuns";
import { NotFound } from "./pages/NotFound";
import { Parts } from "./pages/Parts";
import { Users } from "./pages/Users";
import { Quality } from "./pages/Quality";
import { Toaster } from "sonner";

const App = () => {
    return (
        <>
            <Toaster position="top-right" richColors theme="dark" />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route element={<DashboardLayout />}>
                        <Route index element={<Overview />} />
                        <Route
                            path="/production-runs"
                            element={<ProductionRuns />}
                        />
                        <Route path="/quality" element={<Quality />} />
                        <Route path="/parts" element={<Parts />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Route>
            </Routes>
        </>
    );
};

export default App;
