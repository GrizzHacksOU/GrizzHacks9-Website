import { useCallback, useRef, useState } from "react";
import type { Rectangle, WindowState } from "./shell/types/windowState";
import Window from "./shell/components/Window";
import DesktopIcons from "./shell/components/DesktopIcons";
import StartMenu from "./shell/components/StartMenu";
import ZoomOutline, { type Zoom } from "./shell/components/ZoomOutline";
import { APPS } from "./shell/data/apps";

function prefersReducedMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getTopZ(windows: WindowState[]): number {
    return Math.max(0, ...windows.map((win) => win.z))
}

function Shell() {
    const [windows, setWindows] = useState<WindowState[]>([]);
    const activeZ = getTopZ(windows.filter((win) => !win.minimized));

    // ---- Win95 zoom-outline animation ----
    const shellRef = useRef<HTMLDivElement>(null);
    const desktopRef = useRef<HTMLElement>(null);
    const zoomCounter = useRef(0);
    const [zooms, setZooms] = useState<Zoom[]>([]);
    const finishZoom = useCallback((id: number) => setZooms((prev) => prev.filter((z) => z.id !== id)), []);

    // Screen rect -> coordinates relative to the shell (same origin as window x/y).
    function toShellRect(r: DOMRect): Rectangle {
        const origin = shellRef.current?.getBoundingClientRect();
        return {x: r.left - (origin?.left ?? 0), y: r.top - (origin?.top ?? 0), width: r.width, height: r.height};
    }

    function windowRect(win: WindowState): Rectangle {
        const desktop = desktopRef.current;
        if (win.maximized && desktop) {
            return {x: 0, y: 0, width: desktop.clientWidth, height: desktop.clientHeight};
        }
        return {x: win.x, y: win.y, width: win.width, height: win.height};
    }

    function taskButtonRect(appID: string): Rectangle | undefined {
        const button = shellRef.current?.querySelector(`.task-button[data-app-id="${CSS.escape(appID)}"]`);
        return button ? toShellRect(button.getBoundingClientRect()) : undefined;
    }

    function playZoom(from: Rectangle | undefined, to: Rectangle | undefined) {
        if (!from || !to || prefersReducedMotion()) return;
        const id = ++zoomCounter.current;
        setZooms((prev) => [...prev, {id, from, to}]);
    }

    function openAppAnimated(appID: string, fromRect?: DOMRect) {
        const existing = windows.find((win) => win.appID === appID);
        if (fromRect && (!existing || existing.minimized)) {
            // Must match the new-window position in openApp below.
            const offset = windows.length * 24;
            const target = existing ? windowRect(existing) : {x: 80 + offset, y: 40 + offset, width: 320, height: 240};
            playZoom(toShellRect(fromRect), target);
        }
        openApp(appID);
    }

    function minimizeAppAnimated(appID: string) {
        const win = windows.find((w) => w.appID === appID);
        if (win && !win.minimized) playZoom(windowRect(win), taskButtonRect(appID));
        minimizeApp(appID);
    }

    function handleTaskButtonClick(win: WindowState, button: HTMLElement) {
        if (win.minimized) playZoom(toShellRect(button.getBoundingClientRect()), windowRect(win));
        focusApp(win.appID);
    }

    function openApp(appID: string) {
        setWindows((prev) => {
            const nextZ = getTopZ(prev) + 1;

            if (prev.some((win) => win.appID === appID)) {
                return prev.map((win) => (win.appID === appID ? {...win, z: nextZ, minimized: false} : win));
            }

            const offset = prev.length * 24;
            return [...prev, {
                appID,
                x: 80 + offset,
                y: 40 + offset,
                width: 320,
                height: 240,
                z: nextZ,
                minimized: false,
                maximized: false
            }];
        });
    }

    function closeApp(appID: string) {
        setWindows((prev) => prev.filter((win) => win.appID !== appID));
    }

    function focusApp(appID: string) {
        setWindows((prev) => {
            const topZ = getTopZ(prev);
            const target = prev.find((win) => win.appID === appID);

            if (!target || (target.z === topZ && !target.minimized)) {
                return prev;
            }

            return prev.map((win) => (win.appID === appID ? {...win, z: topZ + 1, minimized: false} : win));
        });
    }

    function moveApp(appID: string, x: number, y: number) {
        setWindows((prev) => {
            const target = prev.find((win) => win.appID === appID);

            if (!target || (target.x === x && target.y === y)) {
                return prev;
            }

            return prev.map((win) => (win.appID === appID ? {...win, x: x, y: y} : win));
        });
    }

    function resizeApp(appID: string, rect: Rectangle) {
        setWindows((prev) => {
            const target = prev.find((win) => win.appID === appID);

            if (!target || (
                    target.width === rect.width &&
                    target.height === rect.height &&
                    target.x === rect.x &&
                    target.y === rect.y)) {
                return prev;
            }

            return prev.map((win) => (win.appID === appID ? {...win, ...rect} : win));
        });
    }

    function minimizeApp(appID: string) {
        setWindows((prev) => {
            const target = prev.find((win) => win.appID === appID);

            if (!target || target.minimized) {
                return prev;
            }

            return prev.map((win) => (win.appID === appID ? {...win, minimized: true} : win));
        });
    }

    function toggleMaximize(appID: string) {
        setWindows((prev) => {
            const target = prev.find((win) => win.appID === appID);

            if (!target) return prev;

            return prev.map((win) => (win.appID === appID ? {...win, maximized: !win.maximized} : win));
        });
    }

    return (
        <div className="shell" ref={shellRef}>
            <main className="desktop" ref={desktopRef}>
                <DesktopIcons onOpenApp={openAppAnimated}/>
                <div className="window-layer">
                    {windows.map((win) => (
                        <Window
                            key={win.appID}
                            win={win}
                            active={!win.minimized && win.z === activeZ}
                            onFocus={focusApp}
                            onClose={closeApp}
                            onMove={moveApp}
                            onResize={resizeApp}
                            onMinimize={minimizeAppAnimated}
                            onMaximizeToggle={toggleMaximize}
                        />
                    ))}
                </div>
            </main>
            <footer className="taskbar">
                <StartMenu />
                <div className="taskbar-tasks">
                    {windows.map((win) => (
                        <button
                            key={win.appID}
                            className={win.z === activeZ ? 'task-button is-active' : 'task-button'}
                            data-app-id={win.appID}
                            onClick={(e) => handleTaskButtonClick(win, e.currentTarget)}
                        >
                            {APPS.find((app) => app.id === win.appID)?.title}
                        </button>
                    ))}
                </div>
                <div className="taskbar-tray">12:00 AM</div>
                { /* hardcoded for now, will be an actual timestamp/timer during the event */}
            </footer>
            <div className="zoom-layer">
                {zooms.map((zoom) => <ZoomOutline key={zoom.id} zoom={zoom} onDone={finishZoom}/>)}
            </div>
        </div>
    );
}

export default Shell
