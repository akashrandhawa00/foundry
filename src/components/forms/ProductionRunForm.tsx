import { useState } from "react";
import { Button } from "../Button";
import { supabase } from "../../lib/supabase-client";
import { useAuth } from "../../context/AuthContext";

export interface ProductionFormData {
    date: string;
    time: string;
    shift: "morning" | "afternoon" | "midnight";
    partNumber: string;
    description: string;
    qtyLoaded: number;
    qtyCoated: number;
    defects: number;
    fallOff: number;
}

const now = new Date();

const initialForm: ProductionFormData = {
    date: now.toISOString().split("T")[0],
    time: now.toISOString().slice(0, 5),
    shift: "morning",
    partNumber: "",
    description: "",
    qtyLoaded: 0,
    qtyCoated: 0,
    defects: 0,
    fallOff: 0,
};

// TODO: Make form submitable

export const ProductionRunForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<ProductionFormData>(initialForm);
    const { user } = useAuth();

    console.log("User ID: " + user.id);

    const handleFormCancel = async (event: React.FormEvent) => {
        event.preventDefault();
        return null;
    };

    const handleShiftChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            shift: event.target.value as ProductionFormData["shift"],
        });
    };

    const handleSaveRun = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const { error: saveRunError } = await supabase
            .from("production_runs")
            .insert([
                {
                    part_number: form.partNumber,
                    quantity_loaded: form.qtyLoaded,
                    quantity_coated: form.qtyCoated,
                    quantity_defects: form.defects,
                    quantity_falloff: form.fallOff,
                    run_date: form.date,
                    shift: form.shift,
                    logged_by: user.id,
                },
            ]);

        setLoading(false);

        if (saveRunError) {
            setError(saveRunError.message ?? "Unknown error");
            return;
        }

        setForm(initialForm);
        console.log("Congrats jatta");
    };

    return (
        <form onSubmit={handleSaveRun}>
            <h1>Form</h1>
            <div>
                <label>Date</label>
                <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
                <label>Time</label>
                <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
            </div>
            <div>
                <p>Shift</p>
                <label>Morning</label>
                <input
                    type="radio"
                    name="shiftSelection"
                    value="morning"
                    checked={form.shift === "morning"}
                    onChange={handleShiftChange}
                />
                <label>Afternoon</label>
                <input
                    type="radio"
                    name="shiftSelection"
                    value="afternoon"
                    checked={form.shift === "afternoon"}
                    onChange={handleShiftChange}
                />
                <label>Midnight</label>
                <input
                    type="radio"
                    name="shiftSelection"
                    value="midnight"
                    checked={form.shift === "midnight"}
                    onChange={handleShiftChange}
                />
            </div>
            <div>
                <div>
                    <label>Part Number</label>
                    <input
                        type="text"
                        name="partNumber"
                        value={form.partNumber}
                        onChange={(e) =>
                            setForm({ ...form, partNumber: e.target.value })
                        }
                    />
                    <label>Description</label>
                    <input
                        type="text"
                        name="description"
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                    />
                </div>
                <div>
                    <label>Qty Loaded</label>
                    <input
                        type="number"
                        name="qtyLoaded"
                        value={form.qtyLoaded}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                qtyLoaded: Number(e.target.value),
                            })
                        }
                    />
                    <label>Coated</label>
                    <input
                        type="number"
                        name="qtyCoated"
                        value={form.qtyCoated}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                qtyCoated: Number(e.target.value),
                            })
                        }
                    />
                    <label>Defects</label>
                    <input
                        type="number"
                        name="qtyDefects"
                        value={form.defects}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                defects: Number(e.target.value),
                            })
                        }
                    />
                    <label>Fall-off</label>
                    <input
                        type="number"
                        name="qtyFallOff"
                        value={form.fallOff}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                fallOff: Number(e.target.value),
                            })
                        }
                    />
                </div>
                <div>
                    <Button onClick={handleFormCancel}>Cancel</Button>
                    <Button type="submit">Save Run</Button>
                </div>
            </div>
        </form>
    );
};
