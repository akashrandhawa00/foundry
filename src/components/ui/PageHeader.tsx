import { Button } from "../Button";
import { useState } from "react";
import { ProductionRunForm } from "../forms/ProductionRunForm";
import { Modal } from "./Modal";

export default function PageHeader({ runs, filterButton, addButton, title }) {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const totalRuns = runs.length;

    return (
        <>
            <div id="production-log-header" className="flex justify-between">
                <div>
                    <h1 className="text-xl">{title}</h1>
                    <div className="text-sm text-text-label">
                        {totalRuns} runs total
                    </div>
                </div>

                <div className="flex gap-2 items-center">
                    {filterButton && (
                        <Button onClick={() => setShowFilters((prev) => !prev)}>
                            {showFilters ? "Hide Filters" : "Show Filters"}
                        </Button>
                    )}
                    {addButton && (
                        <Button
                            variant="primary"
                            onClick={() => setShowModal((prev) => !prev)}
                        >
                            + Log Run
                        </Button>
                    )}
                </div>
                {showModal && (
                    <Modal
                        title="test-modal"
                        onClose={() => setShowModal(false)}
                    >
                        <ProductionRunForm />
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
