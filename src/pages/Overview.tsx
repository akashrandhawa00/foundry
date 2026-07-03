import { useEffect } from "react";
import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useProductionRuns } from "../hooks/useProductionRuns";
import { OverviewRow } from "../components/ui/Rows/OverviewRow";

const overViewCardStyle =
    "rounded-md bg-neutral-900 border border-white/20 px-3 py-2";

export const Overview = () => {
    const { profile } = useAuth();

    const from = new Date();
    from.setDate(from.getDate());

    const { runs, fetchRuns } = useProductionRuns({
        from: from.toISOString().slice(0, 10),
    });

    useEffect(() => {
        fetchRuns();
    }, [fetchRuns]);

    return (
        <div className="md:px-10 px-6 py-8">
            <PageHeader
                title={`Welcome ${profile ? profile?.full_name?.split(" ")[0] : ""}`}
                addRunButton={true}
                showTagline={false}
            />
            <div className="grid grid-cols-2 mt-8 gap-5">
                <div className={`${overViewCardStyle}`}>
                    This is the first one
                </div>
                <div className={`${overViewCardStyle}`}>
                    and here comes another
                </div>

                <div
                    id="overview-run-table"
                    className={`col-span-2 overflow-x-auto  ${overViewCardStyle}`}
                >
                    <h2 className="border-l-4 border-brand px-2 uppercase font-mono my-2 mx-2">
                        Recent Runs
                    </h2>
                    <table className="min-w-max w-full border-collapse text-left">
                        <thead>
                            <tr className="py-6 px-12 border-b border-surface-active">
                                {[
                                    "Date",
                                    "Part",
                                    "Shift",
                                    "Loaded",
                                    "Coated",
                                    "Defect %",
                                    "",
                                ].map((header) => (
                                    <th
                                        key={header}
                                        className="px-3 py-2 text-sm font-medium text-text-label uppercase tracking-wide"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {runs.map((run) => (
                                <OverviewRow key={run.id} run={run} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
