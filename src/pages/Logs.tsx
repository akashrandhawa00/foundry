import { useEffect } from "react";
import PageHeader from "../components/ui/PageHeader";
import { useProductionRuns } from "../hooks/useProductionRuns";
import { ProductionRunRow } from "../components/ui/ProductionRunRow";
import { ProductionRunsSkeleton } from "../components/ui/ProductionRunsSkeleton";

export const Logs = () => {
    const { runs, loading, error, fetchRuns } = useProductionRuns();

    useEffect(() => {
        fetchRuns();
    }, [fetchRuns]);

    return (
        <div className="px-10 py-8">
            <PageHeader
                title={"Production Log"}
                runs={runs}
                filterButton={true}
                addButton={true}
            />
            {loading ? (
                <ProductionRunsSkeleton />
            ) : error ? (
                <div>Error: {error}</div>
            ) : (
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
            )}
        </div>
    );
};
