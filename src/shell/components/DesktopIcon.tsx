import type { AppDef } from "../types/app";

interface DesktopIconProps {
    app: AppDef;
    selected: boolean;
    onSelect: (id: string) => void;
    onOpen: (id: string) => void;
}

export default function DesktopIcon({ app, selected, onSelect, onOpen} : DesktopIconProps) {
    return (
        <button
            type="button"
            className={selected ? 'desktop-icon is-selected' : 'desktop-icon'}
            onClick={() => onSelect(app.id)}
            onDoubleClick={() => onOpen(app.id)}
        >
            <img src={app.icon} alt="" />
            <span>{app.title}</span>
        </button>
    );
}
