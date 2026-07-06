import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import { useProductionRuns } from "../hooks/useProductionRuns";
import { ProductionRunRow } from "../components/ui/ProductionRunRow";
import { TableSkeleton } from "../components/ui/TableSkeleton";
import { Button } from "../components/Button";
import { FaFilter } from "react-icons/fa";

export const ProductionRuns = () => {
    const from = new Date();
    const [filter, setFilter] = useState<string>();

    const { runs, loading, error } = useProductionRuns({
        from: filter,
    });

    const [showFilters, setShowFilters] = useState<boolean>(false);

    return (
        <div className="md:px-10 px-6 py-8">
            <PageHeader
                title={"Production Log"}
                runs={runs}
                showAddRunButton={true}
            />
            <div className="flex justify-end gap-4">
                {/* <div */}
                {/*     className={`${showFilters ? "block" : "hidden"} flex justify-end items-center gap-2.5`} */}
                {/* > */}
                {/*     <div className="flex items-center gap-1"> */}
                {/*         <label className="text-primary">From: </label> */}
                {/*         <input */}
                {/*             value={dateToday} */}
                {/*             className="px-2 border border-white/10 rounded-md text-neutral-300 py-1 w-42 " */}
                {/*             type="date" */}
                {/*             onChange={(e) => setFilter(e.target.value)} */}
                {/*         /> */}
                {/*     </div> */}
                {/*     <div className="flex items-center gap-1"> */}
                {/*         <label className="text-primary">To: </label> */}
                {/*         <input */}
                {/*             type="date" */}
                {/*             className="px-2 border border-white/10 rounded-md text-neutral-300 py-1 w-42 " */}
                {/*         /> */}
                {/*     </div> */}
                {/* </div> */}
                <div
                    className={`${showFilters ? "block" : "hidden"} flex gap-2`}
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
                <div
                    className={` ${showFilters ? "border-l-2 border-neutral-500" : ""}  pl-3`}
                >
                    <Button
                        onClick={() => setShowFilters((prev) => !prev)}
                        className="w-28 flex flex-1 items-center gap-2 rounded-md transition-all text-text-secondary bg-gray-900 justify-center px-2 py-2 duration-200 cursor-pointer text-sm border border-white/20 hover:border-white/40 hover:text-neutral-300 hover:bg-neutral-500/20 "
                    >
                        {" "}
                        <FaFilter />
                        {showFilters ? "Hide" : "Filter"}
                    </Button>
                </div>
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
                                <ProductionRunRow key={run.id} run={run} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
