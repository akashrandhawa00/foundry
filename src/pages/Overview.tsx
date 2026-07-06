import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useProductionRuns } from "../hooks/useProductionRuns";
import { OverviewRow } from "../components/ui/Rows/OverviewRow";
import { useNavigate } from "react-router-dom";
import {
    DashboardCharts,
    overViewCardStyle,
} from "../components/DashboardCharts";

export const Overview = () => {
    const { profile } = useAuth();
    const navigate = useNavigate();

    const from = new Date();
    from.setDate(from.getDate());

    const { runs } = useProductionRuns();

    return (
        <div className="md:px-10 px-6 py-8">
            <PageHeader
                title={`Welcome ${profile ? profile?.full_name?.split(" ")[0] : ""}`}
                showAddRunButton={true}
                showTagline={false}
            />
            <DashboardCharts />
            <div
                id="overview-run-table"
                className={`col-span-2 md:col-span-full  mt-5 ${overViewCardStyle}`}
            >
                <h2
                    onClick={() => navigate("/production-log")}
                    className="border-l-4 border-brand px-2 uppercase font-mono my-2 cursor-pointer"
                >
                    Recent Runs
                </h2>
                <div className="overflow-x-auto">
                    {" "}
                    <table className="min-w-max w-full border-collapse  text-left">
                        <thead>
                            <tr className="py-6 pl-12 pr-0 md:px-12 border-b border-surface-active">
                                {[
                                    "Defect %",
                                    "Time",
                                    "Part",
                                    "Description",
                                    "Shift",
                                    "Coated",
                                    "",
                                ].map((header) => (
                                    <th
                                        key={header}
                                        className={`px-3 py-2 text-sm font-medium text-text-label uppercase tracking-wide ${header === "Time" ? "hidden md:table-cell" : ""}`}
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {runs.slice(0, 5).map((run) => (
                                <OverviewRow key={run.id} run={run} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
