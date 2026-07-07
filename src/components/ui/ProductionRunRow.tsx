import { useProductionRunsMutation } from "../../hooks/useProductionRunsMutation";
import { useState } from "react";
import { Modal } from "./Modal";
import { ProductionEditForm } from "../forms/ProductionEditForm";
import type { ProductionRun } from "../../hooks/useProductionRuns";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import DeleteConfirmation from "./DeleteConfirmation";
import { FaPen, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { shiftStyles } from "./Styles";

//styles-----------
const tdBaseStyle = "px-3 py-3 text-sm";
const cardBaseStyle =
    "rounded-lg px-4 py-3 border border-white/15 bg-gray-900 hover:scale-105 hover:border-white/20 transition-all duration-200";
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { editRun, deleteRun } = useProductionRunsMutation();
    const { profile } = useAuth();

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

    const canEditRun =
        ["supervisor", "admin"].includes(profile?.role ?? "") ||
        run.loggedById === profile?.id;

    return (
        <>
            <tr
                onClick={() => setIsExpanded((prev) => !prev)}
                className={`${isExpanded ? "bg-surface-active/60 " : "hover:bg-brand/40"}  cursor-pointer transition-colors duration-200 border-t  ${run.loggedById === profile?.id ? "border-l-4 border-purple-500/70 border-t-surface-active " : "border-surface-active border-l-4 border-l-transparent"}`}
            >
                <td className={`${tdBaseStyle}`}>{runDate}</td>
                <td className={`${tdBaseStyle} uppercase`}>{run.partNumber}</td>
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
                    className={`${tdBaseStyle} ${totalLoss > 0 ? "font-bold text-red-400" : ""}`}
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
                        <div className="grid grid-cols-4 gap-3 mb-4 mx-4">
                            <div className={`${cardBaseStyle} `}>
                                <p className={cardHeadingStyle}>Yield Rate</p>
                                <p
                                    className={`${yeildRate(run) > 97 ? "text-emerald-400" : "text-warning"}`}
                                >
                                    {yeildRate(run)}%
                                </p>
                            </div>
                            <div className={`${cardBaseStyle}`}>
                                <p className={cardHeadingStyle}>Defects</p>
                                <p
                                    className={`${run.qtyDefects > 0 ? "text-red-400" : ""}`}
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
                                    className={`${run.qtyDefects + run.qtyFallOff > 0 ? "text-red-400" : ""}`}
                                >
                                    {totalLoss}
                                </p>
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

                        {/* delete confirmation */}
                        {showDeleteModal && (
                            <Modal
                                title=""
                                onClose={() => setShowDeleteModal(false)}
                                showCloseButton={false}
                            >
                                {
                                    <DeleteConfirmation
                                        itemName="this run"
                                        onClose={() =>
                                            setShowDeleteModal(false)
                                        }
                                        onDelete={() =>
                                            deleteRun.mutate(run.id, {
                                                onSuccess: () => {
                                                    toast.success(
                                                        "Production run deleted successfully",
                                                        {
                                                            icon: <FaTrash />,
                                                        },
                                                    );
                                                },
                                                onError: (deleteError) => {
                                                    toast.error(
                                                        "Failed to delete run",
                                                    );
                                                    console.error(deleteError);
                                                },
                                            })
                                        }
                                    />
                                }
                            </Modal>
                        )}

                        {/* additiona info  */}
                        <div className="text-sm md:flex flex flex-col-reverse gap-3 md:flex-row justify-between md:items-center text-text-muted px-4 pb-2">
                            <div className="flex gap-5">
                                <span className="group">
                                    Logged By:{" "}
                                    <span className="text-text-secondary relative">
                                        <div className="translate-y-2 translate-x-5 opacity-0 capitalize transition-all duration-200 delay-500 group-hover:opacity-100 text-white group-hover:translate-y-1 px-2 py-2 rounded bg-brand/90 border border-brand absolute">
                                            {run.loggedByRole
                                                .split("_")
                                                .join(" ")}
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
                            {/* actions column */}

                            <div className="flex flex-row gap-2">
                                {canEditRun && (
                                    <>
                                        <button
                                            onClick={() =>
                                                setShowEditRunModal(
                                                    (prev) => !prev,
                                                )
                                            }
                                            className="  w-24 inline-flex  py-2 px-3  items-center gap-2 rounded-md transition-colors text-text-secondary bg-gray-900 justify-center duration-200 cursor-pointer text-sm border border-white/20 hover:border-white/40 hover:text-neutral-300 hover:bg-neutral-500/20 "
                                        >
                                            <FaPen />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                setShowDeleteModal(true)
                                            }
                                            className="  w-26 inline-flex  py-2 px-3 items-center gap-2 rounded-md transition-colors text-text-secondary bg-gray-900 justify-center duration-200 cursor-pointer text-sm border border-white/20 hover:border-red-500/40 hover:text-red-300 hover:bg-red-500/20 "
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};
