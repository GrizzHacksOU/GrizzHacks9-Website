import React, { useState } from "react";
import { APPS } from "../data/apps";
import onOpenApp from "../../Shell";
import DesktopIcon from "./DesktopIcon";

const [selectedID, setSelectedID] = useState<string | null>(null);

function handleEmptyClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
        setSelectedID(null);
    }
}

export default function DesktopIcons() {
    return (
        <div className="desktop-icons" onClick={handleEmptyClick}>
            {APPS.map((app) => (
                <DesktopIcon
                    key={app.id}
                    app={app}
                    selected={app.id === selectedID}
                    onSelect={setSelectedID}
                    onOpen={onOpenApp}
                />
            ))
            }
        </div>
    );
}
