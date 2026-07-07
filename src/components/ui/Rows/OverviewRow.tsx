import { useState } from "react";
import type { ProductionRun } from "../../../hooks/useProductionRuns";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const tdBaseStyle = "px-3 py-3 text-sm ";

// export const shiftStyles = {
//     morning: "bg-emerald-700 text-emerald-200",
//     afternoon: "bg-blue-600 text-blue-200",
//     midnight: "bg-rose-800 text-rose-200",
// };
export const shiftStyles = {
    morning: "bg-[#2a9d8f] text-neutral-100",
    afternoon: "bg-[#e9c46a] text-neutral-900",
    midnight: "bg-rose-400 text-neutral-900",
};

const cardBaseStyle = "rounded-lg px-4 py-3 border border-white/20 bg-gray-900";
const cardHeadingStyle =
    "mb-1 tracking-wide uppercase text-xs text-text-secondary";

function yeildRate(run: ProductionRun) {
    return Math.round((run.qtyCoated / run.qtyLoaded) * 100);
}

function defectRate(run: ProductionRun) {
    return Number(((run.qtyDefects / run.qtyLoaded) * 100).toFixed(2));
}

export const OverviewRow = ({ run }: { run: ProductionRun }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const totalLoss = run.qtyDefects + run.qtyFallOff;
    const createdAt = new Date(run.createdAt).toLocaleString("en-CA", {
        dateStyle: "medium",
        timeStyle: "short",
    });

    const runDate = new Date(run.runDate).toLocaleString("en-CA", {
        dateStyle: "medium",
    });

    let defectRateStyle = "";
    if (defectRate(run) > 1) {
        defectRateStyle = "border-l-4 border-orange-300 text-orange-300";
    }
    if (defectRate(run) > 2) {
        defectRateStyle = "border-l-4 border-red-400 text-red-400";
    }

    return (
        <>
            <tr
                onClick={() => setIsExpanded((prev) => !prev)}
                className={`${isExpanded ? "bg-surface-active/60 " : "hover:bg-brand/40"}  cursor-pointer transition-colors duration-200 border-t border-surface-active `}
            >
                <td className={`${tdBaseStyle} text-lg ${defectRateStyle}`}>
                    {defectRate(run)} %
                </td>
                <td className={`${tdBaseStyle} hidden md:table-cell`}>
                    {run.runTime?.slice(0, 5) ?? "-"}
                </td>
                <td className={`${tdBaseStyle} uppercase`}>{run.partNumber}</td>
                <td className={`${tdBaseStyle} uppercase`}>
                    {run.partDescription}
                </td>
                <td className={`${tdBaseStyle}`}>
                    <span
                        className={`rounded inline-block px-2 py-0.5 ${shiftStyles[run.shift]}`}
                    >
                        {run.shift}
                    </span>
                </td>
                <td className={`${tdBaseStyle}`}>{run.qtyCoated}</td>
                <td>{isExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />}</td>
            </tr>

            {/* expanded row */}
            {isExpanded && (
                <tr
                    className={`${isExpanded ? "bg-surface-active/60 " : ""} border-b border-white/20 animate-fadeIn`}
                >
                    <td colSpan={7} className="pt-3">
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
                                    className={`${run.qtyDefects > 0 ? "text-red-300" : ""}`}
                                >
                                    {run.qtyDefects}
                                </p>
                            </div>
                            <div className={`${cardBaseStyle}`}>
                                <p className={cardHeadingStyle}>Falloff</p>
                                <p
                                    className={`${run.qtyFallOff > 0 ? "text-orange-300" : ""}`}
                                >
                                    {run.qtyFallOff}
                                </p>
                            </div>
                            <div className={`${cardBaseStyle}`}>
                                <p className={cardHeadingStyle}>Total Loss</p>
                                <p
                                    className={`${run.qtyDefects + run.qtyFallOff > 0 ? "text-danger-text" : ""}`}
                                >
                                    {totalLoss}
                                </p>
                            </div>
                        </div>

                        {/* additiona info  */}
                        <div className="text-sm gap-6 flex text-text-muted px-3 py-2">
                            <span>
                                Run Date:{" "}
                                <span className="text-text-secondary">
                                    {runDate}
                                </span>
                            </span>
                            <span>
                                Created:{" "}
                                <span className="text-text-secondary">
                                    {createdAt}
                                </span>
                            </span>
                            <span>
                                Logged By:{" "}
                                <span className="text-text-secondary relative">
                                    <div className="translate-y-2 translate-x-5 opacity-0 capitalize transition-all duration-200 delay-500  text-white  px-2 py-2 rounded bg-brand/90 border border-brand absolute">
                                        {run.loggedByRole.split("_").join(" ")}
                                    </div>
                                    {run.loggedBy}
                                </span>
                            </span>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};
