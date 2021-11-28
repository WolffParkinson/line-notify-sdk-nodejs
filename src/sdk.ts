import axios from "axios";
import FormData from "form-data";
import { LineNotifyError } from "./error";
import { NotifyResponse, SDKOptions, TokenStatus } from "./interface";

export class notifySDK {

    clientId:string|undefined;
    clientSecret:string|undefined;
    redirectURI:string|undefined;
    oauthBaseURI = 'https://notify-bot.line.me/oauth';
    apiBaseURI = 'https://notify-api.line.me/api';

    constructor(options?:SDKOptions){
        this.clientId = options?.clientID || process.env.LINE_NOTIFY_CLIENT_ID;
        this.clientSecret = options?.clientSecret || process.env.LINE_NOTIFY_CLIENT_SECRET;
        this.redirectURI = options?.redirectURI || process.env.LINE_NOTIFY_REDIRECT_URI;

        if (!this.clientId || !this.clientSecret || !this.redirectURI){
            throw new LineNotifyError('Credentials undefined')
        }
    }

    generateOauthURL (state:string,formPost:boolean=false){
        let oauthURL = this.oauthBaseURI + '/authorize?' +
			'response_type=code' + 
			'&scope=notify' +
			'&client_id=' + this.clientId +
			'&redirect_uri=' + this.redirectURI +
			'&state=' + state

		if (formPost) oauthURL += '&response_mode=form_post';
		return oauthURL;
    }

    /**
     * GET: Token from client code
     * @param clientCode Code from authorization flow
     * @returns Token
     */
    async getToken(clientCode:string) {

		let form = new FormData()
		form.append('grant_type','authorization_code')
		form.append('code',clientCode)
		form.append('redirect_uri',this.redirectURI)
		form.append('client_id',this.clientId)
		form.append('client_secret',this.clientSecret)

        try {
            const res = await axios.post(`${this.oauthBaseURI}/token`,form,{headers:form.getHeaders()})
            return (res.data as any).access_token as string
        } catch (e:any) {
            throw new LineNotifyError(e.toJSON())
        }
    }

    /**
     * GET - STATUS of the LINE Notify token
     * @param token Token to fetch status
     * @returns status
     */
    async getStatus(token:string) {

        try {
            const res = await axios.get(`${this.apiBaseURI}/status`, {headers:{Authorization:`Bearer ${token}`}})
            return res.data as TokenStatus
        } catch (e:any) {
            throw new LineNotifyError(e.toJSON())
        }

	};

    /**
     * POST - REVOKE token
     * @param token Token to revoke
     * @returns confirmation status
     */
    async revoke(token:string) {
        try {
            const res = await axios.post(`${this.apiBaseURI}/revoke`,null, {
				headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/x-www-form-urlencoded'}
			})
            return res.data
        } catch (e:any) {
            throw new LineNotifyError(e.toJSON())
        }
	};

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
    async notify(token:string,message:string, imageThumbnailURL?:string, imageFullsizeURL?:string, stickerPackageId?:number, stickerId?:number, notificationDisabled:boolean=false) {

        if (!token) throw new LineNotifyError('Token is required for sending notification')
        if (!message) throw new LineNotifyError('Message is required for sending notification')
        if (message.length > 1000) throw new LineNotifyError('Message maximum allowed length is 1000 characters')

        let form = new FormData()
        form.append('message',message);
        if (imageThumbnailURL) form.append('imageThumbnail',imageThumbnailURL);
        if (imageFullsizeURL) form.append('imageFullsize',imageFullsizeURL);
        if (stickerPackageId) form.append('stickerPackageId',stickerPackageId);
        if (stickerId) form.append('stickerId',stickerId);
        if (notificationDisabled) form.append('notificationDisabled','true');
        
        let headers = form.getHeaders()
        headers['Authorization']=`Bearer ${token}`

        try {
			const res = await axios.post(`${this.apiBaseURI}/notify`, form,{headers:headers})
            return res.data as unknown as NotifyResponse
        } catch (e:any) {
            throw new LineNotifyError(e.toJSON())
        }
	};


}