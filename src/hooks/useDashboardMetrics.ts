import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase-client";

export interface DashboardMetrics {
    today: {
        runs: number;
        loaded: number;
        coated: number;
        defects: number;
        falloff: number;
    };
    week: { loaded: number; coated: number; defects: number };
    trend: Array<{
        run_date: string;
        loaded: number;
        coated: number;
        yield_pct: number;
    }>;
    top_parts: Array<{
        part_number: string;
        part_description: string | null;
        total: number;
    }>;
    shift_trend: Array<{
        run_date: string;
        day_output: number;
        night_output: number;
    }>;
}

export function useDashboardMetrics() {
    return useQuery({
        queryKey: ["dashboard-metrics"],
        queryFn: async (): Promise<DashboardMetrics> => {
            const { data, error } = await supabase.rpc("get_dashboard_metrics");
            if (error) throw error;
            return data as DashboardMetrics;
        },
        staleTime: 60_000,
    });
}
