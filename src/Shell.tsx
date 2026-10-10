import { useState } from "react";
import type { WindowState } from "./shell/types/windowState";
import Window from "./shell/components/Window";
import DesktopIcons from "./shell/components/DesktopIcons";
import { APPS } from "./shell/data/apps";

function getTopZ(windows: WindowState[]): number {
    return Math.max(0, ...windows.map((win) => win.z))
}

function Shell() {
    const [windows, setWindows] = useState<WindowState[]>([]);

    function openApp(appID: string) {
        setWindows((prev) => {
            const nextZ = getTopZ(prev) + 1;

            if (prev.some((win) => win.appID === appID)) {
                return prev.map((win) => (win.appID === appID ? {...win, z: nextZ} : win));
            }

            const offset = prev.length * 24;
            return [...prev, {appID, x: 80 + offset, y: 40 + offset, z: nextZ}];
        });
    }

    function closeApp(appID: string) {
        setWindows((prev) => prev.filter((win) => win.appID !== appID));
    }

    function focusApp(appID: string) {
        setWindows((prev) => {
            const topZ = getTopZ(prev);
            const target = prev.find((win) => win.appID === appID);

            if (!target || target.z === topZ) {
                return prev;
            }

            return prev.map((win) => (win.appID === appID ? {...win, z: topZ + 1} : win));
        });
    }

    const topZ = getTopZ(windows);

    return (
        <div className="shell">
            <main className="desktop">
                <DesktopIcons onOpenApp={openApp}/>
                <div className="window-layer">
                    {windows.map((win) => (
                        <Window
                            key={win.appID}
                            win={win}
                            active={win.z === topZ}
                            onFocus={focusApp}
                            onClose={closeApp}
                        />
                    ))}
                </div>
            </main>
            <footer className="taskbar">
                <button className="start-button">Start</button>
                <div className="taskbar-tasks">
                    {windows.map((win) => (
                        <button
                            key={win.appID}
                            className={win.z === topZ ? 'task-button is-active' : 'task-button'}
                            onClick={() => focusApp(win.appID)}
                        >
                            {APPS.find((app) => app.id === win.appID)?.title}
                        </button>
                    ))}
                </div>
                <div className="taskbar-tray">12:00 AM</div>
                { /* hardcoded for now, will be an actual timestamp/timer during the event */}
            </footer>
        </div>
    );
}

export default Shell
