import faker from 'faker';
import {Employee} from '../config/sequelize';

export function generateEmployee(req, res) {
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
    })
        .then((result) => {
            console.log(result.toJSON());
            res.json({status: 'success'});
        })
        .catch((err) => {
            console.log('Error', err);
        });
}

export function getListEmployee(req, res) {
    Employee.findAll({limit: 100}).then((item) => {
        // projects will be an array of Project instances with the specified name
        if (item.length > 0) {
            res.render('employee/list-employee', {item});
        } else {
            res.render('common/empty-employee-list');
        }
    });
}

export function getListEmployeeApi(req, res) {
    Employee.findAll({limit: 100}).then((item) => {
        // projects will be an array of Project instances with the specified name
        res.json(item);
    });
}

export function getAddEmployee(req, res) {
    res.render('employee/add-employee');
}

export function postAddEmployee(req, res) {
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
    }).then((employee) => {
        console.log(`Created employee has id = ${employee.id} successfully. `);
        res.redirect('/employee-manage/list');
    }).catch((err) => {
        console.log('Error when updating a employee.', err.errors[0].message);

        req.flash('errors', {msg: err.errors[0].message});
        res.redirect('/employee-manage/add');
    });
}

export function getUpdateEmployee(req, res) {
    const {id} = req.params;

    Employee.findOne({
        where: {
            id,
        },
    }).then((employee) => {
        console.log('employee|', employee);
        res.render('employee/update-employee', {employee});
    });
}

export function postUpdateEmployee(req, res) {
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
        req.flash('errors', errors);
        return res.redirect(`/employee-manage/update/${id}`);
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
        res.redirect('/employee-manage/list');
    }).catch((err) => {
        console.log('Error when updating a employee.', err);
    });
}

export function postRemoveEmployee(req, res) {
    const {id} = req.params;
    Employee.destroy({
        where: {
            id,
        },
    }).then(() => {
        console.log('Removed 1 employee from database has id:', id);
        res.redirect('/employee-manage/list');
    }).catch((err) => {
        console.log('Error when removing a employee. ', err);
    });
}
