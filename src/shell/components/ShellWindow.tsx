function ShellWindow() {
    return (
        <div className="window-layer">
            <div className="window" style={{ top: 80, left: 220 }}>
                <div className="title-bar">
                    <div className="title-bar-controls">
                    <button aria-label="Minimize"></button>
                    <button aria-label="Maximize"></button>
                    <button aria-label="Close"></button>
                    </div>
                </div>
                <div className="window-body">
                    <p>Work In Progress</p>
                </div>
            </div>
        </div>
    );
}

export default ShellWindow
