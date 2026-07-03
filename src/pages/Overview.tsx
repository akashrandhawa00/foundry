import { useEffect } from "react";
import PageHeader from "../components/ui/PageHeader";
import { ProductionRunRow } from "../components/ui/ProductionRunRow";
import { useAuth } from "../context/AuthContext";
import { useProductionRuns } from "../hooks/useProductionRuns";

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
                title={` ${profile ? `Welcome,  ${profile?.full_name.split(" ")[0]}` : ""}`}
                addRunButton={true}
                showTagline={false}
            />
            <div
                id="overview-run-table"
                className="rounded-md overflow-x-auto bg-neutral-900 border border-white/20 px-3 py-2"
            >
                <h2>Recent Runs</h2>
                <table className="min-w-max w-full border-collapse text-left">
                    <thead>
                        <tr className="py-6 px-12 border-b border-surface-active">
                            {[
                                "Run ID",
                                "Part",
                                "Shift",
                                "Description",
                                "Loaded",
                                "Coated",
                                "Defects",
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
                            <ProductionRunRow key={run.id} run={run} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
