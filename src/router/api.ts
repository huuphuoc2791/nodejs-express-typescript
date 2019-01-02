/* eslint-disable max-len */

import * as apiController from '../controllers/api';
import * as passportConfig from '../config/passport';

// const upload = multer({dest: path.join(__dirname, '../uploads')});

export default [
    {
        http_method: 'get',
        url: '/',
        params: [apiController.getApi],
    },
    {
        http_method: 'get',
        url: '/lastfm',
        params: [apiController.getLastfm],
    },
    {
        http_method: 'get',
        url: '/nyt',
        params: [apiController.getNewYorkTimes],
    },
    {
        http_method: 'get',
        url: '/aviary',
        params: [apiController.getAviary],
    },
    {
        http_method: 'get',
        url: '/steam',
        params: [apiController.getSteam],
    },
    {
        http_method: 'get',
        url: '/stripe',
        params: [apiController.getStripe],
    },
    {
        http_method: 'post',
        url: '/stripe',
        params: [apiController.postStripe],
    },
    {
        http_method: 'get',
        url: '/scraping',
        params: [apiController.getScraping],
    },
    {
        http_method: 'get',
        url: '/twilio',
        params: [apiController.getTwilio],
    },
    {
        http_method: 'post',
        url: '/twilio',
        params: [apiController.postTwilio],
    },
    {
        http_method: 'get',
        url: '/clockwork',
        params: [apiController.getClockwork],
    },
    {
        http_method: 'post',
        url: '/clockwork',
        params: [apiController.postClockwork],
    },
    {
        http_method: 'get',
        url: '/foursquare',
        params: [passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFoursquare],
    }, {
        http_method: 'get',
        url: '/tumblr',
        params: [passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTumblr],
    }, {
        http_method: 'get',
        url: '/facebook',
        params: [passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook],
    }, {
        http_method: 'get',
        url: '/github',
        params: [passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getGithub],
    },
    {
        http_method: 'get',
        url: '/twitter',
        params: [passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTwitter],
    },
    {
        http_method: 'post',
        url: '/twitter',
        params: [passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postTwitter],
    },
    {
        http_method: 'get',
        url: '/linkedin',
        params: [passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getLinkedin],
    },
    {
        http_method: 'get',
        url: '/instagram',
        params: [passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getInstagram],
    },
    {
        http_method: 'get',
        url: '/paypal',
        params: [apiController.getPayPal],
    },
    {
        http_method: 'get',
        url: '/paypal/success',
        params: [apiController.getPayPalSuccess],
    },
    {
        http_method: 'get',
        url: '/paypal/cancel',
        params: [apiController.getPayPalCancel],
    },
    {
        http_method: 'get',
        url: '/lob',
        params: [apiController.getLob],
    },
    // {
    //     http_method: 'get',
    //     url: '/upload',
    //     params: [apiController.getFileUpload],
    // },
    // {
    //     http_method: 'post',
    //     url: '/upload',
    //     params: [upload.single('myFile'), apiController.postFileUpload],
    // },
    {
        http_method: 'get',
        url: '/pinterest',
        params: [passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getPinterest],
    },
    {
        http_method: 'get',
        url: '/pinterest',
        params: [passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postPinterest],
    },
    {
        http_method: 'get',
        url: '/google-maps',
        params: [apiController.getGoogleMaps],
    },

];
