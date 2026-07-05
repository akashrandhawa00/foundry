import { Button } from "../Button";
import { useState } from "react";
import { ProductionRunForm } from "../forms/ProductionRunForm";
import { Modal } from "./Modal";
import type { ProductionRun } from "../../hooks/useProductionRuns";
import type { Part } from "../../hooks/useParts";
import { PartAddForm } from "../forms/PartAddForm";

interface Props {
    showFilterButton?: boolean;
    showAddRunButton?: boolean;
    showAddPartButton?: boolean;
    title: string;
    runs?: ProductionRun[];
    parts?: Part[];
    classes?: string;
    showTagline?: boolean;
    description?: string;
}

export default function PageHeader({
    parts,
    runs,
    showFilterButton: filterButton,
    showAddRunButton: addRunButton,
    showAddPartButton: addPartButton,
    title,
    classes,
    showTagline = true,
    description,
}: Props) {
    const [showRunModal, setShowRunModal] = useState<boolean>(false);
    const [showPartModal, setShowPartModal] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const totalRuns = runs?.length || parts?.length;

    return (
        <>
            <div id="production-log-header" className="flex justify-between">
                <div>
                    <h1
                        className={`text-lg md:text-2xl text-primary ${classes}`}
                    >
                        {title}
                    </h1>
                    <div className="text-sm md:text-base mb-2 text-neutral-500">
                        {description}
                    </div>
                    {showTagline && (
                        <div className="text-xs md:text-sm text-text-muted">
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
                    title="Production Run Modal"
                    onClose={() => setShowRunModal(false)}
                >
                    <ProductionRunForm onClose={() => setShowRunModal(false)} />
                </Modal>
            )}
            {showPartModal && (
                <Modal
                    title="Part Add Modal"
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
