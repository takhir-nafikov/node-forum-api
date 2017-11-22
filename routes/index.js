const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const themeController = require('../controllers/themeController');
const messageController = require('../controllers/messageController');
const {catchErrors} = require('../handlers/errorHandlers');

module.exports = (server, plugin) => {
    server.post('/login', plugin, catchErrors(authController.login));
    server.post('/register', plugin, userController.validateRegister, catchErrors(userController.register));

    server.get('/me', plugin, authController.verifyToken, catchErrors(userController.me));
    server.post('/me/reset', plugin, authController.verifyToken, catchErrors(authController.forgot));
    server.put('/me/reset', plugin, authController.verifyToken, catchErrors(authController.update));
    server.put('/me', plugin, authController.verifyToken, catchErrors(userController.update));
    server.post('/me/photo', 
        authController.verifyToken,
        userController.upload,
        catchErrors(userController.resize),
        catchErrors(userController.setAvatar)
    );

    server.post('/themes', plugin, authController.verifyToken, catchErrors(themeController.createTheme));
    server.put('/themes/:id',
        plugin,
        authController.verifyToken,
        catchErrors(themeController.confirmOwner),
        catchErrors(themeController.updateTheme) 
    );
    server.del('/themes/:id',
        plugin,
        authController.verifyToken,
        catchErrors(themeController.confirmOwner),
        catchErrors(themeController.deleteTheme)
    );
    server.get('/themes/:id', plugin, catchErrors(themeController.getTheme));
    server.get('/themes', plugin, catchErrors(themeController.getThemes));
    server.get('/themes/pages/:page', plugin, catchErrors(themeController.getThemes));

    server.post('/themes/:idTheme/messages', plugin, authController.verifyToken, catchErrors(messageController.addMessage));
    server.get('/themes/:idTheme/messages', plugin, catchErrors(messageController.getMessages));
    server.get('/themes/:idTheme/messages/pages/:page', plugin, catchErrors(messageController.getMessages));
    server.get('/themes/:idTheme/messages/:idMessage', plugin, catchErrors(messageController.getMessage));
    server.put('/themes/:idTheme/messages/:idMessage', plugin, authController.verifyToken, catchErrors(messageController.updateMessage));
    server.del('/themes/:idTheme/messages/:idMessage', plugin, authController.verifyToken, catchErrors(messageController.deleteMessage));

    server.post('/themes/:idTheme/messages/:idMessage/like', plugin, authController.verifyToken, catchErrors(messageController.likeMessage));
}
