import { useEffect, useState } from "react";
import { Button } from "../Button";
import { supabase } from "../../lib/supabase-client";
import { useAuth } from "../../context/AuthContext";
import { useParts } from "../../hooks/useParts";

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

const now = new Date();

const initialForm: ProductionFormData = {
    date: now.toISOString().split("T")[0],
    time: now.toTimeString().slice(0, 5),
    shift: "morning",
    partNumber: "",
    description: "",
    qtyLoaded: null,
    qtyCoated: null,
    defects: null,
    fallOff: null,
};

const labelBaseStyle = "block uppercase text-sm mb-1";
const inputeBaseStyle =
    "w-full rounded outline-none bg-neutral-900 uppercase px-2 py-2 border border-white/20 font-mono focus:border-amber-500 transition-colors duration-200 text-sm text-text-secondary ";

export const ProductionRunForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<
        Partial<Record<keyof ProductionFormData, string>>
    >({});
    const [form, setForm] = useState<ProductionFormData>(initialForm);

    const { user } = useAuth();

    //grab parts from supabase to diplay available parts number and description-----------
    const { parts, loading: partsLoading, fetchParts } = useParts();

    useEffect(() => {
        fetchParts();
    }, [fetchParts]);

    const handlePartSelectionChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        const selectedPartNumber = event.target.value;
        const selectedPart = parts.find(
            (part) => part.partNumber === selectedPartNumber,
        );

        console.log("selected value:", selectedPartNumber);
        console.log("parts array:", parts);
        console.log("matched part:", selectedPart);

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
        if (!form.shift) newErrors.shift = "Please select a shift.";
        if (!form.partNumber) newErrors.partNumber = "Please select a part.";
        if (qtyLoaded <= 0) newErrors.qtyLoaded = "Must be more than 0.";
        if (qtyCoated > qtyLoaded)
            newErrors.qtyCoated = "Cannot exceed Quantity Loaded";
        if (defects < 0) newErrors.defects = "Cannot be negative.";
        if (fallOff < 0) newErrors.fallOff = "Cannot be negative.";

        const totalOut =
            (form.qtyCoated ?? 0) + (form.defects ?? 0) + (form.fallOff ?? 0);
        if (totalOut > qtyLoaded) {
            newErrors.qtyCoated =
                "Coated + defects + falloff exceed the load quantity.";
        }

        setValidationErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormReset = () => {
        setForm(initialForm);
        setValidationErrors({});
    };

    const handleSaveRun = async (event: React.SubmitEvent) => {
        event.preventDefault();

        setError(null);
        setValidationErrors({});
        if (!user) {
            setError("You must be logged in");
            return;
        }

        if (!validateForm()) return;

        const calculatedFallOff =
            (form.qtyLoaded ?? 0) - (form.qtyCoated ?? 0) - (form.defects ?? 0);

        setLoading(true);

        try {
            const { error: saveRunError } = await supabase
                .from("production_runs")
                .insert([
                    {
                        part_number: form.partNumber,
                        quantity_loaded: form.qtyLoaded,
                        quantity_coated: form.qtyCoated,
                        quantity_defects: form.defects,
                        quantity_falloff: calculatedFallOff,
                        run_date: form.date,
                        shift: form.shift,
                        logged_by: user.id,
                    },
                ]);

            if (saveRunError) {
                throw saveRunError;
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Unknown error");
            }
        } finally {
            setLoading(false);
            setForm(initialForm);
        }
    };

    const fallOffQuantity =
        (form.qtyLoaded ?? 0) - (form.qtyCoated ?? 0) - (form.defects ?? 0);

    return (
        <>
            <form onSubmit={handleSaveRun}>
                <h1 className="mb-6 text-primary">Log Production Run</h1>
                <div className="grid grid-cols-2 gap-2.5 mb-6">
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
                <div className="mb-6">
                    <label className={`${labelBaseStyle} text-text-label`}>
                        Shift
                    </label>
                    <div className="flex gap-2.5">
                        <Button
                            type="button"
                            className="w-full"
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
                            className="w-full"
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
                            className="w-full"
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

                <div className="rounded-md mb-6 bg-surface px-4 py-6">
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
                                className={`${inputeBaseStyle}`}
                            />
                        </div>
                    </div>

                    {/* quantities input in a grid */}
                    <div className="grid grid-cols-4 gap-2.5 ">
                        <div>
                            <label
                                className={`${labelBaseStyle} text-text-label`}
                            >
                                Qty Loaded
                            </label>
                            <input
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
                            <label className={`${labelBaseStyle} text-danger`}>
                                Defects
                            </label>
                            <input
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
                <div className="flex gap-2.5">
                    <Button
                        variant="destructive"
                        type="button"
                        onClick={() => handleFormReset()}
                        className="flex-1"
                    >
                        Reset
                    </Button>
                    <Button
                        type="submit"
                        className="flex-2 hover:bg-amber-500"
                        disabled={
                            loading || Object.keys(validationErrors).length > 0
                        }
                    >
                        Save Run
                    </Button>
                </div>
                <div className="pt-2">
                    {Object.keys(validationErrors).length > 0 && (
                        <ul>
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
                        // <span className="text-sm text-red-300">
                        //     {validationErrors}
                        // </span>
                    )}
                    {error && (
                        <p className="text-red-400">
                            An error occured: {error}
                        </p>
                    )}
                </div>
            </form>
        </>
    );
};
