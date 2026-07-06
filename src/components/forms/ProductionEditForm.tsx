import { useState } from "react";
import { Button } from "../Button";
import { useParts } from "../../hooks/useParts";
import { toast } from "sonner";
import type { ProductionRun } from "../../hooks/useProductionRuns";
import { useProductionRunsMutation } from "../../hooks/useProductionRunsMutation";

export interface ProductionFormData {
    date: string;
    time: string;
    shift: "morning" | "afternoon" | "midnight";
    partNumber: string;
    description: string;
    qtyLoaded: number | null;
    qtyCoated: number | null;
    defects: number | null;
    fallOff: number | null;
}

interface ProductionEditFormProps {
    editRun: ReturnType<typeof useProductionRunsMutation>["editRun"];
    onClose: () => void;
    run: ProductionRun;
}

const labelBaseStyle = "block text-sm mb-1.5";
const inputeBaseStyle =
    "w-full rounded outline-none bg-neutral-950  px-2 py-2 border border-white/10 focus:border-brand transition-colors duration-200 text-sm text-text-secondary ";

export const ProductionEditForm = ({
    editRun,
    onClose,
    run,
}: ProductionEditFormProps) => {
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<
        Partial<Record<keyof ProductionFormData, string>>
    >({});

    const initialForm: ProductionFormData = {
        date: run.runDate,
        time: run.runTime,
        shift: run.shift,
        partNumber: run.partNumber,
        description: run.partDescription,
        qtyLoaded: run.qtyLoaded,
        qtyCoated: run.qtyCoated,
        defects: run.qtyDefects,
        fallOff: run.qtyFallOff,
    };

    const [form, setForm] = useState<ProductionFormData>(initialForm);
    const { parts, loading: partsLoading } = useParts();

    const handlePartSelectionChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        const selectedPartNumber = event.target.value;
        const selectedPart = parts.find(
            (part) => part.partNumber === selectedPartNumber,
        );

        setForm({
            ...form,
            partNumber: selectedPartNumber,
            description: selectedPart?.description ?? "",
        });
    };

    // form validation and submission
    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof ProductionFormData, string>> = {};

        const qtyLoaded = form.qtyLoaded ?? 0;
        const qtyCoated = form.qtyCoated ?? 0;
        const defects = form.defects ?? 0;
        const fallOff = form.fallOff ?? 0;

        if (!form.date) newErrors.date = "Date is required.";
        if (!form.time) newErrors.time = "Time is required.";
        if (!form.partNumber) newErrors.partNumber = "Please select a part.";
        if (qtyLoaded <= 0) newErrors.qtyLoaded = "Must be more than 0.";
        if (qtyCoated > qtyLoaded)
            newErrors.qtyCoated =
                "Parts unloaded cannot exceed quantity loaded.";
        if (defects < 0) newErrors.defects = "Cannot be negative.";
        if (fallOff < 0) newErrors.fallOff = "Cannot be negative.";

        setValidationErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormReset = () => {
        setForm(initialForm);
        setError(null);
        setValidationErrors({});
    };

    const handleEditRun = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setValidationErrors({});

        if (!validateForm()) return;

        const calculatedFallOff =
            (form.qtyLoaded ?? 0) - (form.qtyCoated ?? 0) - (form.defects ?? 0);

        editRun.mutate(
            {
                runId: run.id,
                updates: {
                    partNumber: form.partNumber,
                    qtyLoaded: form.qtyLoaded ?? undefined,
                    qtyCoated: form.qtyCoated ?? undefined,
                    qtyDefects: form.defects ?? undefined,
                    qtyFallOff: calculatedFallOff,
                    runDate: form.date,
                    shift: form.shift,
                    runTime: form.time,
                },
            },
            {
                onSuccess: () => {
                    toast.success("Edit successfully");
                    onClose();
                },
                onError: (editRunError) => {
                    toast.error("Error");
                    setError(
                        editRunError instanceof Error
                            ? editRunError.message
                            : "Unknown error",
                    );
                },
            },
        );
    };

    const fallOffQuantity =
        (form.qtyLoaded ?? 0) - (form.qtyCoated ?? 0) - (form.defects ?? 0);

    return (
        <>
            <form onSubmit={handleEditRun}>
                <h1 className="mb-6 text-primary">Edit Production Run</h1>
                <div className="grid grid-cols-2 gap-2 mb-3 md:mb-6">
                    <div>
                        <label className={`${labelBaseStyle} text-text-label`}>
                            Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={(e) =>
                                setForm({ ...form, date: e.target.value })
                            }
                            className={`${inputeBaseStyle}`}
                        />
                    </div>
                    <div>
                        <label className={`${labelBaseStyle} text-text-label`}>
                            Time
                        </label>
                        <input
                            type="time"
                            name="time"
                            value={form.time}
                            onChange={(e) =>
                                setForm({ ...form, time: e.target.value })
                            }
                            className={`${inputeBaseStyle}`}
                        />
                    </div>
                </div>
                <div className="mb-3 md:mb-6">
                    <label className={`${labelBaseStyle} text-text-label`}>
                        Shift
                    </label>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            className={`w-full ${form.shift !== "morning" ? "text-text-secondary" : ""} `}
                            variant={
                                form.shift === "morning"
                                    ? "shiftActive"
                                    : "default"
                            }
                            onClick={() =>
                                setForm({ ...form, shift: "morning" })
                            }
                        >
                            Morning
                        </Button>
                        <Button
                            type="button"
                            className={`w-full ${form.shift !== "afternoon" ? "text-text-secondary" : ""} `}
                            variant={
                                form.shift === "afternoon"
                                    ? "shiftActive"
                                    : "default"
                            }
                            onClick={() =>
                                setForm({ ...form, shift: "afternoon" })
                            }
                        >
                            Afternoon
                        </Button>
                        <Button
                            type="button"
                            className={`w-full ${form.shift !== "midnight" ? "text-text-secondary" : ""} `}
                            variant={
                                form.shift === "midnight"
                                    ? "shiftActive"
                                    : "default"
                            }
                            onClick={() =>
                                setForm({ ...form, shift: "midnight" })
                            }
                        >
                            Midnight
                        </Button>
                    </div>
                </div>

                <div className="rounded-md mb-6 pb-6">
                    {/* Part num and description displayed side by side */}
                    <div className="grid grid-cols-2 gap-2.5 mb-4">
                        <div>
                            <label
                                className={`${labelBaseStyle} text-text-label`}
                            >
                                Part Number
                            </label>
                            <select
                                name="partNumber"
                                value={form.partNumber}
                                onChange={handlePartSelectionChange}
                                className={`${inputeBaseStyle}`}
                                disabled={partsLoading}
                                required
                            >
                                <option value="">
                                    {partsLoading
                                        ? "Loading..."
                                        : "Select part number..."}
                                </option>
                                {parts.map((part) => (
                                    <option
                                        key={part.partNumber}
                                        value={part.partNumber}
                                    >
                                        {part.partNumber}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label
                                className={`${labelBaseStyle} text-text-label`}
                            >
                                Description
                            </label>
                            <input
                                type="text"
                                name="description"
                                placeholder="Part Description"
                                value={form.description}
                                readOnly
                                className={`${inputeBaseStyle} uppercase`}
                            />
                        </div>
                    </div>

                    {/* quantities input in a grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ">
                        <div>
                            <label
                                className={`${labelBaseStyle} text-text-label`}
                            >
                                Qty Loaded
                            </label>
                            <input
                                inputMode="numeric"
                                type="number"
                                name="qtyLoaded"
                                value={form.qtyLoaded ?? ""}
                                required
                                min={0}
                                placeholder="0"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        qtyLoaded:
                                            e.target.value === ""
                                                ? null
                                                : Number(e.target.value),
                                    })
                                }
                                className={`${inputeBaseStyle}`}
                            />
                        </div>
                        <div>
                            <label className={`text-success ${labelBaseStyle}`}>
                                Coated
                            </label>
                            <input
                                inputMode="numeric"
                                type="number"
                                name="qtyCoated"
                                min={0}
                                placeholder="0"
                                value={form.qtyCoated ?? ""}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        qtyCoated:
                                            e.target.value === ""
                                                ? null
                                                : Number(e.target.value),
                                    })
                                }
                                required
                                className={`${inputeBaseStyle}`}
                            />
                        </div>
                        <div>
                            <label className={`${labelBaseStyle} text-red-500`}>
                                Defects
                            </label>
                            <input
                                inputMode="numeric"
                                type="number"
                                name="qtyDefects"
                                min={0}
                                placeholder="0"
                                value={form.defects ?? ""}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        defects:
                                            e.target.value === ""
                                                ? null
                                                : Number(e.target.value),
                                    })
                                }
                                required
                                className={`${inputeBaseStyle}`}
                            />
                        </div>
                        <div>
                            <label
                                className={`${labelBaseStyle} text-orange-400/80`}
                            >
                                Falloff
                            </label>
                            <input
                                inputMode="numeric"
                                type="number"
                                name="qtyFallOff"
                                placeholder="0"
                                min={0}
                                value={fallOffQuantity}
                                readOnly
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        fallOff:
                                            e.target.value === ""
                                                ? null
                                                : Number(e.target.value),
                                    })
                                }
                                className={`${inputeBaseStyle}`}
                            />
                        </div>
                    </div>
                </div>

                {/* error diplay */}
                {/* <div className="w-full text-red-400 px-2 pb-1 mb-4 flex items-center border-l-2 border-red-400 "> */}
                {Object.keys(validationErrors).length > 0 && (
                    <ul className="w-full text-red-400 px-2 pb-1 mb-4 flex items-center border-l-2 border-red-400 ">
                        {Object.entries(validationErrors).map(
                            ([field, message]) =>
                                message ? (
                                    <li key={field}>
                                        <span className="text-red-400">
                                            {message}
                                        </span>
                                    </li>
                                ) : null,
                        )}
                    </ul>
                )}
                {error && (
                    <p className="text-red-400">An error occured: {error}</p>
                )}
                {/* </div> */}

                <div className="flex flex-col-reverse md:flex-row gap-2">
                    <Button
                        variant="default"
                        type="button"
                        onClick={() => handleFormReset()}
                        className="flex-1 border-dashed text-text-secondary border-text-secondary hover:text-primary hover:border-text-primary"
                    >
                        Reset
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        className="flex-2 hover:bg-amber-500"
                        disabled={
                            editRun.isPending ||
                            Object.keys(validationErrors).length > 0
                        }
                    >
                        Edit Run
                    </Button>
                </div>
            </form>
        </>
    );
};
