import { useState } from "react";
import { Button } from "../Button";
import { useAuth } from "../../context/AuthContext";
import { useParts } from "../../hooks/useParts";
import { toast } from "sonner";
import { useProductionRunsMutation } from "../../hooks/useProductionRunsMutation";
import { IoIosClose } from "react-icons/io";

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

interface ProductionRunFormProps {
    onClose: () => void;
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

const labelBaseStyle = "block text-sm mb-1.5";
const inputeBaseStyle =
    "w-full rounded outline-none bg-neutral-950  px-2 py-2 border border-white/10 focus:border-brand transition-colors duration-200 text-sm text-text-secondary ";

export const ProductionRunForm = ({ onClose }: ProductionRunFormProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<
        Partial<Record<keyof ProductionFormData, string>>
    >({});
    const [form, setForm] = useState<ProductionFormData>(initialForm);

    const { user } = useAuth();

    const { parts, loading: partsLoading } = useParts();
    const { saveRun } = useProductionRunsMutation();

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

        saveRun.mutate(
            {
                partNumber: form.partNumber,
                qtyLoaded: form.qtyLoaded ?? 0,
                qtyCoated: form.qtyCoated ?? 0,
                qtyDefects: form.defects ?? 0,
                qtyFallOff: calculatedFallOff,
                runDate: form.date,
                shift: form.shift,
                loggedBy: user.id,
                runTime: form.time,
            },
            {
                onSuccess: () => {
                    toast.success("Production run saved successfully");
                    onClose();
                },
                onError: (saveRunError) => {
                    toast.error("Failed to add run");
                    setError(
                        saveRunError instanceof Error
                            ? saveRunError.message
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
            <form
                className="relative bg-gray-900 border border-neutral-800 md:mx-1 mt-2 mx-auto max-w-3xl p-8 rounded-2xl px-6 overflow-y-auto"
                onSubmit={handleSaveRun}
            >
                <button
                    className="absolute top-4 right-4 rounded-md p-1.5 text-neutral-500 hover:text-neutral-200 hover:bg-white/5 transition-colors duration-150"
                    onClick={onClose}
                >
                    <IoIosClose size={26} />
                </button>
                <h1 className="mb-6 text-primary">Log Production Run</h1>
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
                            className={`w-full ${form.shift !== "morning" ? "text-text-secondary" : "border-[#2a9d8f] bg-[#2a9d8f]/10 text-[#2a9d8f]"} `}
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
                            className={`w-full ${form.shift !== "afternoon" ? "text-text-secondary" : "border-[#e9c46a] bg-[#e9c46a]/10 text-[#e9c46a]"} `}
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
                            className={`w-full ${form.shift !== "midnight" ? "text-text-secondary" : "border-rose-400 bg-rose-400/10 text-rose-400"} `}
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
                                className={`${inputeBaseStyle} uppercase`}
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
                            <label
                                className={`text-emerald-400 ${labelBaseStyle}`}
                            >
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
                            <label className={`${labelBaseStyle} text-red-400`}>
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
                            <label className={`${labelBaseStyle} text-warning`}>
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
                        className="flex-1 border-dashed text-neutral-500 border-white/10 hover:text-neutral-300 hover:border-white/20"
                    >
                        Reset
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        className="flex-2 hover:bg-amber-500"
                        disabled={
                            loading || Object.keys(validationErrors).length > 0
                        }
                    >
                        Save Run
                    </Button>
                </div>
            </form>
        </>
    );
};
