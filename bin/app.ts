
import * as app from '../frontend/index';
import chalk from 'chalk';


app.set('host', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');
app.set('port', process.env.PORT_FRONTEND || process.env.OPENSHIFT_NODEJS_PORT || 8080);
/**
 * Create HTTP server.
 */

/**
 * Listen on provided port, on all network interfaces.
 */
app.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
});