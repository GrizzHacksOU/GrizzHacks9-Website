import React, { useState } from "react";
import { APPS } from "../data/apps";
import DesktopIcon from "./DesktopIcon";

interface DesktopIconsProps {
    onOpenApp: (id: string) => void;
}

export default function DesktopIcons({onOpenApp}: DesktopIconsProps) {
    const [selectedID, setSelectedID] = useState<string | null>(null);

    function handleEmptyClick(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target === e.currentTarget) {
            setSelectedID(null);
        }
    }

    return (
        <div className="desktop-icons" onClick={handleEmptyClick}>
            {APPS.map((app) => (
                <DesktopIcon
                    key={app.id}
                    app={app}
                    selected={app.id === selectedID}
                    onSelect={setSelectedID}
                    onOpen={onOpenApp}
                />))
            }
        </div>
    );
}
