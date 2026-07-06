import { useState } from "react";
import { Button } from "../Button";
import { supabase } from "../../lib/supabase-client";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import type { Part } from "../../hooks/useParts";

export interface PartFormData {
    partNumber: string;
    description: string;
    client: string;
    rackType: string;
    qtyPerBin: number;
    repackBin: string;
}

interface PartAddFormProps {
    onClose: () => void;
}

const initialForm: Part = {
    partNumber: "",
    description: "",
    client: "",
    incomingQtyPerBin: 0,
    outgoingQtyPerBin: 0,
    rackName: "",
    partsPerRack: 0,
    reqRacksPerBin: 0,
    substrate: "",
    repackBinType: "",
    annualVolume: 0,
    oem: "",
    oemPartNumber: "",
    programName: "",
};

const labelBaseStyle = "block uppercase text-sm mb-1";
const inputeBaseStyle =
    "w-full rounded outline-none bg-neutral-950 uppercase mb-3 px-2 py-2 border border-white/20 font-mono focus:border-amber-500 transition-colors duration-200 text-sm text-text-secondary ";
const optionalTagStyle = "lowercase text-text-muted text-xs";

const OptionalTag = () => {
    return <span className={optionalTagStyle}> (opt)</span>;
};

export const PartAddForm = ({ onClose }: PartAddFormProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<
        Partial<Record<keyof PartFormData, string>>
    >({});
    const [form, setForm] = useState<Part>(initialForm);
    const { user } = useAuth();

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

    const handlePartAdd = async (event: React.SubmitEvent) => {
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
                        incoming_bin_quantity: form.incomingQtyPerBin,
                        total_parts_per_packaging_bin: form.outgoingQtyPerBin,
                        rack_name: form.rackName,
                        estimated_parts_per_rack: form.partsPerRack,
                        required_rack_per_bin: form.reqRacksPerBin,
                        substrate: form.substrate,
                        repack_bin: form.repackBinType,
                        annual_volume: form.annualVolume,
                        oem: form.oem,
                        oem_part_number: form.oemPartNumber,
                        program_name: form.programName,
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
            onClose();
            toast.success("Part added successfully");
        }
    };

    return (
        <>
            <h1 className="mb-6 text-primary">Add Part</h1>
            <form onSubmit={handlePartAdd} className="max-h-dvh">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className={`${labelBaseStyle} text-text-label`}>
                            Part Number
                        </label>
                        <input
                            placeholder="EC-0000"
                            type="text"
                            name="partNumber"
                            value={form.partNumber}
                            onChange={(e) =>
                                setForm({ ...form, partNumber: e.target.value })
                            }
                            className={`${inputeBaseStyle}`}
                        />
                    </div>
                    <div>
                        <label className={`${labelBaseStyle} text-text-label`}>
                            Client
                        </label>
                        <input
                            type="text"
                            name="partNumber"
                            value={form.client}
                            onChange={(e) =>
                                setForm({ ...form, client: e.target.value })
                            }
                            className={`${inputeBaseStyle}`}
                        />
                    </div>
                </div>
                <div>
                    <label className={`${labelBaseStyle} text-text-label`}>
                        Description
                    </label>
                    <input
                        type="text"
                        name="description"
                        value={form.description}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                description: e.target.value,
                            })
                        }
                        className={`${inputeBaseStyle}`}
                    />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border-b-2 border-white/10 mb-4 pb-2">
                    <div className="col-span-2 md:col-span-1">
                        <label className={`${labelBaseStyle} text-text-label`}>
                            Rack Name
                        </label>
                        <input
                            type="text"
                            name="rackName"
                            value={form.rackName}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    rackName: e.target.value,
                                })
                            }
                            className={`${inputeBaseStyle}`}
                        />
                    </div>
                    <div>
                        <label className={`${labelBaseStyle} text-text-label`}>
                            Parts per rack
                            <OptionalTag />
                        </label>
                        <input
                            type="number"
                            name="partsPerRack"
                            placeholder="0"
                            value={form.partsPerRack}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    partsPerRack: Number(e.target.value),
                                })
                            }
                            className={`${inputeBaseStyle}`}
                        />
                    </div>
                    <div>
                        <label className={`${labelBaseStyle} text-text-label`}>
                            Racks per bin
                            <OptionalTag />
                        </label>
                        <input
                            type="number"
                            step={0.1}
                            name="partsPerRack"
                            placeholder="0"
                            value={form.reqRacksPerBin}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    reqRacksPerBin: Number(e.target.value),
                                })
                            }
                            className={`${inputeBaseStyle}`}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-7 mb-4 pb-2 border-b-2 border-white/10 gap-2">
                    <div className="col-span-2 md:col-span-3 ">
                        <label className={`${labelBaseStyle} text-text-label`}>
                            Repack Bin
                        </label>
                        <input
                            type="text"
                            name="repackBin"
                            placeholder="Leave blank if not applicable"
                            value={form.repackBinType}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    repackBinType: e.target.value,
                                })
                            }
                            className={`${inputeBaseStyle}`}
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <label className={`${labelBaseStyle} text-text-label`}>
                            Incoming qty per bin
                            <OptionalTag />
                        </label>
                        <input
                            type="number"
                            name="incomingQtyPerBin"
                            placeholder="0"
                            value={form.incomingQtyPerBin}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    incomingQtyPerBin: Number(e.target.value),
                                })
                            }
                            className={`${inputeBaseStyle}`}
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <label className={`${labelBaseStyle} text-text-label`}>
                            Outgoing qty per bin
                            <OptionalTag />
                        </label>
                        <input
                            type="number"
                            name="outgoingQtyPerBin"
                            placeholder="0"
                            value={form.outgoingQtyPerBin}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    outgoingQtyPerBin: Number(e.target.value),
                                })
                            }
                            className={`${inputeBaseStyle}`}
                        />
                    </div>
                </div>

                {/* OEM Section */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div>
                        <label className={`${labelBaseStyle} text-text-label`}>
                            OEM
                        </label>
                        <input
                            type="text"
                            name="oem"
                            value={form.oem}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    oem: e.target.value,
                                })
                            }
                            className={`${inputeBaseStyle}`}
                        />
                    </div>
                    <div>
                        <label className={`${labelBaseStyle} text-text-label`}>
                            OEM Part Number
                            <OptionalTag />
                        </label>
                        <input
                            type="text"
                            name="oemPartNumber"
                            value={form.oemPartNumber}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    oemPartNumber: e.target.value,
                                })
                            }
                            className={`${inputeBaseStyle}`}
                        />
                    </div>
                    <div className="col-span-2 grid grid-cols-6 gap-2 justify-center">
                        <div className="col-span-6 md:col-span-2">
                            <label
                                className={`${labelBaseStyle} text-text-label`}
                            >
                                Program Name
                                <OptionalTag />
                            </label>
                            <input
                                type="text"
                                name="programName"
                                value={form.programName}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        programName: e.target.value,
                                    })
                                }
                                className={`${inputeBaseStyle}`}
                            />
                        </div>
                        <div className="md:col-span-2 col-span-3">
                            <label
                                className={`${labelBaseStyle} text-text-label`}
                            >
                                Annual Vol.
                                <OptionalTag />
                            </label>
                            <input
                                type="number"
                                name="annualVolume"
                                value={form.annualVolume}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        annualVolume: Number(e.target.value),
                                    })
                                }
                                className={`${inputeBaseStyle}`}
                            />
                        </div>
                        <div className="md:col-span-2 col-span-3">
                            <label
                                className={`${labelBaseStyle} text-text-label`}
                            >
                                Substrate
                                <OptionalTag />
                            </label>
                            <input
                                type="text"
                                name="substrate"
                                value={form.substrate}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        substrate: e.target.value,
                                    })
                                }
                                className={`${inputeBaseStyle}`}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col-reverse md:flex-row gap-2">
                    <Button
                        type="button"
                        onClick={() => handleFormReset()}
                        className="flex-1"
                    >
                        Reset
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        className="flex-2 hover:bg-amber-500"
                    >
                        {loading ? "Adding..." : "Add Part"}
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
