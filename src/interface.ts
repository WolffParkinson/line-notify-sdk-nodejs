export interface SDKOptions {
    clientID?: string;
    clientSecret?: string;
    redirectURI?: string
}

enum TARGET_TYPE {
    USER,
    GROUP
}

export interface TokenStatus {
    status: 200 | 401;
    message: string;
    targetType: TARGET_TYPE;
    target: string | 'null'

}

export interface NotifyResponse {
    status: 200 | 400 | 401;
    message: string
}