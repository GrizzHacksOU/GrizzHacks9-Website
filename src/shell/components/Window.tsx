import { APPS } from "../data/apps";
import type { WindowState } from "../types/windowState";

interface WindowProps {
    win: WindowState;
    active: boolean;
    onFocus: (id: string) => void;
    onClose: (id: string) => void;
}

export default function Window({win, active, onFocus, onClose}: WindowProps) {
    const app = APPS.find((app) => app.id === win.appID);
    if (!app) return null;

    return (
        <div
            className={active ? 'window is-active' : 'window'}
            style={{left: win.x, top: win.y, zIndex: win.z}}
            onPointerDown={() => onFocus(win.appID)}
        >
            <div className="title-bar">
                <div className="title-bar-text">{app.title}</div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize"></button>
                    <button aria-label="Maximize"></button>
                    <button aria-label="Close" onClick={() => onClose(win.appID)}></button>
                </div>
            </div>
            <div className="window-body">
                <iframe src={app.url} title={app.title}></iframe>
            </div>
        </div>
    );
}
