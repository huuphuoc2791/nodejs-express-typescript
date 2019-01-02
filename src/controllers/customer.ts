import * as faker from 'faker';
import {Customer} from '../config/sequelize';

export function generateCustomer(req: any, res: any) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email().toLowerCase();
    const phone = faker.phone.phoneNumber();
    const address = faker.address.streetAddress();
    const city = faker.address.city();
    const country = faker.address.country();
    const memberID = faker.finance.account();

    Customer.create({
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        country,
        memberID,
    })
        .then((result: any) => {
            console.log(result.toJSON());
            res.json({status: 'success'});
        })
        .catch((err: any) => {
            console.log('Error', err);
        });
}

export function getListCustomer(req: any, res: any) {
    Customer.findAll({limit: 100}).then((item: any) => {
        return res.json(item);
    });
}

export function getCustomer(req: any, res: any) {
    const {id} = req.params;

    Customer.findOne({
        where: {
            id,
        },
    }).then((customer: any) => {
        res.json({status: 'success', customer});
    }).catch((err: any) => {
        res.statusCode = 304;
        console.log('customer|getCustomer', err);
        res.json({status: 'failed'});
    });
}

export function postAddCustomer(req: any, res: any) {
    const {
        firstName, lastName, email,
        phone, address, city, country, memberID,
    } = req.body;
    req.assert('firstName', 'First Name cannot be blank').notEmpty();
    req.assert('lastName', 'Last Name cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('address', 'Address cannot be blank').notEmpty();
    req.assert('memberID', 'Member ID cannot be blank').notEmpty();
    const errors = req.validationErrors();

    if (errors) {
        console.log('customer|postAddCustomer', errors);
        return res.json({status: 'failed', errors});
    }
    Customer.create({
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        country,
        memberID,
    }).then((customer: any) => {
        console.log(`Created customer has id = ${customer.id} successfully. `);
        res.json({status: 'success', customer});
        // res.redirect('/customer-manage/list');
    }).catch((err: any) => {
        console.log('Error when updating a customer.', err);
        res.json({status: 'error'});
    });
}

export function getUpdateCustomer(req: any, res: any) {
    const {id} = req.params;

    Customer.findOne({
        where: {
            id,
        },
    }).then((customer: any) => {
        res.json({status: 'success', customer});
    }).catch((err: any) => {
        console.log('customer|getUpdate', err);
        res.json({status: 'failed'});
    });
}

export function postUpdateCustomer(req: any, res: any) {
    const {id} = req.params;
    const {
        firstName, lastName, email,
        phone, address, city, country, memberID,
    } = req.body;
    req.assert('firstName', 'First Name cannot be blank').notEmpty();
    req.assert('lastName', 'Last Name cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('address', 'Address cannot be blank').notEmpty();
    req.assert('memberID', 'Member ID cannot be blank').notEmpty();
    const errors = req.validationErrors();

    if (errors) {
        return res.json({status: 'failed', errors});
    }
    Customer.update({
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        country,
        memberID,
    }, {where: {id}}).then((customer: any) => {
        console.log(`Updated customer has id = ${id} successfully. `);
        res.json({status: 'success', customer});
    }).catch((err: any) => {
        console.log('Error when updating a customer.', err);
        res.json({status: 'error'});
    });
}

export function postRemoveCustomer(req: any, res: any) {
    const {id} = req.params;
    Customer.destroy({
        where: {
            id,
        },
    }).then(() => {
        console.log('Removed 1 customer from database has id:', id);
        res.json({status: 'success'});
    }).catch((err: any) => {
        console.log('Error when removing a customer. ', err);
        res.json({status: 'failed'});
    });
}
