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
}

export default function PageHeader({
    parts,
    runs,
    filterButton,
    addRunButton,
    addPartButton,
    title,
}: Props) {
    const [showRunModal, setShowRunModal] = useState<boolean>(false);
    const [showPartModal, setShowPartModal] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const totalRuns = runs?.length || parts?.length;

    return (
        <>
            <div id="production-log-header" className="flex justify-between">
                <div>
                    <h1 className="md:text-xl">{title}</h1>
                    <div className="text-xs md:text-sm text-text-label">
                        {totalRuns} entries total
                    </div>
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
                {showRunModal && (
                    <Modal
                        title="test-modal"
                        onClose={() => setShowRunModal(false)}
                    >
                        <ProductionRunForm
                            onClose={() => setShowRunModal(false)}
                        />
                    </Modal>
                )}

                {showPartModal && (
                    <Modal
                        title="test-modal"
                        onClose={() => setShowPartModal(false)}
                    >
                        <PartAddForm />
                    </Modal>
                )}
            </div>
            <div
                className={`${showFilters ? "block" : "hidden"} flex justify-end mt-2 gap-2`}
            >
                <Button>filter 1</Button>
                <Button>filter 2</Button>
                <Button>filter 3</Button>
            </div>
        </>
    );
}
