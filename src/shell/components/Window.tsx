import React, { useRef, useState } from "react";
import { APPS } from "../data/apps";
import type { WindowState } from "../types/windowState";

interface WindowProps {
    win: WindowState;
    active: boolean;
    onFocus: (id: string) => void;
    onClose: (id: string) => void;
    onMove: (id: string, x: number, y: number) => void;
}

interface DragStart {
    pointerX: number;
    pointerY: number;
    winX: number;
    winY: number;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

export default function Window({win, active, onFocus, onClose, onMove}: WindowProps) {
    const app = APPS.find((app) => app.id === win.appID);
    const dragStart = useRef<DragStart | null>(null);
    const [dragging, setDragging] = useState(false);
    if (!app) return null;

    function handleTitlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
        if (e.button !== 0) return;
        if ((e.target as HTMLElement).closest(".title-bar-controls")) return;

        const windowEl = e.currentTarget.parentElement;
        const layer = e.currentTarget.closest<HTMLElement>(".window-layer");
        if (!windowEl || !layer) return;

        e.currentTarget.setPointerCapture(e.pointerId);
        dragStart.current = {
            pointerX: e.clientX,
            pointerY: e.clientY,
            winX: win.x,
            winY: win.y,
            minX: -(windowEl.offsetWidth - 60),
            maxX: layer.clientWidth - 60,
            minY: 0,
            maxY: layer.clientHeight - 30
        };
        setDragging(true);
    }

    function handleTitlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
        const start = dragStart.current;
        if (!start) return;

        const dx = e.clientX - start.pointerX; 
        const dy = e.clientY - start.pointerY;
        onMove(
            win.appID,
            clamp(start.winX + dx, start.minX, start.maxX),
            clamp(start.winY + dy, start.minY, start.maxY)
        );
    }

    function endDrag() {
        dragStart.current = null;
        setDragging(false);
    }

    return (
        <div
            className={active ? 'window is-active' : 'window'}
            style={{left: win.x, top: win.y, zIndex: win.z}}
            onPointerDown={() => onFocus(win.appID)}
        >
            <div
                className="title-bar"
                onPointerDown={handleTitlePointerDown}
                onPointerMove={handleTitlePointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                >
                <div className="title-bar-text">{app.title}</div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize"></button>
                    <button aria-label="Maximize"></button>
                    <button aria-label="Close" onClick={() => onClose(win.appID)}></button>
                </div>
            </div>
            <div className="window-body">
                <iframe src={app.url} title={app.title}></iframe>
                {(!active || dragging) && <div className="focus-shield"/>}
            </div>
        </div>
    );
}
