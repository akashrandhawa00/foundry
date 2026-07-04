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
    loggedByRole: string;
    shift: "morning" | "afternoon" | "midnight";
    runDate: string;
    runTime: string;
}

export function useProductionRuns(range?: { from?: string; to?: string }) {
    const [runs, setRuns] = useState<ProductionRun[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteRun = useCallback(async (runId: number) => {
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase
                .from("production_runs")
                .delete()
                .eq("id", runId);
            console.log("delete req ran");

            if (error) throw error;
        } catch (err: unknown) {
            console.log("del req err");
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Unknown Error");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const editRun = useCallback(
        async (
            runId: number,
            updates: Partial<{
                partNumber: string;
                qtyLoaded: number;
                qtyCoated: number;
                qtyDefect: number;
                qtyFallOff: number;
                shift: ProductionRun["shift"];
                runDate: string;
            }>,
        ) => {
            setLoading(true);
            setError(null);

            try {
                const { data, error } = await supabase
                    .from("production_runs")
                    .update({
                        part_number: updates.partNumber,
                        quantity_loaded: updates.qtyLoaded,
                        quantity_coated: updates.qtyCoated,
                        quantity_defects: updates.qtyDefect,
                        quantity_falloff: updates.qtyFallOff,
                        shift: updates.shift,
                        run_date: updates.runDate,
                    })
                    .eq("id", runId)
                    .select()
                    .single();

                if (error) throw error;

                setRuns((prev) =>
                    prev.map((run) =>
                        run.id === runId ? { ...run, ...updates } : run,
                    ),
                );

                return data;
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Unknown Error");
                }
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const fetchRuns = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            let query = supabase
                .from("production_runs")
                .select(
                    "*, parts!inner(part_description), profiles(full_name, role)", // swithc profile!inner to profiles to allow material handlers to see runs logged by other
                )
                .order("run_date", { ascending: false })
                .order("created_at", { ascending: false });

            if (range?.from) query = query.gte("run_date", range.from);
            if (range?.to) query = query.lte("run_date", range.to);

            const { data, error } = await query;
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
                    loggedBy: run.profiles?.full_name ?? "Unknown",
                    loggedByRole: run.profiles?.role ?? "Unknown",
                    shift: run.shift,
                    runDate: run.run_date,
                    runTime: run.run_time,
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
    }, [range?.from, range?.to]);

    return { runs, loading, error, deleteRun, editRun, fetchRuns };
}
