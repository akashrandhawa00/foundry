import { Button } from "../Button";

interface Props {
    onClose: () => void;
    onDelete: () => void;
}

export default function DeleteConfirmation({ onClose, onDelete }: Props) {
    return (
        <div className="flex flex-col gap-4 w-40 justify-center items-center">
            <p>Are you sure?</p>
            <div className="flex gap-2">
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={onDelete}
                    className="bg-red-500/40 hover:border-red-500/40 hover:bg-red-500/30 py-0 "
                >
                    Delete
                </Button>
            </div>
        </div>
    );
}
