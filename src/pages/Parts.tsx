import { useEffect } from "react";
import PageHeader from "../components/ui/PageHeader";
import { useParts } from "../hooks/useParts";
import { PartsRow } from "../components/ui/PartsRow";

export const Parts = () => {
    const { parts, loading, error, fetchParts } = useParts();

    useEffect(() => {
        fetchParts();
    }, [fetchParts]);

    return (
        <div className="px-10 py-8">
            <PageHeader
                title={"Parts List"}
                parts={parts}
                filterButton={false}
                addPartButton={true}
                addRunButton={true}
            />
            {loading ? (
                <p>loading</p>
            ) : error ? (
                <div>Error: {error}</div>
            ) : (
                <div id="parts-table">
                    <table className="w-full border-collapse text-left mt-8">
                        <thead>
                            <tr className="py-6 px-12 border-b border-surface-active">
                                {[
                                    "Part Number",
                                    "Description",
                                    "Client",
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
                            {parts.map((part) => (
                                <PartsRow key={part.partNumber} part={part} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
