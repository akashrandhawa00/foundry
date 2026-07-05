import { Button } from "../Button";
import { useState } from "react";
import { ProductionRunForm } from "../forms/ProductionRunForm";
import { Modal } from "./Modal";
import type { ProductionRun } from "../../hooks/useProductionRuns";
import type { Part } from "../../hooks/useParts";
import { PartAddForm } from "../forms/PartAddForm";

interface Props {
    filterButton?: boolean;
    addRunButton?: boolean;
    addPartButton?: boolean;
    title: string;
    runs?: ProductionRun[];
    parts?: Part[];
    classes?: string;
    showTagline?: boolean;
}

export default function PageHeader({
    parts,
    runs,
    filterButton,
    addRunButton,
    addPartButton,
    title,
    classes,
    showTagline = true,
}: Props) {
    const [showRunModal, setShowRunModal] = useState<boolean>(false);
    const [showPartModal, setShowPartModal] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const totalRuns = runs?.length || parts?.length;

    return (
        <>
            <div id="production-log-header" className="flex justify-between">
                <div>
                    <h1 className={`md:text-xl ${classes}`}>{title}</h1>
                    {showTagline && (
                        <div className="text-xs md:text-sm text-text-label">
                            {totalRuns} entries total
                        </div>
                    )}
                </div>

                <div className="flex gap-2 items-center">
                    {filterButton && (
                        <Button
                            className="text-xs md:text-base"
                            onClick={() => setShowFilters((prev) => !prev)}
                        >
                            {showFilters ? "Hide Filters" : "Show Filters"}
                        </Button>
                    )}
                    {addPartButton && (
                        <Button
                            variant="default"
                            onClick={() => setShowPartModal((prev) => !prev)}
                        >
                            + Add Part
                        </Button>
                    )}
                    {addRunButton && (
                        <Button
                            className=""
                            variant="primary"
                            onClick={() => setShowRunModal((prev) => !prev)}
                        >
                            + Log Run
                        </Button>
                    )}
                </div>
            </div>
            {showRunModal && (
                <Modal
                    title="test-modal"
                    onClose={() => setShowRunModal(false)}
                >
                    <ProductionRunForm onClose={() => setShowRunModal(false)} />
                </Modal>
            )}
            {showPartModal && (
                <Modal
                    title="test-modal"
                    onClose={() => setShowPartModal(false)}
                >
                    <PartAddForm onClose={() => setShowPartModal(false)} />
                </Modal>
            )}
            <div
                className={`${showFilters ? "block" : "hidden"} flex justify-end mt-2 gap-2`}
            >
                <Button>filter 1</Button>
                <div>
                    <label>From</label>
                    <input type="date" />
                </div>
                <div>
                    <label>to</label>
                    <input type="date" />
                </div>
                <Button>filter 2</Button>
                <Button>filter 3</Button>
            </div>
        </>
    );
}
