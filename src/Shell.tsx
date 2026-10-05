function Shell() {
    return (
        <div className="shell">
            <main className="desktop">
                <div className="desktop-icons">
                    {/* placeholder for now to test logic */}
                    <div className="desktop-icon">About</div>
                    <div className="desktop-icon">Registration</div>
                    <div className="desktop-icon">Schedule</div>
                    <div className="desktop-icon">Sponsors</div>
                    <div className="desktop-icon">FAQ</div>
                    <div className="desktop-icon">Team</div>
                </div>
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
