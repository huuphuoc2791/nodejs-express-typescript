import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as session from 'express-session';
import * as chalk from 'chalk';
import * as lusca from 'lusca';
import * as flash from 'express-flash';
import * as dotenv from 'dotenv';
import * as mongoStore from 'connect-mongo';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as expressValidator from 'express-validator';
import * as expressStatusMonitor from 'express-status-monitor';
import * as sass from 'node-sass-middleware';
import * as multer from 'multer';

const upload = multer();
dotenv.load({path: '.env'});
import {
    apiRouter,
    authRouter,
    customerRouter,
    employeeRouter,
    mainRouter,
    personRouter
} from './router';

class App {
    public app: express.Application;
    public MongoStore = new mongoStore(session);

    constructor() {
        this.app = express();
        this.mongoConfig();
        this.config();
    }

    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(upload.array());
        this.app.use(logger('dev'));
        this.app.set('views', path.join(__dirname, '..', 'frontend', 'views'));
        this.app.set('view engine', 'pug');
        this.app.use(cookieParser());
        this.app.use(expressStatusMonitor());
        this.app.use(compression());
        this.app.use(sass({
            src: path.join(__dirname, '../front-end/public/css'),
            dest: path.join(__dirname, '../front-end/public/css'),
        }));
        this.app.use(expressValidator());
        this.app.use(session({
            resave: true,
            saveUninitialized: true,
            secret: process.env.SESSION_SECRET,
            cookie: {maxAge: 15000000000}, // two weeks in milliseconds
            store: new this.MongoStore({
                url: process.env.MONGODB_URI,
                autoReconnect: true,
            }),
        }));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use(flash());
        this.app.use((req, res, next) => {
            next();
        });
        this.app.use(lusca.xssProtection(true));
        this.app.disable('x-powered-by');

        this.app.use('/', express.static(path.join(__dirname, '..', 'frontend'), {maxAge: 31557600000}));
        this.app.use('/js/lib', express.static(path.join(__dirname, '..', 'node_modules/popper.js/dist/umd'), {maxAge: 31557600000}));
        this.app.use('/js/lib', express.static(path.join(__dirname, '..', 'node_modules/bootstrap/dist/js'), {maxAge: 31557600000}));
        this.app.use('/js/lib', express.static(path.join(__dirname, '..', 'node_modules/jquery/dist'), {maxAge: 31557600000}));
        this.app.use('/webfonts', express.static(path.join(__dirname, '..', 'node_modules/@fortawesome/fontawesome-free/webfonts'), {maxAge: 31557600000}));
        this.app.use((req: any, res, next) => {
            res.locals.user = req.user;
            next();
        });
        this.app.use((req: any, res, next) => {
            // After successful login, redirect back to the intended page
            if (!req.user
                && req.path !== '/login'
                && req.path !== '/signup'
                && !req.path.match(/^\/auth/)
                && !req.path.match(/\./)) {
                req.session.returnTo = req.originalUrl;
            } else if (req.user
                && (req.path === '/account' || req.path.match(/^\/api/))) {
                req.session.returnTo = req.originalUrl;
            }
            next();
        });
        /**
         * Main routes.
         */
        this.app.use('/employee-manage', employeeRouter);
        this.app.use('/customer-manage', customerRouter);
        this.app.use('/person-manage', personRouter);
        this.app.use(mainRouter);
        this.app.use('/api', apiRouter);
        this.app.use('/auth', authRouter);
    }

    private mongoConfig(): void {
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
        mongoose.set('useNewUrlParser', true);
        mongoose.connect(process.env.MONGODB_URI);
        mongoose.connection.on('error', (err) => {
            console.error(err);
            console.log('%s MongoDB connection error. Please make sure MongoDB is running.', (chalk as any).red('✗'));
            process.exit();
        });
    }
}

export default new App().app;
