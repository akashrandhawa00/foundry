import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar,
    Legend,
} from "recharts";
import {
    useDashboardMetrics,
    type DashboardMetrics,
} from "../hooks/useDashboardMetrics";

const colors = {
    tooltipBg: "var(--color-neutral-900)",
    tooltipBorder: "var(--color-neutral-700)",
    tooltipHoverBg: "var(--color-white)",
    morning: "#2a9d8f",
    afternoon: "#e9c46a",
    midnight: "var(--color-rose-400)",
};

export const overViewCardStyle =
    "rounded-lg bg-neutral-900 border border-neutral-800 p-5";

export const cardHeadingStyle =
    "border-l-4 text-sm border-brand px-2 text-neutral-400 uppercase font-mono my-2";

function KpiCard({
    label,
    value,
    sublabel,
}: {
    label: string;
    value: string | number;
    sublabel?: string;
}) {
    return (
        <div className={`${overViewCardStyle}`}>
            <h3 className={cardHeadingStyle}>{label}</h3>
            <p className="mt-2 text-3xl font-semibold text-neutral-100 font-mono">
                {value}
            </p>
            {sublabel && (
                <p className="mt-1 text-xs text-neutral-500">{sublabel}</p>
            )}
        </div>
    );
}

function ShiftOutputChart({ data }: { data: DashboardMetrics["shift_trend"] }) {
    return (
        <div className={`${overViewCardStyle}`}>
            <h3 className={cardHeadingStyle}>Output by Shift — This Week</h3>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data}>
                    <CartesianGrid
                        stroke="#262626"
                        strokeDasharray="3 3"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="run_date"
                        stroke="#525252"
                        fontSize={11}
                        tickFormatter={(d) =>
                            new Date(d).toLocaleDateString(undefined, {
                                weekday: "short",
                            })
                        }
                    />
                    <YAxis stroke="#525252" fontSize={11} />
                    <Tooltip
                        cursor={{
                            fill: colors.tooltipHoverBg,
                            fillOpacity: 0.1,
                        }}
                        contentStyle={{
                            background: colors.tooltipBg,
                            border: `1px solid ${colors.tooltipBorder}`,
                            borderRadius: 5,
                            fontSize: 12,
                        }}
                        labelStyle={{ color: "#a3a3a3", fontWeight: 200 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, color: "#a3a3a3" }} />
                    <Bar
                        dataKey="morning_output"
                        name="Morning"
                        fill={colors.morning}
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="afternoon_output"
                        name="Afternoon"
                        fill={colors.afternoon}
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="midnight_output"
                        name="Midnight"
                        fill={colors.midnight}
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

function YieldTrendChart({ data }: { data: DashboardMetrics["trend"] }) {
    return (
        <div className={`${overViewCardStyle}`}>
            <h3 className={cardHeadingStyle}>Yield — Last 30 Days</h3>
            <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data}>
                    <CartesianGrid
                        stroke="#262626"
                        strokeDasharray="3 3"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="run_date"
                        stroke="#525252"
                        fontSize={11}
                        tickFormatter={(d) => new Date(d).getDate().toString()}
                    />
                    <YAxis
                        stroke="#525252"
                        fontSize={11}
                        domain={[0, 100]}
                        unit="%"
                    />
                    <Tooltip
                        contentStyle={{
                            background: "#171717",
                            border: "1px solid #262626",
                            borderRadius: 8,
                            fontSize: 12,
                        }}
                        labelStyle={{ color: "#a3a3a3" }}
                    />
                    <Line
                        name="Yield"
                        type="monotone"
                        dataKey="yield_pct"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export function DashboardCharts() {
    const { data, isLoading, error } = useDashboardMetrics();

    if (isLoading)
        return (
            <div className="text-neutral-500 font-mono text-sm">
                Loading metrics…
            </div>
        );
    if (error || !data)
        return (
            <div className="text-neutral-500 font-mono text-sm">
                Couldn't load metrics.
            </div>
        );

    const todayYield =
        data.today.loaded > 0
            ? ((data.today.coated / data.today.loaded) * 100).toFixed(1)
            : "0.0";
    const weekDefectRate =
        data.week.coated > 0
            ? ((data.week.defects / data.week.coated) * 100).toFixed(1)
            : "0.0";

    return (
        <div className="space-y-5 mt-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard label="Today's Yield" value={`${todayYield}%`} />
                <KpiCard
                    label="Coated Today"
                    value={data.today.coated.toLocaleString()}
                    sublabel={`of ${data.today.loaded.toLocaleString()} loaded`}
                />
                <KpiCard
                    label="Weekly Defect Rate"
                    value={`${weekDefectRate}%`}
                />
                <KpiCard label="Runs Logged Today" value={data.today.runs} />
            </div>

            <div className="grid grid-rows-1 md:grid-cols-2 gap-5">
                <YieldTrendChart data={data.trend} />
                <ShiftOutputChart data={data.shift_trend} />
            </div>

            <div className={`${overViewCardStyle}`}>
                <h3 className={cardHeadingStyle}>Top Parts — Last 7 Days</h3>
                <div className="space-y-2">
                    {data.top_parts.map((p) => (
                        <div
                            key={p.part_number}
                            className="flex justify-between text-sm text-neutral-300"
                        >
                            <span className="uppercase text-neutral-300">
                                {p.part_description ?? p.part_number}
                            </span>
                            <span className="font-mono text-neutral-500">
                                {p.total.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
