export interface ThemeCollectedEvent {
    code: string;
    url: string;
    html: string;
}

export interface StockCollectedEvent {
    code: string;
    url: string;
    html: string;
}

export interface ErrorEvent {
    from: string;
    args: [];
    error: Error;
}
