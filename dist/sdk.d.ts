import { NotifyResponse, SDKOptions, TokenStatus } from "./interface";
export declare class notifySDK {
    clientId: string | undefined;
    clientSecret: string | undefined;
    redirectURI: string | undefined;
    oauthBaseURI: string;
    apiBaseURI: string;
    constructor(options?: SDKOptions);
    errorMessage(error: any): any;
    generateOauthURL(state: string, formPost?: boolean): string;
    /**
     * GET: Token from client code
     * @param clientCode Code from authorization flow
     * @returns Token
     */
    getToken(clientCode: string): Promise<string>;
    /**
     * GET - STATUS of the LINE Notify token
     * @param token Token to fetch status
     * @returns status
     */
    getStatus(token: string): Promise<TokenStatus>;
    /**
     * POST - REVOKE token
     * @param token Token to revoke
     * @returns confirmation status
     */
    revoke(token: string): Promise<null>;
    /**
     * POST - Notify Message
     * @param token Token
     * @param message 1000 characters max
     * @param imageThumbnailURL Maximum size of 240×240px JPEG
     * @param imageFullsizeURL Maximum size of 2048×2048px JPEG
     * @param stickerPackageId [Sticker List](https://developers.line.biz/en/docs/messaging-api/sticker-list/#specify-sticker-in-message-object)
     * @param stickerId [Sticker List](https://developers.line.biz/en/docs/messaging-api/sticker-list/#specify-sticker-in-message-object)
     * @param notificationDisabled 	true: The user doesn't receive a push notification when the message is sent.
     *                              false: The user receives a push notification when the message is sent (unless they have disabled push notification in LINE and/or their device).
     * @returns NotifyResponse
     */
    notify(token: string, message: string, imageThumbnailURL?: string, imageFullsizeURL?: string, stickerPackageId?: number, stickerId?: number, notificationDisabled?: boolean): Promise<NotifyResponse>;
}
