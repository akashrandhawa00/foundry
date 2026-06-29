import { useEffect } from "react";
import PageHeader from "../components/ui/PageHeader";
import { useProductionRuns } from "../hooks/useProductionRuns";
import { ProductionRunRow } from "../components/ui/ProductionRunRow";

export const Logs = () => {
    const { runs, loading, error, fetchRuns } = useProductionRuns();

    useEffect(() => {
        fetchRuns();
    }, [fetchRuns]);

    if (loading) return <p className="text-text">Loading...</p>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="px-10 py-8">
            <PageHeader
                title={"Production Log"}
                runs={runs}
                filterButton={true}
                addButton={true}
            />
            <div id="production-run-table">
                <table className="w-full border-collapse text-left mt-8">
                    <thead>
                        <tr className="py-6 px-12 border-b border-surface-active">
                            {[
                                "Run ID",
                                "Part",
                                "Description",
                                "Shift",
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
