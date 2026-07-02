import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import type { Part } from "../../hooks/useParts";
import { RiMultiImageLine } from "react-icons/ri";

const tdBaseStyle = "px-3 py-3 text-sm";
const cardBaseStyle = "rounded-lg px-4 py-3 border border-white/20 bg-gray-900";
const cardHeadingStyle = "mb-1 tracking-wide uppercase text-xs text-text-muted";
const cardTextSpan = "text-sm text-text-secondary justify-between flex";

export const PartsRow = ({ part }: { part: Part }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            <tr
                onClick={() => setIsExpanded((prev) => !prev)}
                className={`${isExpanded ? "bg-surface-active/60 hover:bg-surface-active" : "hover:bg-brand/40"}  cursor-pointer transition-colors duration-200 border-t border-surface-active `}
            >
                <td className={`${tdBaseStyle} uppercase`}>
                    {part.partNumber}
                </td>
                <td className={`${tdBaseStyle} uppercase`}>
                    {part.description}
                </td>
                <td className={`${tdBaseStyle} uppercase`}>
                    {part.client ?? "-"}
                </td>
                <td className={`${tdBaseStyle} uppercase`}>
                    {part.substrate ?? "-"}
                </td>
                <td>{isExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />}</td>
            </tr>

            {/* expanded row */}
            {isExpanded && (
                <tr
                    className={`${isExpanded ? "bg-surface-active/60 hover:bg-surface-active" : ""} border-b border-white/20 animate-fadeIn`}
                >
                    <td colSpan={8} className="pt-3">
                        {/* <div className="grid grid-cols-4 gap-3 mb-4 mx-4"> */}
                        {/*     <div className={`${cardBaseStyle}`}> */}
                        {/*         <p className={cardHeadingStyle}>-</p> */}
                        {/*         <p>{}</p> */}
                        {/*     </div> */}
                        {/*     <div className={`${cardBaseStyle}`}> */}
                        {/*         <p className={cardHeadingStyle}>Rack</p> */}
                        {/*         <p>{part.rackName ?? "-"}</p> */}
                        {/*     </div> */}
                        {/*     <div className={`${cardBaseStyle}`}> */}
                        {/*         <p className={cardHeadingStyle}>Repack Bin</p> */}
                        {/*         <p>{part.repackBinType}</p> */}
                        {/*     </div> */}
                        {/*     <div className={`${cardBaseStyle}`}> */}
                        {/*         <p className={cardHeadingStyle}> */}
                        {/*             Quantity Per Bin */}
                        {/*         </p> */}
                        {/*         <p>{part.outgoingQtyPerBin}</p> */}
                        {/*     </div> */}
                        {/* </div> */}

                        <div className="grid grid-cols-3 gap-3 mb-4 mx-4">
                            {/* column 1 */}
                            <div
                                className={`${cardBaseStyle} flex flex-col gap-3`}
                            >
                                <div>
                                    <p className={cardHeadingStyle}>
                                        Packing info
                                    </p>
                                    <div
                                        className={`flex justify-between ${cardTextSpan} `}
                                    >
                                        <span>Incoming</span>
                                        <span>
                                            {part.incomingQtyPerBin ?? "-"}
                                        </span>
                                    </div>
                                    <div
                                        className={`flex justify-between ${cardTextSpan} `}
                                    >
                                        <span>Repack</span>
                                        <span>{`${part.repackBinType ?? "Not required"}`}</span>
                                    </div>
                                    <div
                                        className={`flex justify-between ${cardTextSpan} `}
                                    >
                                        <span>Outgoing</span>
                                        <span>
                                            {part.outgoingQtyPerBin ?? "-"}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className={cardHeadingStyle}>Misc.</p>
                                    <div
                                        className={`flex justify-between ${cardTextSpan} `}
                                    >
                                        <span>Substrate</span>
                                        <span className="uppercase">
                                            {part.substrate ?? "-"}
                                        </span>
                                    </div>
                                    <div
                                        className={`flex justify-between ${cardTextSpan} `}
                                    >
                                        <span>Program</span>
                                        <span className="uppercase">
                                            {part.programName ?? "-"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* column 2 */}
                            <div
                                className={`border-none gap-2 bg-transparent p-0 grid grid-rows-2`}
                            >
                                <div className={`${cardBaseStyle}`}>
                                    <p className={cardHeadingStyle}>
                                        Client Info
                                    </p>
                                    <div className={cardTextSpan}>
                                        <span>Client</span>
                                        <span
                                            className={`${cardTextSpan} uppercase`}
                                        >
                                            {part.client}
                                        </span>
                                    </div>
                                    <div className={cardTextSpan}>
                                        <span>Annual Vol.</span>
                                        <span>
                                            {new Intl.NumberFormat().format(
                                                part.annualVolume,
                                            ) ?? "-"}
                                        </span>
                                    </div>
                                </div>
                                <div className={`${cardBaseStyle}`}>
                                    <p className={cardHeadingStyle}>Racking</p>
                                    <div
                                        className={`flex justify-between ${cardTextSpan} `}
                                    >
                                        <span>Rack name</span>
                                        <span>{part.rackName ?? "-"}</span>
                                    </div>
                                    <div
                                        className={`flex justify-between ${cardTextSpan} `}
                                    >
                                        <span>Parts/rack</span>
                                        <span>{`${part.partsPerRack ?? "-"}`}</span>
                                    </div>
                                    <div
                                        className={`flex justify-between ${cardTextSpan} `}
                                    >
                                        <span>Racks/bin</span>
                                        <span>{part.reqRacksPerBin}</span>
                                    </div>
                                </div>
                            </div>

                            {/* column 3 */}
                            <div
                                className={`border-none gap-2 bg-transparent p-0 grid grid-rows-2`}
                            >
                                <div className={cardBaseStyle}>
                                    <p className={cardHeadingStyle}>OEM Info</p>
                                    <div className={cardTextSpan}>
                                        <span>OEM</span>
                                        <span className="uppercase">
                                            {part.oem ?? "-"}
                                        </span>
                                    </div>
                                    <div className={cardTextSpan}>
                                        <span>OEM Part Number</span>
                                        <span>{part.oemPartNumber ?? "-"}</span>
                                    </div>
                                </div>
                                <div className={cardBaseStyle}>
                                    <p className={`${cardHeadingStyle}`}>
                                        Visual
                                    </p>
                                    <div className="flex justify-center items-center h-2/3">
                                        <RiMultiImageLine size={30} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};
