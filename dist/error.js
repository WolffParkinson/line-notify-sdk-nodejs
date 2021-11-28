"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineNotifyError = void 0;
class LineNotifyError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotifySDKError';
    }
}
exports.LineNotifyError = LineNotifyError;
