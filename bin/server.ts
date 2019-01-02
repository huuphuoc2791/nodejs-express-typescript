/**
 * Module dependencies.
 */
import app from '../src/app';
import * as http from 'http';
import * as debug from 'debug';
import chalk from 'chalk';
import * as errorhandler from 'errorhandler';
import {Response} from 'express';

// binding to console
let log: any = debug('modern-express:server');
log.log = console.log.bind(console);

const server = http.createServer(app);
if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorhandler());
} else {
    app.use((err: any, req: any, res: Response) => {
        res.statusCode = 500;
    });
}
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 6789);
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', (chalk as any).green('✓'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
});

server.on('error', (error: any) => {
    /**
     * Event listener for HTTP server "error" event.
     */
    if (error.syscall !== 'listen') {
        throw error;
    }
});

