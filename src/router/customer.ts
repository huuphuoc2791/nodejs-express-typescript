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
        url: '/get-customer',
        params: [customerController.getCustomer],
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
        http_method: 'put',
        url: '/update/:id',
        params: [customerController.postUpdateCustomer],
    },
    {
        http_method: 'delete',
        url: '/remove/:id',
        params: [customerController.postRemoveCustomer],
    },
    {
        http_method: 'post',
        url: '/generate',
        params: [customerController.generateCustomer],
    },
];

export default customerRouter;
