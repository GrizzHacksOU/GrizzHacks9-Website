export interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface WindowState extends Rectangle {
    appID: string;
    z: number;
    minimized: boolean;
    maximized: boolean;
}
