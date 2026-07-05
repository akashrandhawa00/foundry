import PageHeader from "../components/ui/PageHeader";

export const Users = () => {
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
            </div>
        </div>
    );
};
