# line-notify-sdk-nodejs

> This project is a third-party LINE Notify SDK.

LINE official didn't provide SDK of Notify function. It's not convenient for developers.

Official LINE Notify API provides endpoints for `Authentication` and `Notification`, so does this project.

### Authentication API

1. `GET` https://notify-bot.line.me/oauth/authorize
   - _notify.generateOauthURL(state)_
2. `POST` https://notify-bot.line.me/oauth/token
   - _notify.getToken(client_code)_

### Notification API

- `GET` https://notify-api.line.me/api/status
  - _notify.getStatus(token)_
- `POST` https://notify-api.line.me/api/notify
  - _notify.notify(token, message, imageThumbnail, imageFullsize, stickerPackageId, stickerId, notificationDisabled)_
- `POST` https://notify-api.line.me/api/revoke
  - _notify.revoke(token)_

## Installation

```shell
npm install line-notify-sdk
```

```shell
yarn add line-notify-sdk
```

## Usage

## Authentication

### 1. Initialization

Import module and initial sdk object. Constructor's arguments are optional if you have default variables in your environment.

```javascript
const notifySDK = require("line-notify-sdk");
const notify = new notifySDK(clientID, clientSecret, redirectURI);
// These parameters are optional if you have
// default variables in your environment
```

Default environment variables

```md
LINE_NOTIFY_CLIENT_ID=
LINE_NOTIFY_CLIENT_SECRET=
LINE_NOTIFY_REDIRECT_URI=
```

### 2. Generate authentication link

> _notify.generateOauthURL(state)_

`return` **[string]**

Example ：

```javascript
const url = notify.generateOauthURL("somerandomstate");
```

### 3. Get token from code

> _notify.getToken(clientCode)_

`return` **[promise]** resolves to **[string]**

Example：

```javascript
const token = await notify.getToken(clientCode);
//token: ZnCpYyTJq7_this_is_user_token_alxj8nWpzBl1
```

## Notification

### Initialization

Import module and initial sdk object. Does not require environment variables to send Notifications

```javascript
const notifySDK = require("line-notify-sdk");
const notify = new notifySDK();
```

### Get token status

> _notify.getStatus(token)_

`return` **[promise]** resolves to **[object]**

Example:

```javascript
try {
  const info = await notify.getStatus(token);
  // info : { status: 200, message: 'ok', targetType: 'USER', target: 'yiyu0x' }
} catch (error) {
  // error : { status: 4xx, message: 'Invalid access token or other message from LINE'}
}
```

### Send notification

> _notify.notify(token, message, imageThumbnail, imageFullsize, stickerPackageId, stickerId, notificationDisabled)_

return： [promise] resolves to [object]

Example：

```javascript
// Send a message
notify
  .notify(token, "hello")
  .then((body) => {
    console.log(body);
    //{ status: 200, message: 'ok' }
  })
  .catch((e) => console.log(e));

// Send a sticker
notify
  .notify(token, "Here is my sticker", "", "", 1, 1)
  .then((body) => {
    console.log(body);
  })
  .catch((e) => console.log(e));
```

### Revoke token

> _notify.revoke(token)_

`return` **[promise]** resolves to **[object]**

Example：

```javascript
// revoke token
notify
  .revoke(token)
  .then((body) => {
    console.log(body); //{ status: 200, message: 'ok' }
  })
  .catch((e) => console.log(e));
```

# Others

- Example Authentication using Express server at `example/server.js`
- Example Notifications at `example/notify.js`

# API Rate Limits

> Reference : [LINE Docs](https://notify-bot.line.me/doc/en/)

There is a limit to the number of times an API can be called on each service.
The default number is set to 1000.

The limit is per access token.

The API Rate Limit status, can be checked on the response header of the API.

|        Header name         | Description                                          |
| :------------------------: | :--------------------------------------------------- |
|     X-RateLimit-Limit      | The limit of API calls per hour                      |
|   X-RateLimit-Remaining    | The number of possible remaining API calls           |
|   X-RateLimit-ImageLimit   | The limit of Uploading image per hour                |
| X-RateLimit-ImageRemaining | The number of possible remaining Uploading image     |
|     X-RateLimit-Reset      | The time when the limit is reset (UTC epoch seconds) |
