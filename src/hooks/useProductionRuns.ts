import { useCallback, useState } from "react";
import { supabase } from "../lib/supabase-client";

export interface ProductionRun {
    id: number;
    createdAt: string;
    partNumber: string;
    partDescription: string;
    qtyLoaded: number;
    qtyCoated: number;
    qtyDefects: number;
    qtyFallOff: number;
    loggedBy: string;
    shift: "morning" | "afternoon" | "midnight";
    runDate: string;
}

export function useProductionRuns() {
    const [runs, setRuns] = useState<ProductionRun[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRuns = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from("production_runs")
                .select(
                    "*, parts!inner(part_description), profiles!logged_by(full_name)",
                )
                .order("created_at", { ascending: false });

            if (error) throw error;

            setRuns(
                (data ?? []).map((run) => ({
                    id: run.id,
                    createdAt: run.created_at,
                    partNumber: run.part_number,
                    partDescription: run.parts.part_description,
                    qtyLoaded: run.quantity_loaded,
                    qtyCoated: run.quantity_coated,
                    qtyDefects: run.quantity_defects,
                    qtyFallOff: run.quantity_falloff,
                    loggedBy: run.profiles.full_name,
                    shift: run.shift,
                    runDate: run.run_date,
                })),
            );
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Unknown Error");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    return { runs, loading, error, fetchRuns };
}
