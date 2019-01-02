import * as express from 'express';

export function routerFactory(routes: any[]) {
    const router = express.Router();

    routes.forEach((route: any) => {
        (router as any)[route.http_method].call(router, route.url, ...route.params);
    });

    return router;
}
