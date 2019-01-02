/* eslint-disable no-bitwise */
import {promisify} from 'util';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import * as passport from 'passport';
import * as faker from 'faker';
import * as jwt from 'jsonwebtoken';
import User from '../models/User';
import {Response} from 'express';

const randomBytesAsync = promisify(crypto.randomBytes);

/**
 * GET /profile
 * Profile Info.
 */
export async function postGetProfile(req: any, res: any) {
    let user: any = null;
    if (req.body.token) {
        user = await jwt.verify(req.body.token, process.env.JWT_SECRET, async (err: any, decoded: any) => {
            if (decoded.email) {
                try {
                    user = await User.findOne({email: decoded.email}, (err, user) => {
                        if (!err) {
                            return user;
                        }
                    });
                    return user;
                } catch (e) {
                    console.log('user|', e);
                }
            }
        });
        if (user) {
            return res.json({status: 'success', user});
        }
    }
    return res.json({status: 'failed'});
}


/**
 * POST /login
 * Sign in using email and password.
 */
export function postLogin(req: any, res: any) {
    console.log('user|postLogin', req.body, req.query);
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({gmail_remove_dots: false});

    const errors = req.validationErrors();

    if (errors) {
        return res.json({status: 'failed'});
    }

    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.json({
                message: 'Something is not right',
                user,
                info,
                status: 'failed',
            });
        }
        req.logIn(user, {session: false}, (err: any) => {
            if (err) {
                return res.json({status: 'failed'});
            }
            const {email} = user;
            const token = jwt.sign({email}, process.env.JWT_SECRET);
            res.json({status: 'success', user, token});
        });
    })(req, res);
}

export function postGoogleLogin(req: any, res: any) {
    passport.authenticate('google-id-token', {session: false}, (err, user) => {
        req.logIn(user, {session: false}, (err: any) => {
            if (err || !user) {
                return res.json({status: 'failed'});
            }
            const {email} = user;
            const token = jwt.sign({email}, process.env.JWT_SECRET);
            res.json({status: 'success', user, token});
        });
    })(req, res);
}

export function getGoogleloginCallback(err: any, req: any, res: Response) {
    console.log('user|getGoogleloginCalback', res);
    if (err) {
        res.redirect('http://localhost:8888');
    }
    res.redirect('http://localhost:8888');
}

/**
 * GET /logout
 * Log out.
 */
export async function logout(req: any, res: any) {
    req.logout();
    req.session.destroy((err: any) => {
        if (err) {
            console.log('Error : Failed to destroy the session during logout.', err);
            return res.json({status: 'failed'});
        }
        req.user = null;
        res.json({status: 'success'});
    });
}

/**
 * GET /signup
 * Signup page.
 */
export function getSignup(req: any, res: any) {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('account/signup', {
        title: 'Create Account',
    });
}

/**
 * POST /signup
 * Create a new local account.
 */
export function postSignup(req: any, res: any, next: any) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    req.sanitize('email').normalizeEmail({gmail_remove_dots: false});

    const errors = req.validationErrors();
    if (errors) {
        return res.json({status: 'failed', errors});
    }

    const user = new User({
        email: req.body.email,
        password: req.body.password,
        fullName: req.body.fullName,
    });

    User.findOne({email: req.body.email}, (err, existingUser) => {
        if (existingUser) {
            return res.json({status: 'failed', message: 'This account has already existed.'});
        }
        if (err) {
            return res.json({status: 'error'});
        }
        user.save((err) => {
            if (err) {
                return res.json({status: 'error'});
            }
            req.logIn(user, (err: any) => {
                if (err) {
                    return res.json({status: 'error'});
                }
                const {email} = user;
                const token = jwt.sign({email}, process.env.JWT_SECRET);
                return res.json({status: 'success', user, token});
            });
        });
    });
}

