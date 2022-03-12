"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifySDK = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const error_1 = require("./error");
class notifySDK {
    constructor(options) {
        this.oauthBaseURI = 'https://notify-bot.line.me/oauth';
        this.apiBaseURI = 'https://notify-api.line.me/api';
        this.clientId = (options === null || options === void 0 ? void 0 : options.clientID) || process.env.LINE_NOTIFY_CLIENT_ID;
        this.clientSecret = (options === null || options === void 0 ? void 0 : options.clientSecret) || process.env.LINE_NOTIFY_CLIENT_SECRET;
        this.redirectURI = (options === null || options === void 0 ? void 0 : options.redirectURI) || process.env.LINE_NOTIFY_REDIRECT_URI;
        if (!this.clientId || !this.clientSecret || !this.redirectURI) {
            throw new error_1.LineNotifyError('Credentials undefined');
        }
    }
    handleError(error) {
        if (error.response) {
            throw new error_1.LineNotifyError(error.response.data.message);
        }
        else if (error.request) {
            throw new error_1.LineNotifyError('No response received from LINE servers');
        }
        else {
            throw new error_1.LineNotifyError(error.message);
        }
    }
    generateOauthURL(state, formPost = false) {
        let oauthURL = this.oauthBaseURI + '/authorize?' +
            'response_type=code' +
            '&scope=notify' +
            '&client_id=' + this.clientId +
            '&redirect_uri=' + this.redirectURI +
            '&state=' + state;
        if (formPost)
            oauthURL += '&response_mode=form_post';
        return oauthURL;
    }
    /**
     * GET: Token from client code
     * @param clientCode Code from authorization flow
     * @returns Token
     */
    getToken(clientCode) {
        return __awaiter(this, void 0, void 0, function* () {
            let form = new form_data_1.default();
            form.append('grant_type', 'authorization_code');
            form.append('code', clientCode);
            form.append('redirect_uri', this.redirectURI);
            form.append('client_id', this.clientId);
            form.append('client_secret', this.clientSecret);
            try {
                const res = yield axios_1.default.post(`${this.oauthBaseURI}/token`, form, { headers: form.getHeaders() });
                return res.data.access_token;
            }
            catch (error) {
                this.handleError(error);
            }
        });
    }
    /**
     * GET - STATUS of the LINE Notify token
     * @param token Token to fetch status
     * @returns status
     */
    getStatus(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield axios_1.default.get(`${this.apiBaseURI}/status`, { headers: { Authorization: `Bearer ${token}` } });
                return res.data;
            }
            catch (error) {
                this.handleError(error);
            }
        });
    }
    ;
    /**
     * POST - REVOKE token
     * @param token Token to revoke
     * @returns confirmation status
     */
    revoke(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield axios_1.default.post(`${this.apiBaseURI}/revoke`, null, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/x-www-form-urlencoded' }
                });
                return res.data;
            }
            catch (error) {
                this.handleError(error);
            }
        });
    }
    ;
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
    notify(token, message, imageThumbnailURL, imageFullsizeURL, stickerPackageId, stickerId, notificationDisabled = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token)
                throw new error_1.LineNotifyError('Token is required for sending notification');
            if (!message)
                throw new error_1.LineNotifyError('Message is required for sending notification');
            if (message.length > 1000)
                throw new error_1.LineNotifyError('Message maximum allowed length is 1000 characters');
            let form = new form_data_1.default();
            form.append('message', message);
            if (imageThumbnailURL)
                form.append('imageThumbnail', imageThumbnailURL);
            if (imageFullsizeURL)
                form.append('imageFullsize', imageFullsizeURL);
            if (stickerPackageId)
                form.append('stickerPackageId', stickerPackageId);
            if (stickerId)
                form.append('stickerId', stickerId);
            if (notificationDisabled)
                form.append('notificationDisabled', 'true');
            let headers = form.getHeaders();
            headers['Authorization'] = `Bearer ${token}`;
            try {
                const res = yield axios_1.default.post(`${this.apiBaseURI}/notify`, form, { headers: headers });
                return res.data;
            }
            catch (error) {
                this.handleError(error);
            }
        });
    }
    ;
}
exports.notifySDK = notifySDK;
