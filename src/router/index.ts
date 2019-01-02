import {routerFactory} from '../helper/router_factory';

import employee from './employee';
import customer from './customer';

import person from './person';
import main from './main';
// import api from './api';
import auth from './auth';

export const employeeRouter = routerFactory(employee);
export const customerRouter = routerFactory(customer);
export const personRouter = routerFactory(person);
export const mainRouter = routerFactory(main);
// export const apiRouter = routerFactory(api);
export const authRouter = routerFactory(auth);