export function generateUser(req: any, res: any, next: any) {
    const randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
    const randomName = faker.name.findName(); // Rowan Nikolaus
    const randomLocation = faker.address.country();
    const randomWebsite = faker.internet.url();
    const randomImage = faker.image.imageUrl();
    const genderArray = ['male', 'female', 'other'];
    const randomGender = genderArray[(Math.random() * genderArray.length) | 0];
    const user = new User({
        email: randomEmail.toLowerCase(),
        password: '123456',
        fullName: randomName,
        profile: {
            location: randomLocation,
            website: randomWebsite,
            picture: randomImage,
            gender: randomGender,
        },
    });
    User.findOne({email: randomEmail}, (err: any, existingUser: any) => {
        if (err) {
            return next(err);
        }
        if (existingUser) {
            req.flash('errors', {msg: 'Account with that email address already exists.'});
            return res.json({status: 'Failed'});
        }
        user.save((err: any) => {
            if (err) {
                return next(err);
            }
            console.log('Added 1 user to database', user);
            res.json({status: 'Ok'});
        });
    });
}


/**
 * GET /account
 * Profile page.
 */
export function getAccount(req: any, res: any) {

}

/**
 * POST /account/profile
 * Update profile information.
 */
export function postUpdateProfile(req: any, res: any, next: any) {
    req.assert('email', 'Please enter a valid email address.').isEmail();
    req.sanitize('email').normalizeEmail({gmail_remove_dots: false});

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/account');
    }

    User.findById(req.user.id, (err: any, user: any) => {
        if (err) {
            return next(err);
        }
        user.email = req.body.email || '';
        user.profile.name = req.body.name || '';
        user.profile.gender = req.body.gender || '';
        user.profile.location = req.body.location || '';
        user.profile.website = req.body.website || '';
        user.save((err: any) => {
            if (err) {
                if (err.code === 11000) {
                    req.flash('errors', {msg: 'The email address you have entered is already associated with an account.'});
                    return res.redirect('/account');
                }
                return next(err);
            }
            req.flash('success', {msg: 'Profile information has been updated.'});
            res.redirect('/account');
        });
    });
}

/**
 * POST /account/password
 * Update current password.
 */
export function postUpdatePassword(req: any, res: any, next: any) {
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/account');
    }

    User.findById(req.user.id, (err: any, user: any) => {
        if (err) {
            return next(err);
        }
        user.password = req.body.password;
        user.save((err: any) => {
            if (err) {
                return next(err);
            }
            req.flash('success', {msg: 'Password has been changed.'});
            res.redirect('/account');
        });
    });
}

/**
 * POST /account/delete
 * Delete user account.
 */
export function postDeleteAccount(req: any, res: any, next: any) {
    User.deleteOne({_id: req.user.id}, (err: any) => {
        if (err) {
            return next(err);
        }
        req.logout();
        req.flash('info', {msg: 'Your account has been deleted.'});
        res.redirect('/');
    });
}

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
export function getOauthUnlink(req: any, res: any, next: any) {
    const {provider} = req.params;
    User.findById(req.user.id, (err: any, user: any) => {
        if (err) {
            return next(err);
        }
        user[provider] = undefined;
        user.tokens = user.tokens.filter((token: any) => token.kind !== provider);
        user.save((err: any) => {
            if (err) {
                return next(err);
            }
            req.flash('info', {msg: `${provider} account has been unlinked.`});
            res.redirect('/account');
        });
    });
}

/**
 * GET /reset/:token
 * Reset Password page.
 */
export function getReset(req: any, res: any, next: any) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    User
        .findOne({passwordResetToken: req.params.token})
        .where('passwordResetExpires').gt(Date.now())
        .exec((err: any, user: any) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                req.flash('errors', {msg: 'Password reset token is invalid or has expired.'});
                return res.redirect('/forgot');
            }
            res.render('account/reset', {
                title: 'Password Reset',
            });
        });
}

/**
 * POST /reset/:token
 * Process the reset password request.
 */
