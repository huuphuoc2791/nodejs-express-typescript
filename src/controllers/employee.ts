import * as faker from 'faker';
import {Employee} from '../config/sequelize';

export function generateEmployee(req: any, res: any) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email().toLowerCase();
    const phone = faker.phone.phoneNumber();
    const address = faker.address.streetAddress();
    const city = faker.address.city();
    const country = faker.address.country();
    const memberID = faker.finance.account();

    Employee.create({
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        country,
        memberID,
    }).then((result: any) => {
        console.log(result.toJSON());
        res.json({status: 'success'});
    }).catch((err: any) => {
        console.log('Error', err);
    });
}

export function getListEmployee(req: any, res: any) {
    Employee.findAll({limit: 100}).then((item: any) => {
        return res.json(item);
    });
}

export function getEmployee(req: any, res: any) {
    const {id} = req.params;

    Employee.findOne({
        where: {
            id,
        },
    }).then((employee: any) => {
        res.json({status: 'success', employee});
    }).catch((err: any) => {
        console.log('employee|getEmployee', err);
        res.json({status: 'failed'});
    });
}
export function postAddEmployee(req: any, res: any) {
    const {
        firstName, lastName, email,
        phone, address, city, country, memberID,
    } = req.body;
    req.assert('firstName', 'First Name cannot be blank').notEmpty();
    req.assert('lastName', 'Last Name cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('phone', 'Phone cannot be blank').notEmpty();
    req.assert('address', 'Address cannot be blank').notEmpty();
    req.assert('country', 'Country cannot be blank').notEmpty();
    req.assert('memberID', 'Member ID cannot be blank').notEmpty();
    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/employee-manage/add');
    }
    Employee.create({
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        country,
        memberID,
    }).then((employee: any) => {
        console.log(`Created employee has id = ${employee.id} successfully. `);
    }).catch((err: any) => {
        console.log('Error when updating a employee.', err.errors[0].message);
    });
}

export function getUpdateEmployee(req: any, res: any) {
    const {id} = req.params;

    Employee.findOne({
        where: {
            id,
        },
    }).then((employee: any) => {
        console.log('employee|', employee);
    });
}

export function postUpdateEmployee(req: any, res: any) {
    const {id} = req.params;
    const {
        firstName, lastName, email,
        phone, address, city, country, memberID,
    } = req.body;
    req.assert('firstName', 'First Name cannot be blank').notEmpty();
    req.assert('lastName', 'Last Name cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('phone', 'Phone cannot be blank').notEmpty();
    req.assert('address', 'Address cannot be blank').notEmpty();
    req.assert('country', 'Country cannot be blank').notEmpty();
    req.assert('memberID', 'Member ID cannot be blank').notEmpty();
    const errors = req.validationErrors();

    if (errors) {
    }
    Employee.update({
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        country,
        memberID,
    }, {where: {id}}).then(() => {
        console.log(`Created employee has id = ${id} successfully.`);
    }).catch((err: any) => {
        console.log('Error when updating a employee.', err);
    });
}

export function postRemoveEmployee(req: any, res: any) {
    const {id} = req.params;
    Employee.destroy({
        where: {
            id,
        },
    }).then(() => {
        console.log('Removed 1 employee from database has id:', id);
    }).catch((err: any) => {
        console.log('Error when removing a employee. ', err);
    });
}

