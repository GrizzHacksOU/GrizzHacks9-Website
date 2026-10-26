export interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface WindowState extends Rectangle {
    appID: string;
    x: number;
    y: number;
    z: number;
}
