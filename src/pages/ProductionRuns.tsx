import { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import { useProductionRuns } from "../hooks/useProductionRuns";
import { ProductionRunRow } from "../components/ui/ProductionRunRow";
import { TableSkeleton } from "../components/ui/TableSkeleton";
import { Button } from "../components/Button";

export const ProductionRuns = () => {
    const from = new Date();
    const [filter, setFilter] = useState<string>();

    const { runs, deleteRun, editRun, loading, error, fetchRuns } =
        useProductionRuns({
            from: filter,
        });

    const [showFilters, setShowFilters] = useState<boolean>(false);

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
            <div className="flex justify-end">
                <div
                    className={`${showFilters ? "block" : "hidden"} flex mt-2 gap-2`}
                >
                    <Button
                        onClick={() => {
                            from.setDate(from.getDate());
                            setFilter(from.toISOString().slice(0, 10));
                        }}
                    >
                        Today
                    </Button>
                    <Button
                        onClick={() => {
                            from.setDate(from.getDate() - 7);
                            setFilter(from.toISOString().slice(0, 10));
                        }}
                    >
                        Week
                    </Button>
                    <Button
                        onClick={() => {
                            from.setDate(from.getDate() - 30);
                            setFilter(from.toISOString().slice(0, 10));
                        }}
                    >
                        Month
                    </Button>
                </div>
                <Button onClick={() => setShowFilters((prev) => !prev)}>
                    {showFilters ? "x" : "Filter Logs"}
                </Button>
            </div>
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
                                    "Run Date",
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
                                <ProductionRunRow
                                    key={run.id}
                                    run={run}
                                    deleteRun={deleteRun}
                                    editRun={editRun}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
