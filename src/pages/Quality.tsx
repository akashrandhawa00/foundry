import PageHeader from "../components/ui/PageHeader";
import UnderConstructionGIF from "../components/ui/UnderConstrucion";

export const Quality = () => {
    return (
        <div className="md:px-10 px-6 py-8">
            <PageHeader
                title=""
                filterButton={false}
                addRunButton={true}
                showTagline={false}
            />
            <UnderConstructionGIF />
        </div>
    );
};
