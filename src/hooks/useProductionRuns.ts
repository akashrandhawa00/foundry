import { supabase } from "../lib/supabase-client";
import { useQuery } from "@tanstack/react-query";

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

function productionRunsQueryKey(range?: { from?: string; to?: string }) {
    return ["production-runs", range?.from, range?.to] as const;
}

async function fetchProductionRuns(range?: { from?: string; to?: string }) {
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

    return (data ?? []).map((run): ProductionRun => ({
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
    }));
}

export function useProductionRuns(range?: { from?: string; to?: string }) {
    const query = useQuery({
        queryKey: productionRunsQueryKey(range),
        queryFn: () => fetchProductionRuns(range),
    });

    return {
        runs: query.data ?? [],
        loading: query.isLoading,
        error: query.error instanceof Error,
    };
}
