import * as passport from 'passport';
import User from '../models/User';
import * as passportLocal from 'passport-local';
import * as passportFacebook from 'passport-facebook';
import * as passportGithub from 'passport-github';
import * as passportJWT from 'passport-jwt';

const GoogleTokenStrategy = require('passport-google-id-token')


const {Strategy: LocalStrategy} = passportLocal;
const {Strategy: FacebookStrategy} = passportFacebook;
const {Strategy: GitHubStrategy} = passportGithub;

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.serializeUser((user, done) => {
    done(null, (user as any).id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});
passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
    },
    ((jwtPayload, cb) =>
            User.findById(jwtPayload.id)
                .then(user => cb(null, user))
                .catch(err => cb(err))
    )));
/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({usernameField: 'email'}, (email: string, password: string, done: any) => {
    User.findOne({email: email.toLowerCase()}, (err: any, user: any) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {msg: `Email ${email} not found.`});
        }
        user.comparePassword(password, (err: any, isMatch: boolean) => {
            if (err) {
                return done(err);
            }
            if (isMatch) {
                return done(null, user);
            }
            return done(null, false, {msg: 'Invalid email or password.'});
        });
    });
}));

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['name', 'email', 'link', 'locale', 'timezone', 'gender'],
    passReqToCallback: true
}, (req: any, accessToken: any, refreshToken: any, profile: any, done: any) => {
    if (req.user) {
        User.findOne({facebook: profile.id}, (err, existingUser) => {
            if (err) {
                return done(err);
            }
            if (existingUser) {
                done(err);
            } else {
                User.findById(req.user.id, (err, user) => {
                    if (err) {
                        return done(err);
                    }
                    user.facebook = profile.id;
                    user.tokens.push({kind: 'facebook', accessToken});
                    user.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`;
                    user.profile.gender = user.profile.gender || profile._json.gender;
                    user.profile.picture = user.profile.picture || `https://graph.facebook.com/${profile.id}/picture?type=large`;
                    user.save((err) => {
                        done(err, user);
                    });
                });
            }
        });
    } else {
        User.findOne({facebook: profile.id}, (err, existingUser) => {
            if (err) {
                return done(err);
            }
            if (existingUser) {
                return done(null, existingUser);
            }
            User.findOne({email: profile._json.email}, (err, existingEmailUser) => {
                if (err) {
                    return done(err);
                }
                if (existingEmailUser) {
                    done(err);
                } else {
                    const user = new User();
                    user.email = profile._json.email;
                    user.facebook = profile.id;
                    user.tokens.push({kind: 'facebook', accessToken});
                    user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
                    user.profile.gender = profile._json.gender;
                    user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
                    user.profile.location = (profile._json.location) ? profile._json.location.name : '';
                    user.save((err) => {
                        done(err, user);
                    });
                }
            });
        });
    }
}));

/**
 * Sign in with GitHub.
 */
// passport.use(new GitHubStrategy({
//     clientID: process.env.GITHUB_ID,
//     clientSecret: process.env.GITHUB_SECRET,
//     callbackURL: '/auth/github/callback',
// }, (req: any, accessToken: any, refreshToken: any, profile: any, done: any) => {
//     if (req.user) {
//         User.findOne({github: profile.id}, (err, existingUser) => {
//             if (existingUser) {
//                 done(err);
//             } else {
//                 User.findById(req.user.id, (err, user) => {
//                     if (err) {
//                         return done(err);
//                     }
//                     user.github = profile.id;
//                     user.tokens.push({kind: 'github', accessToken});
//                     user.profile.name = user.profile.name || profile.displayName;
//                     user.profile.picture = user.profile.picture || profile._json.avatar_url;
//                     user.profile.location = user.profile.location || profile._json.location;
//                     user.profile.website = user.profile.website || profile._json.blog;
//                     user.save((err) => {
//                         done(err, user);
//                     });
//                 });
//             }
//         });
//     } else {
//         User.findOne({github: profile.id}, (err, existingUser) => {
//             if (err) {
//                 return done(err);
//             }
//             if (existingUser) {
//                 return done(null, existingUser);
//             }
//             User.findOne({email: profile._json.email}, (err, existingEmailUser) => {
//                 if (err) {
//                     return done(err);
//                 }
//                 if (existingEmailUser) {
//                     done(err);
//                 } else {
//                     const user = new User();
//                     user.email = profile._json.email;
//                     user.github = profile.id;
//                     user.tokens.push({kind: 'github', accessToken});
//                     user.profile.name = profile.displayName;
//                     user.profile.picture = profile._json.avatar_url;
//                     user.profile.location = profile._json.location;
//                     user.profile.website = profile._json.blog;
//                     user.save((err) => {
//                         done(err, user);
//                     });
//                 }
//             });
//         });
//     }
// }));


passport.use(new GoogleTokenStrategy({
        clientID: process.env.GOOGLE_ID
    },
    function (parsedToken: any, googleId: any, done: any) {
        const {payload} = parsedToken;
        User.findOne({google: googleId}, (err, existingUser) => {
            if (err) {
                return done(err);
            }
            if (existingUser) {
                return done(null, existingUser);
            }
            User.findOne({email: payload.email}, (err, existingEmailUser) => {
                if (err) {
                    return done(err);
                }
                if (existingEmailUser) {
                    return done(err);
                } else {
                    const user = new User();
                    user.email = payload.email;
                    user.google = googleId;
                    user.tokens.push({kind: 'google', accessToken: parsedToken.signature});
                    user.fullName = payload.name;
                    user.profile.name = payload.name;
                    user.profile.picture = payload.picture;
                    user.save((err) => {
                        return done(err, user);
                    });
                }
            });

        });
    }
));
/**
 * Login Required middleware.
 */
export function isAuthenticated(req: any, res: any, next: any) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.json({});
}

/**
 * Authorization Required middleware.
 */
export function isAuthorized(req: any, res: any, next: any) {
    const provider = req.path.split('/').slice(-1)[0];
    const token = req.user.tokens.find((token: any) => token.kind === provider);
    if (token) {
        next();
    } else {
        res.json({});
    }
}
