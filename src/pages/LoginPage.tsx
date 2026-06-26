import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

export const LoginPage = () => {
    const { user, loading: authLoading, signInWithEmail } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    if (!authLoading && user) return <Navigate to="/" replace />;

    const handleLogin = async (e: React.FormEvent) => {
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

    return (
        <div className="min-h-screen flex items-center justify-center text-white">
            <div className="bg-neutral-700 p-8 w-full max-w-120">
                <form onSubmit={handleLogin} className="flex flex-col">
                    <div className="flex-col flex">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="email@org.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                    </div>

                    {error && <div>{error}</div>}

                    <button
                        type="submit"
                        className={`w-full py-3 font-medium rounded tansition duration-500 ${email && password ? "bg-lime-500 text-black cursor-pointer" : "cursor-not-allowed bg-neutral-600 text-neutral-300"}`}
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};
