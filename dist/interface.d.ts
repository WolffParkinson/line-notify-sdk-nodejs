export interface SDKOptions {
    clientID?: string;
    clientSecret?: string;
    redirectURI?: string;
}
declare enum TargetType {
    User = "USER",
    Group = "GROUP"
}
export interface TokenStatus {
    status: 200 | 401;
    message: string;
    targetType: TargetType;
    target: string | 'null';
}
export interface NotifyResponse {
    status: 200 | 400 | 401;
    message: string;
}
export {};
