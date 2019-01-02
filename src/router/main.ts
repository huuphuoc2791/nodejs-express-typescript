import * as userController from '../controllers/user';
import * as contactController from '../controllers/contact';
import * as passportConfig from '../config/passport';
import * as passport from 'passport';

const mainRouter = [
    {
        http_method: 'post',
        url: '/',
        params: [(req: any, res: any) => {
            res.send('Rendering file')
        }],
    }, {
        http_method: 'post',
        url: '/get-profile',
        params: [userController.postGetProfile],
    },
    {
        http_method: 'post',
        url: '/login',
        params: [userController.postLogin],
    },
    {
        http_method: 'post',
        url: '/google',
        params: [userController.postGoogleLogin],
    },
    {
        http_method: 'post',
        url: '/logout',
        params: [userController.logout],
    },
    {
        http_method: 'get',
        url: '/forgot',
        params: [userController.getForgot],
    },
    {
        http_method: 'post',
        url: '/forgot',
        params: [userController.postForgot],
    },
    {
        http_method: 'get',
        url: '/reset/:token',
        params: [userController.getReset],
    },
    {
        http_method: 'post',
        url: '/reset/:token',
        params: [userController.postReset],
    },
    {
        http_method: 'get',
        url: '/signup',
        params: [userController.getSignup],
    },
    {
        http_method: 'post',
        url: '/signup',
        params: [userController.postSignup],
    },
    {
        http_method: 'get',
        url: '/contact',
        params: [contactController.getContact],
    },
    {
        http_method: 'post',
        url: '/contact',
        params: [contactController.postContact],
    },
    {
        http_method: 'get',
        url: '/account',
        params: [passportConfig.isAuthenticated, userController.getAccount],
    },
    {
        http_method: 'post',
        url: '/account/profile',
        params: [passportConfig.isAuthenticated, userController.postUpdateProfile],
    },
    {
        http_method: 'get',
        url: '/account/password',
        params: [passportConfig.isAuthenticated, userController.postUpdatePassword],
    },
    {
        http_method: 'post',
        url: '/account/delete',
        params: [passportConfig.isAuthenticated, userController.postDeleteAccount],
    },
    {
        http_method: 'get',
        url: '/account/unlink/:provider',
        params: [passportConfig.isAuthenticated, userController.getOauthUnlink],
    },
    {
        http_method: 'get',
        url: '/generate-user',
        params: [userController.generateUser],
    },
];
export default mainRouter;
