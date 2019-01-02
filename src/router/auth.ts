import * as passport from 'passport';

export default [
    {
        http_method: 'get',
        url: '/instagram',
        params: [passport.authenticate('instagram')],
    },
    {
        http_method: 'get',
        url: '/instagram/callback',
        params: [passport.authenticate('instagram', {failureRedirect: '/login'}), (req, res) => {
            res.redirect(req.session.returnTo || '/');
        }],
    },
    {
        http_method: 'get',
        url: '/facebook',
        params: [passport.authenticate('facebook', {scope: ['email', 'public_profile']})],
    },
    {
        http_method: 'get',
        url: '/facebook/callback',
        params: [passport.authenticate('facebook', {failureRedirect: '/login'}), (req, res) => {
            res.redirect(req.session.returnTo || '/');
        }],
    },
    {
        http_method: 'get',
        url: '/github',
        params: [passport.authenticate('github')],
    },
    {
        http_method: 'get',
        url: '/github/callback',
        params: [passport.authenticate('github', {failureRedirect: '/login'}), (req, res) => {
            res.redirect(req.session.returnTo || '/');
        }],
    },
    {
        http_method: 'get',
        url: '/google',
        params: [passport.authenticate('google', {scope: ['email', 'public_profile']})],
    },
    {
        http_method: 'get',
        url: '/google/callback',
        params: [passport.authenticate('google', {failureRedirect: '/login'}), (req, res) => {
            res.redirect(req.session.returnTo || '/');
        }],
    },
    {
        http_method: 'get',
        url: '/twitter',
        params: [passport.authenticate('twitter')],
    },
    {
        http_method: 'get',
        url: '/twitter/callback',
        params: [passport.authenticate('twitter', {failureRedirect: '/login'}), (req, res) => {
            res.redirect(req.session.returnTo || '/');
        }],
    },
    {
        http_method: 'get',
        url: '/linkedin',
        params: [passport.authenticate('linkedin', {state: 'SOME STATE'})],
    },
    {
        http_method: 'get',
        url: '/linkedin/callback',
        params: [passport.authenticate('linkedin', {failureRedirect: '/login'}), (req, res) => {
            res.redirect(req.session.returnTo || '/');
        }],
    },
    /**
     * OAuth authorization routes. (API examples)
     */
    {
        http_method: 'get',
        url: '/foursquare',
        params: [passport.authenticate('foursquare')],
    },
    {
        http_method: 'get',
        url: '/foursquare/callback',
        params: [passport.authenticate('foursquare', {failureRedirect: '/api'}), (req, res) => {
            res.redirect('/api/foursquare');
        }],
    },
    {
        http_method: 'get',
        url: '/tumblr',
        params: [passport.authenticate('tumblr')],
    },
    {
        http_method: 'get',
        url: '/tumblr/callback',
        params: [passport.authenticate('tumblr', {failureRedirect: '/api'}), (req, res) => {
            res.redirect('/api/tumblr');
        }],
    },
    {
        http_method: 'get',
        url: '/steam',
        params: [passport.authenticate('openid', {state: 'SOME STATE'})],
    },
    {
        http_method: 'get',
        url: '/steam/callback',
        params: [passport.authenticate('steam', {failureRedirect: '/api'}), (req, res) => {
            res.redirect('/api/steam');
        }],
    },
    {
        http_method: 'get',
        url: '/pinterest',
        params: [passport.authenticate('pinterest', {scope: 'read_public write_public'})],
    },
    {
        http_method: 'get',
        url: '/pinterest/callback',
        params: [passport.authenticate('pinterest', {failureRedirect: '/login'}), (req, res) => {
            res.redirect('/api/pinterest');
        }],
    },
];
