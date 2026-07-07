import { FiAlertTriangle } from "react-icons/fi";

interface Props {
    itemName?: string;
    onClose: () => void;
    onDelete: () => void;
}

export default function DeleteConfirmation({
    itemName,
    onClose,
    onDelete,
}: Props) {
    return (
        <div className="w-full max-w-sm rounded-lg bg-neutral-900 border border-neutral-800 p-6">
            <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                    <FiAlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-neutral-100">
                        Delete {itemName ?? "this item"}?
                    </h3>
                    <p className="mt-1 text-sm text-neutral-400">
                        This action cannot be undone. This will permanently
                        remove
                        {itemName ? ` ${itemName}` : " this item"} from your
                        records.
                    </p>
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="cursor-pointer rounded-md border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800 disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onDelete}
                    className="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
