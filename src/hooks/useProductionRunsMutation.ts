import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProductionRun } from "./useProductionRuns";
import { supabase } from "../lib/supabase-client";

export interface CreateProductionRunInput {
    partNumber: string;
    qtyLoaded: number;
    qtyCoated: number;
    qtyDefects: number;
    qtyFallOff: number;
    runDate: string;
    runTime: string;
    shift: ProductionRun["shift"];
    loggedBy: string;
}

export type EditProductionRunInput = Partial<{
    partNumber: string;
    qtyLoaded: number;
    qtyCoated: number;
    qtyDefects: number;
    qtyFallOff: number;
    runDate: string;
    runTime: string;
    shift: ProductionRun["shift"];
}>;

export function useProductionRunsMutation() {
    const queryClient = useQueryClient();
    const invalidate = () =>
        queryClient.invalidateQueries({ queryKey: ["production-runs"] });

    const saveRun = useMutation({
        mutationFn: async (input: CreateProductionRunInput) => {
            const { error: saveRunError } = await supabase
                .from("production_runs")
                .insert([
                    {
                        part_number: input.partNumber,
                        quantity_loaded: input.qtyLoaded,
                        quantity_coated: input.qtyCoated,
                        quantity_defects: input.qtyDefects,
                        quantity_falloff: input.qtyFallOff,
                        run_date: input.runDate,
                        shift: input.shift,
                        logged_by: input.loggedBy,
                        run_time: input.runTime,
                    },
                ]);

            if (saveRunError) throw saveRunError;
        },
        onSuccess: invalidate,
    });

    const deleteRun = useMutation({
        mutationFn: async (runId: number) => {
            const { error: deleteRunError } = await supabase
                .from("production_runs")
                .delete()
                .eq("id", runId);

            if (deleteRunError) throw deleteRunError;
        },
        onSuccess: invalidate,
    });

    const editRun = useMutation({
        mutationFn: async ({
            runId,
            updates,
        }: {
            runId: number;
            updates: EditProductionRunInput;
        }) => {
            const { data, error: editRunError } = await supabase
                .from("production_runs")
                .update({
                    part_number: updates.partNumber,
                    quantity_loaded: updates.qtyLoaded,
                    quantity_coated: updates.qtyCoated,
                    quantity_defects: updates.qtyDefects,
                    quantity_falloff: updates.qtyFallOff,
                    run_date: updates.runDate,
                    shift: updates.shift,
                    run_time: updates.runTime,
                })
                .eq("id", runId)
                .select()
                .single();

            if (editRunError) throw editRunError;
            return data;
        },
        onSuccess: invalidate,
    });

    return {
        deleteRun,
        editRun,
        saveRun,
    };
}
