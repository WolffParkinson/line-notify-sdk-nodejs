export class LineNotifyError extends Error {
    
    constructor(message:string){
        super(message)
        this.name = 'NotifySDKError'
    }
}