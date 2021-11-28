export interface SDKOptions {
    clientID?: string;
    clientSecret?: string;
    redirectURI?: string;
}
export interface TokenStatus {
    status: 200 | 401;
    message: string;
    targetType: 'USER' | 'GROUP';
    target: string | 'null';
}
export interface NotifyResponse {
    status: 200 | 400 | 401;
    message: string;
}
