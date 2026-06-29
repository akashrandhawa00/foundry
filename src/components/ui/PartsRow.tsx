import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import type { Part } from "../../hooks/useParts";

const tdBaseStyle = "px-3 py-3 text-sm";
const cardBaseStyle = "rounded-lg px-4 py-3 border border-white/20 bg-surface";
const cardHeadingStyle =
    "mb-1 tracking-wide uppercase text-xs text-text-secondary";

export const PartsRow = ({ part }: { part: Part }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    // const [showRole, setShowRole] = useState(false);

    // const createdAt = new Date(run.createdAt).toLocaleString("en-CA", {
    //     dateStyle: "medium",
    //     timeStyle: "short",
    // });

    return (
        <>
            <tr
                onClick={() => setIsExpanded((prev) => !prev)}
                className={`${isExpanded ? "bg-surface-active/60 hover:bg-surface-active" : "hover:bg-brand/40"}  cursor-pointer transition-colors duration-200 border-t border-surface-active `}
            >
                <td className={`${tdBaseStyle}`}>{part.partNumber}</td>
                <td className={`${tdBaseStyle} uppercase`}>
                    {part.description}
                </td>
                <td className={`${tdBaseStyle}`}>{part.client ?? "-"}</td>
                {/* <td */}
                {/*     className={`${tdBaseStyle} ${part.qtyPerBin ? "" : "text-text-muted justify-center"}`} */}
                {/* > */}
                {/*     {part.qtyPerBin ?? "-"} */}
                {/* </td> */}
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
                                <p className={cardHeadingStyle}>-</p>
                                <p>{}</p>
                            </div>
                            <div className={`${cardBaseStyle}`}>
                                <p className={cardHeadingStyle}>Rack Type</p>
                                <p>{part.rackType ?? "-"}</p>
                            </div>
                            <div className={`${cardBaseStyle}`}>
                                <p className={cardHeadingStyle}>Repack Bin</p>
                                <p>{part.repackBinType}</p>
                            </div>
                            <div className={`${cardBaseStyle}`}>
                                <p className={cardHeadingStyle}>
                                    Quantity Per Bin
                                </p>
                                <p>{part.qtyPerBin}</p>
                            </div>
                        </div>

                        {/* additiona info */}
                        {/* <div className="text-sm gap-6 flex text-text-muted px-3 py-2"> */}
                        {/*     <span className="group"> */}
                        {/*         Logged By:{" "} */}
                        {/*         <span */}
                        {/*             className="text-text-secondary relative" */}
                        {/*             onClick={() => setShowRole((prev) => !prev)} */}
                        {/*         > */}
                        {/*             {run.loggedBy} */}
                        {/*             {showRole && ( */}
                        {/*                 <div className="translate-y-2 translate-x-5 opacity-0 transition-all duration-200 delay-500 group-hover:opacity-100 text-white group-hover:translate-y-1 px-2 py-2 rounded bg-brand/90 border border-brand absolute"> */}
                        {/*                     Supervisor */}
                        {/*                 </div> */}
                        {/*             )} */}
                        {/*         </span> */}
                        {/*     </span> */}
                        {/*     <span> */}
                        {/*         Created:{" "} */}
                        {/*         <span className="text-text-secondary"> */}
                        {/*             {createdAt} */}
                        {/*         </span> */}
                        {/*     </span> */}
                        {/* </div> */}
                    </td>
                </tr>
            )}
        </>
    );
};
