import React, { useRef, useState } from "react";
import { APPS } from "../data/apps";
import type { Rectangle, WindowState } from "../types/windowState";

type Edge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
const EDGES: Edge[] = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];
const MIN_WIDTH = 320;
const MIN_HEIGHT = 240;

interface WindowProps {
    win: WindowState;
    active: boolean;
    onFocus: (id: string) => void;
    onClose: (id: string) => void;
    onMove: (id: string, x: number, y: number) => void;
    onResize: (id: string, rect: Rectangle) => void;
    onMinimize: (id: string) => void;
    onMaximizeToggle: (id: string) => void;
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

interface ResizeStart extends Rectangle {
    pointerX: number;
    pointerY: number;
    edge: Edge;
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

export default function Window({win, active, onFocus, onClose, onMove, onResize, onMinimize, onMaximizeToggle}: WindowProps) {
    const app = APPS.find((app) => app.id === win.appID);
    const dragStart = useRef<DragStart | null>(null);
    const [dragging, setDragging] = useState(false);
    const resizeStart = useRef<ResizeStart | null>(null);

    if (!app) return null;

    function handleTitlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
        if (e.button !== 0) return;
        if ((e.target as HTMLElement).closest(".title-bar-controls")) return;
        if (win.maximized) return;

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

    function startResize(e: React.PointerEvent<HTMLDivElement>, edge: Edge) {
        if (e.button !== 0) return;

        e.currentTarget.setPointerCapture(e.pointerId);
        resizeStart.current = {
            pointerX: e.clientX,
            pointerY: e.clientY,
            edge,
            x: win.x,
            y: win.y,
            width: win.width,
            height: win.height
        }
        setDragging(true);
    }

    function handleResizeMove(e: React.PointerEvent<HTMLDivElement>) {
        const start = resizeStart.current;
        if (!start) return;

        const dx = e.clientX - start.pointerX;
        const dy = e.clientY - start.pointerY;
        const next: Rectangle = {x: start.x, y: start.y, width: start.width, height: start.height};

        if (start.edge.includes("e")) {
            next.width = Math.max(MIN_WIDTH, start.width + dx);
        }
        if (start.edge.includes("w")) {
            next.width = Math.max(MIN_WIDTH, start.width - dx);
            next.x = start.x + (start.width - next.width);
        }
        if (start.edge.includes("s")) {
            next.height = Math.max(MIN_HEIGHT, start.height + dy);
        }
        if (start.edge.includes("n")) {
            next.height = clamp(start.height - dy, MIN_HEIGHT, start.y + start.height);
            next.y = start.y + (start.height - next.height);
        }

        onResize(win.appID, next);
    }

    function endResize() {
        resizeStart.current = null;
        setDragging(false);
    }

    function handleTitleDoubleClick(e: React.MouseEvent<HTMLDivElement>) {
        if ((e.target as HTMLElement).closest(".title-bar-controls")) return;
        onMaximizeToggle(win.appID);
    }

    const classes = ["window"];
    if (active) classes.push("is-active");
    if (win.minimized) classes.push("is-minimized");
    if (win.maximized) classes.push("is-maximized");

    const style = win.maximized ?
        {zIndex: win.z} :
        {left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.z};

    return (
        <div
            className={classes.join(" ")}
            style={style}
            onPointerDown={() => onFocus(win.appID)}
        >
            <div
                className="title-bar"
                onPointerDown={handleTitlePointerDown}
                onPointerMove={handleTitlePointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onDoubleClick={handleTitleDoubleClick}
                >
                <div className="title-bar-text">{app.title}</div>
                <div className="title-bar-controls">
                    <button
                        aria-label="Minimize"
                        onClick={() => onMinimize(win.appID)}>
                    </button>
                    <button
                        aria-label={win.maximized ? "Restore" : "Maximize"}
                        onClick={() => onMaximizeToggle(win.appID)}>
                    </button>
                    <button
                        aria-label="Close"
                        onClick={() => onClose(win.appID)}>
                    </button>
                </div>
            </div>
            <div className="window-body">
                <iframe src={app.url} title={app.title}></iframe>
                {(!active || dragging) && <div className="focus-shield"/>}
            </div>
            {!win.maximized && EDGES.map((edge) => (
                <div
                    key={edge}
                    className={`resize-handle resize-${edge}`}
                    onPointerDown={(e) => startResize(e, edge)}
                    onPointerMove={handleResizeMove}
                    onPointerUp={endResize}
                    onPointerCancel={endResize}
                ></div>
            ))};
        </div>
    );
}
