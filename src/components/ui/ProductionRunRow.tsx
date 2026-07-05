import { useProductionRunsMutation } from "../../hooks/useProductionRunsMutation";
import { useState } from "react";
import { Modal } from "./Modal";
import { ProductionEditForm } from "../forms/ProductionEditForm";
import type { ProductionRun } from "../../hooks/useProductionRuns";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { GoPencil, GoTrash } from "react-icons/go";

//styles-----------
const tdBaseStyle = "px-3 py-3 text-sm";
export const shiftStyles = {
    morning: "bg-emerald-700 text-emerald-200",
    afternoon: "bg-blue-600 text-blue-200",
    midnight: "bg-rose-800 text-rose-200",
};
const cardBaseStyle =
    "col-span-2 rounded-lg px-4 py-3 border border-white/10 bg-gray-900 hover:scale-105 hover:border-white/20 transition-all duration-200";
const cardHeadingStyle =
    "mb-1 tracking-wide uppercase text-xs text-text-secondary";
//-----------------

function yeildRate(run: ProductionRun) {
    return run.qtyLoaded > 0
        ? Math.round((run.qtyCoated / run.qtyLoaded) * 100)
        : 0;
}

export const ProductionRunRow = ({ run }: { run: ProductionRun }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showEditRunModal, setShowEditRunModal] = useState(false);

    const { editRun, deleteRun } = useProductionRunsMutation();

    const totalLoss = run.qtyDefects + run.qtyFallOff;
    const createdAt = new Date(run.createdAt).toLocaleString("en-CA", {
        dateStyle: "medium",
        timeStyle: "short",
    });
    const runDate = new Date(run.runDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });

    return (
        <>
            <tr
                onClick={() => setIsExpanded((prev) => !prev)}
                className={`${isExpanded ? "bg-surface-active/60 " : "hover:bg-brand/40"}  cursor-pointer transition-colors duration-200 border-t border-surface-active `}
            >
                <td className={`${tdBaseStyle}`}>{runDate}</td>
                <td className={`${tdBaseStyle}`}>{run.partNumber}</td>
                <td className={`${tdBaseStyle}`}>
                    <span
                        className={`rounded inline-block px-2 py-0.5 ${shiftStyles[run.shift]}`}
                    >
                        {run.shift}
                    </span>
                </td>
                <td className={`${tdBaseStyle} uppercase`}>
                    {run.partDescription}
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
                    className={`${isExpanded ? "bg-surface-active/60 " : ""} border-b border-white/20 animate-fadeIn`}
                >
                    <td colSpan={8} className="pt-3">
                        <div className="grid grid-cols-9 gap-3 mb-4 mx-4">
                            <div className={`${cardBaseStyle} `}>
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
                            <div
                                className={`rounded-lg flex flex-col py-1 gap-2 order-first`}
                            >
                                <button
                                    onClick={() =>
                                        setShowEditRunModal((prev) => !prev)
                                    }
                                    className="flex flex-1 items-center gap-2 rounded-md transition-all font-medium justify-center px-2 py-1.5 duration-200 cursor-pointer text-sm border text-text-secondary bg-text-secondary/10 hover:bg-text-secondary/20"
                                >
                                    <GoPencil />
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteRun.mutate(run.id)}
                                    className="flex flex-1 items-center gap-2 rounded-md transition-all font-medium justify-center px-2 py-1.5 duration-200 cursor-pointer text-sm border text-red-400 bg-red-500/10 hover:bg-red-500/20"
                                >
                                    <GoTrash />
                                    Delete
                                </button>
                            </div>
                        </div>
                        {showEditRunModal && (
                            <Modal
                                title="Edit Run"
                                onClose={() =>
                                    setShowEditRunModal((prev) => !prev)
                                }
                            >
                                <ProductionEditForm
                                    editRun={editRun}
                                    run={run}
                                    onClose={() =>
                                        setShowEditRunModal((prev) => !prev)
                                    }
                                />
                            </Modal>
                        )}

                        {/* additiona info  */}
                        <div className="text-sm gap-6 flex text-text-muted px-3 py-2">
                            <span className="group">
                                Logged By:{" "}
                                <span className="text-text-secondary relative">
                                    <div className="translate-y-2 translate-x-5 opacity-0 capitalize transition-all duration-200 delay-500 group-hover:opacity-100 text-white group-hover:translate-y-1 px-2 py-2 rounded bg-brand/90 border border-brand absolute">
                                        {run.loggedByRole.split("_").join(" ")}
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
