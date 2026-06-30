import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import logo from "../assets/foundry-mark-dark.svg";

export const LoginPage = () => {
    const { user, loading: authLoading, signInWithEmail } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    if (!authLoading && user) return <Navigate to="/" replace />;

    const handleLogin = async (e: React.SubmitEvent) => {
        e.preventDefault();

        try {
            await signInWithEmail(email, password);

            navigate("/", { replace: true });
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unexpected error occured");
            }
        }
    };

    const labelBaseStyle = " block text-sm mb-1.5 text-text-label";
    const inputBaseStyle =
        "w-full rounded-lg outline-none px-4 py-3 border border-white/10 bg-surface font-mono focus:border-brand text-sm";

    return (
        <div className="min-h-screen flex flex-col items-center bg-black justify-center text-white">
            {/*  logo */}

            {/* sign in form */}
            <div className="bg-surface-2 w-full max-w-120 rounded-xl border border-white/10 py-10 px-8">
                <div className="mb-6 pl-3 gap-2 flex flex-col items-center">
                    <div className="flex flex-col items-end gap-2">
                        <img src={logo} className="h-8 w-8" />
                        <div>
                            <h1 className="font-medium text-2xl uppercase font-mono text-text">
                                Foundry
                            </h1>
                        </div>
                    </div>
                    <div>
                        <p className="text-[14px] text-text-muted">
                            Production Dashboard
                        </p>
                    </div>
                </div>
                <div className="pb-6">Sign in</div>
                <form onSubmit={handleLogin} className="flex flex-col">
                    <div className="flex-col flex mb-4">
                        <label className={`${labelBaseStyle}`}>Email</label>
                        <input
                            type="email"
                            placeholder="email@org.com"
                            value={email}
                            className={`${inputBaseStyle}`}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                        />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className={`${labelBaseStyle}`}>Password</label>
                        <input
                            type="password"
                            autoComplete="on"
                            placeholder="••••••••"
                            className={`${inputBaseStyle}`}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                    </div>

                    {error && (
                        <div className="w-full bg-red-600/20 text-red-500 rounded px-2 py-2 flex items-center border-red-500">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className={`w-full py-3 mt-4 font-medium rounded tansition duration-200 ${email && password ? "bg-brand text-black cursor-pointer" : "cursor-not-allowed bg-neutral-600 text-neutral-300"}`}
                    >
                        Sign In
                    </Button>
                </form>
            </div>
        </div>
    );
};
