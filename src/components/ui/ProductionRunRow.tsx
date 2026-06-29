import { useState } from "react";
import type { ProductionRun } from "../../hooks/useProductionRuns";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const tdBaseStyle = "px-3 py-3 text-sm";
const shiftStyles = {
    morning: "bg-green-700 text-green-100",
    afternoon: "bg-yellow-500 text-yellow-900",
    midnight: "bg-purple-400 text-purple-800",
};
const cardBaseStyle = "rounded-lg px-4 py-3 border border-white/20 bg-surface";
const cardHeadingStyle =
    "mb-1 tracking-wide uppercase text-xs text-text-secondary";

function yeildRate(run: ProductionRun) {
    return run.qtyLoaded > 0
        ? Math.round((run.qtyCoated / run.qtyLoaded) * 100)
        : 0;
}

export const ProductionRunRow = ({ run }: { run: ProductionRun }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const totalLoss = run.qtyDefects + run.qtyFallOff;
    const createdAt = new Date(run.createdAt).toLocaleString("en-CA", {
        dateStyle: "medium",
        timeStyle: "short",
    });

    return (
        <>
            <tr
                onClick={() => setIsExpanded((prev) => !prev)}
                className={`${isExpanded ? "bg-surface-active/60 hover:bg-surface-active" : "hover:bg-brand/40"}  cursor-pointer transition-colors duration-200 border-t border-surface-active `}
            >
                <td className={`${tdBaseStyle}`}>{run.id}</td>
                <td className={`${tdBaseStyle}`}>{run.partNumber}</td>
                <td className={`${tdBaseStyle}`}>{run.partDescription}</td>
                <td className={`${tdBaseStyle}`}>
                    <span
                        className={`rounded inline-block px-2 py-0.5 ${shiftStyles[run.shift]}`}
                    >
                        {run.shift}
                    </span>
                </td>
                <td className={`${tdBaseStyle}`}>{run.qtyLoaded}</td>
                <td className={`${tdBaseStyle}`}>{run.qtyCoated}</td>
                <td
                    className={`${tdBaseStyle} ${totalLoss > 0 ? "text-danger-text" : ""}`}
                >
                    {totalLoss}
                </td>
                <td>{isExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />}</td>
            </tr>

            {/* expanded row */}
            {isExpanded && (
                <tr
                    className={`${isExpanded ? "bg-surface-active/60 hover:bg-surface-active" : ""} border-b border-white/20 animate-fadeIn`}
                >
                    <td colSpan={8} className="pt-3">
                        <div className="grid grid-cols-4 gap-3 mb-4 mx-4">
                            <div className={`${cardBaseStyle}`}>
                                <p className={cardHeadingStyle}>Yield Rate</p>
                                <p
                                    className={`${yeildRate(run) > 97 ? "text-success" : "text-warning"}`}
                                >
                                    {yeildRate(run)}%
                                </p>
                            </div>
                            <div className={`${cardBaseStyle}`}>
                                <p className={cardHeadingStyle}>Defects</p>
                                <p
                                    className={`${run.qtyDefects > 0 ? "text-danger-text" : ""}`}
                                >
                                    {run.qtyDefects}
                                </p>
                            </div>
                            <div className={`${cardBaseStyle}`}>
                                <p className={cardHeadingStyle}>Falloff</p>
                                <p
                                    className={`${run.qtyFallOff > 0 ? "text-warning" : ""}`}
                                >
                                    {run.qtyFallOff}
                                </p>
                            </div>
                            <div className={`${cardBaseStyle}`}>
                                <p className={cardHeadingStyle}>Total Loss</p>
                                <p>{totalLoss}</p>
                            </div>
                        </div>

                        {/* additiona info  */}
                        <div className="text-sm gap-6 flex text-text-muted px-3 py-2">
                            <span className="group">
                                Logged By:{" "}
                                <span className="text-text-secondary relative">
                                    <div className="translate-y-2 translate-x-5 opacity-0 transition-all duration-200 delay-500 group-hover:opacity-100 text-white group-hover:translate-y-1 px-2 py-2 rounded bg-brand/90 border border-brand absolute">
                                        {run.loggedByRole}
                                    </div>
                                    {run.loggedBy}
                                </span>
                            </span>
                            <span>
                                Created:{" "}
                                <span className="text-text-secondary">
                                    {createdAt}
                                </span>
                            </span>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};
