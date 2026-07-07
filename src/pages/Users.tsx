import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../context/AuthContext";

export const Users = () => {
    const { isLoading } = useAuth();

    return (
        <div className="md:px-10 px-6 py-8">
            <PageHeader
                title="Users Management"
                showTagline={false}
                description="Manage your team members and their account permissions here."
            />
            <div>
                <div>
                    <h3>All Users</h3>
                    <div>filters</div>
                    <button>add user</button>
                </div>
                <div>User Table</div>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div id="parts-table" className="overflow-x-auto">
                        <table className="min-w-max w-full border-collapse text-left mt-8">
                            <thead>
                                <tr className="py-6 px-12 border-b border-surface-active">
                                    {[
                                        "Part Number",
                                        "Description",
                                        "Client",
                                        "Substrate",
                                        "",
                                    ].map((header) => (
                                        <th
                                            key={header}
                                            className="px-3 py-2 text-sm font-medium text-text-label uppercase tracking-wide"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            {/* <tbody> */}
                            {/*     {user?.map((part) => ( */}
                            {/*         <PartsRow */}
                            {/*             key={part.partNumber} */}
                            {/*             part={part} */}
                            {/*         /> */}
                            {/*     ))} */}
                            {/* </tbody> */}
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
