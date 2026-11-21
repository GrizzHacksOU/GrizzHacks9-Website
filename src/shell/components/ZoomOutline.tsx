import { useEffect, useRef } from "react";
import type { Rectangle } from "../types/windowState";

// Win95-style "zoom rectangle": a dotted outline that jumps from one rectangle
// to another (icon -> window when opening, window -> taskbar when minimizing).

export interface Zoom {
    id: number;
    from: Rectangle;
    to: Rectangle;
}

// Keep in sync with the window-appear delay in shell.css.
export const ZOOM_MS = 200;

interface ZoomOutlineProps {
    zoom: Zoom;
    onDone: (id: number) => void;
}

function toFrame(r: Rectangle) {
    return { left: `${r.x}px`, top: `${r.y}px`, width: `${r.width}px`, height: `${r.height}px` };
}

export default function ZoomOutline({ zoom, onDone }: ZoomOutlineProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        // steps() makes it jump in a few chunky frames like the original.
        const anim = el.animate([toFrame(zoom.from), toFrame(zoom.to)], {
            duration: ZOOM_MS,
            easing: "steps(6, end)",
            fill: "forwards",
        });
        anim.onfinish = () => onDone(zoom.id);
        return () => anim.cancel();
    }, [zoom, onDone]);

    return <div ref={ref} className="zoom-outline" style={toFrame(zoom.from)} />;
}