export function postReset(req: any, res: any, next: any) {
    req.assert('password', 'Password must be at least 4 characters long.').len(4);
    req.assert('confirm', 'Passwords must match.').equals(req.body.password);

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('back');
    }

    const resetPassword = () =>
        User
            .findOne({passwordResetToken: req.params.token})
            .where('passwordResetExpires').gt(Date.now())
            .then((user: any) => {
                if (!user) {
                    req.flash('errors', {msg: 'Password reset token is invalid or has expired.'});
                    return res.redirect('back');
                }
                user.password = req.body.password;
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                return user.save().then(() => new Promise((resolve: any, reject: any) => {
                    req.logIn(user, (err: any) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(user);
                    });
                }));
            });

    const sendResetPasswordEmail = (user: any) => {
        if (!user) {
            return;
        }
        let transporter = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
                user: process.env.SENDGRID_USER,
                pass: process.env.SENDGRID_PASSWORD,
            },
        });
        const mailOptions = {
            to: user.email,
            from: 'hackathon@starter.com',
            subject: 'Your Hackathon Starter password has been changed',
            text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`,
        };
        return transporter.sendMail(mailOptions)
            .then(() => {
                req.flash('success', {msg: 'Success! Your password has been changed.'});
            })
            .catch((err: any) => {
                if (err.message === 'self signed certificate in certificate chain') {
                    console.log('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
                    transporter = nodemailer.createTransport({
                        service: 'SendGrid',
                        auth: {
                            user: process.env.SENDGRID_USER,
                            pass: process.env.SENDGRID_PASSWORD,
                        },
                        tls: {
                            rejectUnauthorized: false,
                        },
                    });
                    return transporter.sendMail(mailOptions)
                        .then(() => {
                            req.flash('success', {msg: 'Success! Your password has been changed.'});
                        });
                }
                console.log('ERROR: Could not send password reset confirmation email after security downgrade.\n', err);
                req.flash('warning', {msg: 'Your password has been changed, however we were unable to send you a confirmation email. We will be looking into it shortly.'});
                return err;
            });
    };

    resetPassword()
        .then(sendResetPasswordEmail)
        .then(() => {
            if (!res.finished) res.redirect('/');
        })
        .catch((err: any) => next(err));
}

/**
 * GET /forgot
 * Forgot Password page.
 */
export function getForgot(req: any, res: any) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.render('account/forgot', {
        title: 'Forgot Password',
    });
}

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
export function postForgot(req: any, res: any, next: any) {
    req.assert('email', 'Please enter a valid email address.').isEmail();
    req.sanitize('email').normalizeEmail({gmail_remove_dots: false});

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/forgot');
    }

    const createRandomToken = randomBytesAsync(16)
        .then(buf => buf.toString('hex'));

    const setRandomToken = (token: any) =>
        User
            .findOne({email: req.body.email})
            .then((user: any) => {
                if (!user) {
                    req.flash('errors', {msg: 'Account with that email address does not exist.'});
                } else {
                    user.passwordResetToken = token;
                    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
                    user = user.save();
                }
                return user;
            });

    const sendForgotPasswordEmail = (user: any) => {
        if (!user) {
            return;
        }
        const token = user.passwordResetToken;
        let transporter = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
                user: process.env.SENDGRID_USER,
                pass: process.env.SENDGRID_PASSWORD,
            },
        });
        const mailOptions = {
            to: user.email,
            from: 'hackathon@starter.com',
            subject: 'Reset your password on Hackathon Starter',
            text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };
        return transporter.sendMail(mailOptions)
            .then(() => {
                req.flash('info', {msg: `An e-mail has been sent to ${user.email} with further instructions.`});
            })
            .catch((err: any) => {
                if (err.message === 'self signed certificate in certificate chain') {
                    console.log('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
                    transporter = nodemailer.createTransport({
                        service: 'SendGrid',
                        auth: {
                            user: process.env.SENDGRID_USER,
                            pass: process.env.SENDGRID_PASSWORD,
                        },
                        tls: {
                            rejectUnauthorized: false,
                        },
                    });
                    return transporter.sendMail(mailOptions)
                        .then(() => {
                            req.flash('info', {msg: `An e-mail has been sent to ${user.email} with further instructions.`});
                        });
                }
                console.log('ERROR: Could not send forgot password email after security downgrade.\n', err);
                req.flash('errors', {msg: 'Error sending the password reset message. Please try again shortly.'});
                return err;
            });
    };

    createRandomToken
        .then(setRandomToken)
        .then(sendForgotPasswordEmail)
        .then(() => res.redirect('/forgot'))
        .catch(next);
}
