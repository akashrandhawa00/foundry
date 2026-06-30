import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

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

            navigate("/production-runs", { replace: true });
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unexpected error occured");
            }
        }
    };

    const labelBaseStyle = "mb-2 inline-block text-sm mb-1.5 text-text-label";
    const inputBaseStyle =
        "w-full rounded-lg outline-none px-4 py-3 border border-white/10 bg-surface focus:border-brand text-sm";

    return (
        <div className="flex flex-col md:flex-row-reverse min-h-screen">
            <section className="w-full mx-auto px-4 md:px-0 md:items-center flex items-start md:w-1/3">
                <div className="bg-gray-900 w-full max-w-sm py-4 mx-auto md:mx-0 my-auto min-w-min relative md:-left-3 text-primary">
                    <div className="z-10  pt-4 text-primary font-mono tracking-wider text-3xl">
                        FOUNDRY
                    </div>
                    <div className="text-sm tracking-wider pb-4 text-text-secondary/90">
                        Production Tracker
                    </div>
                </div>
            </section>

            <section className="flex-1 flex-col flex justify-center mt-6 md:mt-0 md:flex md:w-2/3 md:border-r border-white/20 px-4 items-center bg-gray-900 text-white">
                {/* sign in form */}
                <div className="w-full max-w-sm py-4 mx-auto min-w-min my-auto md:py-9 md:w-7/12">
                    <h2 className="text-xl font-semibold md:text-2xl">
                        Sign in
                    </h2>
                    <div className="my-4">
                        <form onSubmit={handleLogin} className="flex flex-col">
                            {error && (
                                <div className="w-full text-red-400 px-2 py-1 mb-4 flex items-center border-l-2 border-red-400">
                                    {error === "missing email or phone"
                                        ? "Invalid Email or password."
                                        : error}
                                </div>
                            )}

                            <div className="mb-3">
                                <label
                                    htmlFor="user_email"
                                    className={`${labelBaseStyle}`}
                                >
                                    Email
                                </label>
                                <input
                                    id="user_email"
                                    type="email"
                                    placeholder="email@org.com"
                                    value={email}
                                    className={`leading-1.5 rounded-s-md ${inputBaseStyle}`}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="mb-3">
                                <label
                                    htmlFor="user_password"
                                    className={`${labelBaseStyle}`}
                                >
                                    Password
                                </label>
                                <input
                                    id="user_password"
                                    type="password"
                                    placeholder="••••••••"
                                    className={`relative ${inputBaseStyle}`}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={authLoading}
                                className={`w-full py-2 mt-4 font-medium rounded tansition duration-200 ${email && password ? "bg-brand cursor-pointer" : "cursor-not-allowed bg-neutral-600 text-neutral-300"}`}
                            >
                                {authLoading ? "Signing in..." : "Sign in"}
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};
