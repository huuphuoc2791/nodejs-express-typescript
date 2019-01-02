import * as express from 'express';

export function routerFactory(routes) {
    const router = express.Router();

    routes.forEach((route) => {
        router[route.http_method].call(router, route.url, ...route.params);
    });

    return router;
}
