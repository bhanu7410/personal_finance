import { GripVertical } from "lucide-react";

export function ResizerHandle({
    onMouseDown,
}: {
    onMouseDown: (e: React.MouseEvent) => void;
}) {
    return (
        <div
            className="animate-slide-in group flex w-4 cursor-col-resize items-center justify-center transition-colors hover:bg-gray-100/50"
            onMouseDown={onMouseDown}
        >
            <div className="flex h-8 w-1.5 items-center justify-center rounded-full bg-gray-200 group-hover:bg-gray-400">
                <GripVertical className="h-4 w-4 text-gray-500 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
        </div>
    );
}
