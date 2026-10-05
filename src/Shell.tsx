import { useState } from "react";
import { WindowState } from "./shell/types/windowState";

const [windows, setWindows] = useState<WindowState[]>([]);

function openApp(appID: string) {
    setWindows((prev) => {
        const nextZ = Math.max(0, ...prev.map((w) => w.z)) + 1;

        if (prev.some((w) => w.appID === appID)) {
            return prev.map((w) => (w.appID === appID ? {...w, z: nextZ} : w));
        }

        const offset = prev.length * 24;
        return [...prev, {appID, x: 80 + offset, y: 40 + offset, z: nextZ}];
    })
}


function Shell() {
    return (
        <div className="shell">
            <main className="desktop">

                <div className="window-layer"></div>
            </main>
            <footer className="taskbar">
                <button className="start-button">Start</button>
                <div className="taskbar-tasks">

                </div>
                <div className="taskbar-tray">12:00 AM</div>
                { /* hardcoded for now, will be an actual timestamp/timer during the event */}
            </footer>
        </div>
    );
}

export default Shell
