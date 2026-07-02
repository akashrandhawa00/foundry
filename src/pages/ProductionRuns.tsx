import { useEffect } from "react";
import PageHeader from "../components/ui/PageHeader";
import { useProductionRuns } from "../hooks/useProductionRuns";
import { ProductionRunRow } from "../components/ui/ProductionRunRow";
import { TableSkeleton } from "../components/ui/TableSkeleton";

export const ProductionRuns = () => {
    const { runs, loading, error, fetchRuns } = useProductionRuns();

    useEffect(() => {
        fetchRuns();
    }, [fetchRuns]);

    return (
        <div className="md:px-10 px-6 py-8">
            <PageHeader
                title={"Production Log"}
                runs={runs}
                filterButton={true}
                addRunButton={true}
            />
            {loading ? (
                <TableSkeleton />
            ) : error ? (
                <div>Error: {error}</div>
            ) : (
                <div id="production-run-table" className="overflow-x-auto">
                    <table className="min-w-max w-full border-collapse text-left mt-8">
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
            )}
        </div>
    );
};
