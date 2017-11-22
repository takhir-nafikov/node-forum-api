# Forum API
## User
### Register
For a register, you would send a POST request on `/register` 

**request :**
```
email: <email>,
name: <name>,
password: <password>,
confirmPassword: <confirmPassword>
```
**response :**
``` 
status: 201
{
    success: true, 
    message: 'Successful created new user'
}
```
if any field is empty : 
```
status: 409
{
    success: false, 
    message: 'All fields must be filled'
}
```
incorrect email: 
```
status: 409
{   
    success: false,
    message: 'Invalid email'
}
```
different password: 
```
status: 409
{
    success: false, 
    message: 'Your passwords do not match'
}
```
exist email:
```
status: 409
{
    success: false, 
    message: 'User with this email exists'
}
```

### Login
For a аuthentication, you would send a POST request on `/login` 

**request :**
```
email: <email>,
password: <password>,
```
**response :**
```
status: 200`
{
    success: true, 
    message: 'Authentication success', 
    token: <token>
}
```
Token need indicates in the header at `x-access-token: <token>` for an operation which requires authentication.

if user not register:
```
status: 401
{
    success: false, 
    message: 'Authentication failed. User not found'
}
```
if incorrect password:
```
status: 401
{
    success: false, 
    message: 'Authentication failed. Wrong password'
}
```

### Change username/password
For change username send PUT request on `/me`
Need indicate token in headers.

**requset :**
```
name: <new name>
```
**response :**
```
status: 200
{
    success: true,
    message: 'Update successful'
}
```
Change password passes in 2 steps.
Need indicate token in headers.
**1** - Send user email on `/me/reset` with POST request and get token.

**requset :**
```
email: <user email>
```
**response :**
```
status: 200
{
    success: true,
    message: 'You can update password during 24 hours',
    token: <reset token>
}
```
**2** - Send received token on `/me/reset` with PUT request.

**requset :**
```
token: <reset token>
```
**response :**
```
status: 200
{
    success: true,
    message: 'Your password has been reset'
}
```
if 24 hours passed from the first step or incorrect token : 
```
status: 404
{
    success: false,
    message: 'Password reset is invalid or has expired'
}
```

### About user
To get information about yourself you need to send GET request on `/me`.
Need indicate token in headers.

**response :**
```
status: 200
{
    success: true,
    user: {
            email:<email>
            username:<username>
            phoro:<String>
            likes: Array with id messages
          }
}
```
### Download avatar
Send POST request on `me/photo`.
Need indicate token in headers.
Supports the following extensions: png, jpeg, jpg.
The photo is uploaded to the server, it receives a unique name and this name is saved by the user.

**requset :**
```
photo: <file>
```
**response :**
```
status: 200
{
    success: true,
    message: 'avatar downloaded'
}
```

## Themes
### Get themes
Send GET request on `/themes` or `/themes/pages/<page>`.

**response :**
```
status: 200
{
    success: true,
    pages: <count all pages>,
    themes: <Array with themes>
}
```
### Add theme
Send POST request on `/themes`.
Need indicate token in headers.

**requset :**
```
name: <name>,
description: <description>
```
**response :**
```
status: 201
{
    success: true,
    id: <id theme>
}
```

### Get theme
Send GET request on `/themes/<id theme>`.

**response :**
```
status: 200
{
    success: true,
    theme: {
                name: <name>,
                description: <description>,
                created: <Date>
                author: {
                            name: <name>            
                        }
                messages: <Array with messsages>
           }
}
```
### Update theme
Send PUT reqiuest on `/themes/<id theme>`.
Need indicate token in headers. Also you need to be the author of this theme.

**requset :**
```
name: <name>,
description: <description>
```
**response :**
```
status: 200
{
    success: true,
    message: 'Successfully updated <theme name>'
}
```
if you are not the author of this theme:
```
status: 403
{
    success: false,
    message: 'You must own a theme in order to edit it'
}
```
### Delete theme
Send DELETE reqiuest on `/themes/<id theme>`.
Need indicate token in headers. Also you need to be the author of this theme.

**response :**
```
status: 200
{
    success: true,
    message: 'Successfully deleted <theme name>'
}
```
if you are not the author of this theme:
```
status: 403
{
    success: false,
    message: 'You must own a theme in order to edit it'
}
```

## Messages
### Get Messages 
Send GET request on `/themes/<id theme>/messages` or 
`/themes/<id theme>/messages/pages/<page>`.

**response :**
```
status: 200
{
    success: true,
    pages: <count all pages>,
    themes: <Array with messages>
}
```

### Add message
Send POST request on `/themes/<id theme>/messages`.
Need indicate token in headers.

**requset :**
```
text: <text>
```
**response :**
```
status: 201
{
    success: true,
    id: <id message>
}
```

### Get theme
Send GET request on `/themes/<id theme>/messages/<id message>`.

**response :**
```
status: 200
{
    success: true,
    message: {
                created: <Date>
                author: <id>,
                theme: <id>
                text: <text>
           }
}
```
### Update theme
Send PUT reqiuest on `/themes/<id theme>/messages/<id message>`.
Need indicate token in headers. Also you need to be the author of this message.

**requset :**
```
text: <text>
```
**response :**
```
status: 200
{
    success: true,
    message: 'Successfully update'
}
```
if you are not the author of this message:
```
status: 403
{
    success: false,
    message: 'You must own a message in order to edit it'
}
```
### Delete theme
Send DELETE reqiuest on `/themes/<id theme>/messages/<id message>`.
Need indicate token in headers. Also you need to be the author of this message.

**response :**
```
status: 200
{
    success: true,
    message: 'Successfully delete'
}
```
if you are not the author of this message:
```
status: 403
{
    success: false,
    message: 'You must own a message in order to edit it'
}
```

### Like/unlike message
Send POST request on `/themes/<id theme>/messages/<id message>/like`.
Need indicate token in headers.

**response :**
```
status: 200
{
    success: true
}
```
