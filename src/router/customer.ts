import * as customerController from '../controllers/customer';

const customerRouter = [
    {
        http_method: 'get',
        url: '/',
        params: [customerController.getListCustomer],
    },
    {
        http_method: 'get',
        url: '/list',
        params: [customerController.getListCustomer],
    },
    {
        http_method: 'get',
        url: '/add',
        params: [customerController.getAddCustomer],
    },
    {
        http_method: 'post',
        url: '/add',
        params: [customerController.postAddCustomer],
    },
    {
        http_method: 'get',
        url: '/update/:id',
        params: [customerController.getUpdateCustomer],
    },
    {
        http_method: 'post',
        url: '/update/:id',
        params: [customerController.postUpdateCustomer],
    },
    {
        http_method: 'get',
        url: '/remove/:id',
        params: [customerController.postRemoveCustomer],
    },
    {
        http_method: 'post',
        url: '/generate-customer',
        params: [customerController.generateCustomer],
    },
];

export default customerRouter;
