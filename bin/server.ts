/**
 * Module dependencies.
 */
import * as app from '../app';
import * as http from 'http';
import * as debug from 'debug';
import chalk from 'chalk';

// binding to console
let log = debug('modern-express:server');
log.log = console.log.bind(console);

/**
 * Get port from environment and store in Express.
 */

function getPort(val) {
    /**
     * Normalize a port into a number, string, or false.
     */
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}

