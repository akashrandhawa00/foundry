export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                surface: {
                    hard: "#0b0d0c", // bg-surface-hard
                    DEFAULT: "#111413", // bg-surface
                    soft: "#181b1a", // bg-surface-soft
                    raised: "#1d201f", // bg-surface-raised
                    selected: "#252827", // bg-surface-selected
                },
                ink: {
                    DEFAULT: "#F0E4C8", // text-ink
                    secondary: "#D4C49C", // text-ink-secondary
                    label: "#B0A47C", // text-ink-label
                    muted: "#706656", // text-ink-muted
                },
                brand: {
                    DEFAULT: "#F59E0B", // text-brand, bg-brand, border-brand
                    light: "#FCD34D", // text-brand-light
                },
                success: "#4ADE80",
                danger: "#F87171",
                warning: "#FB923C",
                info: "#38BDF8",
                role: "#C084FC",
            },
        },
    },
    plugins: [],
};
