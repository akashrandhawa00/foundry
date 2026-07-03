import { NavLink } from "react-router-dom";
import { Button } from "../components/Button";

export function NotFound() {
    return (
        <div className="min-h-dvh flex items-center justify-center text-white">
            <div className="text-center">
                <h1 className="text-4xl font-bold">404</h1>
                <p className="mx-2 mb-4 text-neutral-400">
                    Page under construction
                </p>
                <NavLink to="/">
                    <Button variant="primary">Go to Home</Button>
                </NavLink>
            </div>
        </div>
    );
}
