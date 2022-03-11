export interface SDKOptions {
    clientID?: string;
    clientSecret?: string;
    redirectURI?: string;
}
declare enum TARGET_TYPE {
    USER = 0,
    GROUP = 1
}
export interface TokenStatus {
    status: 200 | 401;
    message: string;
    targetType: TARGET_TYPE;
    target: string | 'null';
}
export interface NotifyResponse {
    status: 200 | 400 | 401;
    message: string;
}
export {};
