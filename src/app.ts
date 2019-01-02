import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as session from 'express-session';
import * as chalk from 'chalk';
import * as lusca from 'lusca';
import * as dotenv from 'dotenv';
import * as MongoStore from 'connect-mongo';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as expressValidator from 'express-validator';
import * as multer from 'multer';
const cors = require('cors');

const upload = multer();
dotenv.load({path: '.env'});
import {
    authRouter,
    customerRouter,
    employeeRouter,
    mainRouter,
    personRouter
} from './router';

class App {
    public app: express.Application;
    public mongoStore = MongoStore(session);

    constructor() {
        this.app = express();
        this.mongoConfig();
        this.config();
    }

    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(upload.any());
        this.app.use(cors());
        this.app.use(logger('dev'));
        this.app.set('views', path.join(__dirname, '..', 'frontend', 'views'));
        this.app.set('view engine', 'pug');
        this.app.use(cookieParser());
        this.app.use(compression());
        this.app.use(expressValidator());
        this.app.use(session({
            resave: true,
            saveUninitialized: true,
            secret: process.env.SESSION_SECRET,
            cookie: {maxAge: 15000000000}, // two weeks in milliseconds
            store: new this.mongoStore({
                url: process.env.MONGODB_URI,
                autoReconnect: true,
            }),
        }));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use((req: any, res: any, next: any) => {
            next();
        });
        this.app.use(lusca.xssProtection(true));
        this.app.disable('x-powered-by');
        this.app.use((req: any, res: any, next: any) => {
            res.locals.user = req.user;
            next();
        });
        this.app.use((req: any, res: any, next: any) => {
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
