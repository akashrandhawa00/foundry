import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useProductionRuns } from "../hooks/useProductionRuns";
import { OverviewRow } from "../components/ui/Rows/OverviewRow";
import { useNavigate } from "react-router-dom";

const overViewCardStyle =
    "rounded-md bg-neutral-900 border border-white/20 px-3 py-2";

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
            <div className="grid grid-cols-2 lg:grid-cols-2 mt-8 gap-5">
                <div className={`${overViewCardStyle} min-h-60`}>
                    Today's Production
                </div>
                <div className={`${overViewCardStyle}`}>This week</div>
                <div className={`${overViewCardStyle} min-h-60`}>Yield %</div>
                <div className={`${overViewCardStyle}`}>Defect %</div>
            </div>
            <div
                id="overview-run-table"
                className={`col-span-2 md:col-span-full  mt-5 rounded-md bg-neutral-900 border border-white/20 pl-3 md:px-3 py-2 `}
            >
                <h2
                    onClick={() => navigate("/production-log")}
                    className="border-l-4 border-brand px-2 uppercase font-mono my-2 mx-2 cursor-pointer"
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
