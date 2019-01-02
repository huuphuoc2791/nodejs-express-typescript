import * as personController from '../controllers/person';

const personRouter = [
    {
        http_method: 'get',
        url: '/',
        params: [personController.getListPerson],
    },
    {
        http_method: 'get',
        url: '/list',
        params: [personController.getListPerson],
    },
    {
        http_method: 'get',
        url: '/api',
        params: [personController.getListPersonApi],
    },
    {
        http_method: 'get',
        url: '/add',
        params: [personController.getAddPerson],
    },
    {
        http_method: 'post',
        url: '/add',
        params: [personController.postAddPerson],
    },
    {
        http_method: 'get',
        url: '/update/:id',
        params: [personController.getUpdatePerson],
    },
    {
        http_method: 'post',
        url: '/update/:id',
        params: [personController.postUpdatePerson],
    },
    {
        http_method: 'get',
        url: '/remove/:id',
        params: [personController.postRemovePerson],
    },
    {
        http_method: 'get',
        url: '/generate-person',
        params: [personController.generatePerson],
    },
];
export default personRouter;
