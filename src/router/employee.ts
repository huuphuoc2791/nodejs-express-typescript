import * as employeeController from '../controllers/employee';

const employeeRouter = [
    {
        http_method: 'get',
        url: '/',
        params: [employeeController.getListEmployee],
    },
    {
        http_method: 'get',
        url: '/list',
        params: [employeeController.getListEmployee],
    },
    {
        http_method: 'get',
        url: '/add',
        params: [employeeController.getEmployee],
    },
    {
        http_method: 'post',
        url: '/add',
        params: [employeeController.postAddEmployee],
    },
    {
        http_method: 'get',
        url: '/update/:id',
        params: [employeeController.getUpdateEmployee],
    },
    {
        http_method: 'post',
        url: '/update/:id',
        params: [employeeController.postUpdateEmployee],
    },
    {
        http_method: 'get',
        url: '/remove/:id',
        params: [employeeController.postRemoveEmployee],
    },
    {
        http_method: 'post',
        url: '/generate-employee',
        params: [employeeController.generateEmployee],
    },
];
export default employeeRouter;
