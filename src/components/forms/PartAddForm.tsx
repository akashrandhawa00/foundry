import { useState } from "react";
import { Button } from "../Button";
import { supabase } from "../../lib/supabase-client";
import { useAuth } from "../../context/AuthContext";

export interface PartFormData {
    partNumber: string;
    description: string;
    client: string;
    rackType: string;
    qtyPerBin: number;
    repackBin: string;
}

const initialForm: PartFormData = {
    partNumber: "",
    description: "",
    client: "",
    rackType: "",
    qtyPerBin: 0,
    repackBin: "",
};

const labelBaseStyle = "block uppercase text-sm mb-1";
const inputeBaseStyle =
    "w-full rounded outline-none bg-neutral-900 uppercase px-2 py-2 border border-white/20 font-mono focus:border-amber-500 transition-colors duration-200 text-sm text-text-secondary ";

export const PartAddForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<
        Partial<Record<keyof PartFormData, string>>
    >({});
    const [form, setForm] = useState<PartFormData>(initialForm);

    const { user } = useAuth();

    //grab parts from supabase to diplay available parts number and description-----------
    // const { parts, loading: partsLoading, fetchParts } = useParts();

    // useEffect(() => {
    //     fetchParts();
    // }, [fetchParts]);

    // form validation and submission
    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof PartFormData, string>> = {};

        if (!form.partNumber) newErrors.partNumber = "Part number is required.";
        if (!form.description)
            newErrors.description = "Part description is required.";

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

        setLoading(true);

        try {
            const { error: saveRunError } = await supabase
                .from("parts")
                .insert([
                    {
                        part_number: form.partNumber,
                        part_description: form.description,
                        client: form.client,
                        rack_type: form.rackType,
                        quantity_per_bin: form.qtyPerBin,
                        repack_bin: form.repackBin,
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

    return (
        <>
            <form onSubmit={handleSaveRun}>
                <h1 className="mb-6 text-text">Log Production Run</h1>
                <div className="grid grid-cols-2 gap-2.5 mb-6">
                    <div>
                        <label className={`${labelBaseStyle} text-text-label`}>
                            Part Number
                        </label>
                        <input
                            type="text"
                            name="partNumber"
                            value={form.partNumber}
                            onChange={(e) =>
                                setForm({ ...form, partNumber: e.target.value })
                            }
                            className={`${inputeBaseStyle}`}
                        />
                        <label className={`${labelBaseStyle} text-text-label`}>
                            Description
                        </label>
                        <input
                            type="text"
                            name="description"
                            placeholder="Part Description"
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                            className={`${inputeBaseStyle}`}
                        />
                        <label className={`${labelBaseStyle} text-text-label`}>
                            Client
                        </label>
                        <input
                            type="text"
                            name="client"
                            placeholder="Client Name"
                            value={form.client}
                            onChange={(e) =>
                                setForm({ ...form, client: e.target.value })
                            }
                            className={`${inputeBaseStyle}`}
                        />
                        <label className={`${labelBaseStyle} text-text-label`}>
                            Rack Type
                        </label>
                        <input
                            type="text"
                            name="rackType"
                            placeholder="Rack Type"
                            value={form.rackType}
                            onChange={(e) =>
                                setForm({ ...form, rackType: e.target.value })
                            }
                            className={`${inputeBaseStyle}`}
                        />
                        <label className={`${labelBaseStyle} text-text-label`}>
                            Qty per bin
                        </label>
                        <input
                            type="number"
                            name="qtyPerBin"
                            placeholder="0"
                            value={form.qtyPerBin}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    qtyPerBin: Number(e.target.value),
                                })
                            }
                            className={`${inputeBaseStyle}`}
                        />
                        <label className={`${labelBaseStyle} text-text-label`}>
                            Ra
                        </label>
                        <input
                            type="text"
                            name="repackBin"
                            placeholder="Repack Bin"
                            value={form.repackBin}
                            onChange={(e) =>
                                setForm({ ...form, repackBin: e.target.value })
                            }
                            className={`${inputeBaseStyle}`}
                        />
                    </div>
                </div>

                {/* quantities input in a grid */}
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
