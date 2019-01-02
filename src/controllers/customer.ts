import faker from 'faker';
import {Customer} from '../config/sequelize';

export function generateCustomer (req, res) {
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
        .then((result) => {
            console.log(result.toJSON());
            res.json({status: 'success'});
        })
        .catch((err) => {
            console.log('Error', err);
        });
}

export function getListCustomer (req, res) {
    Customer.findAll({limit: 100}).then((item) => {
        // projects will be an array of Project instances with the specified name
        if (item.length > 0) {
            res.render('customer/list-customer', {item});
        } else {
            res.render('common/empty-customer-list');
        }
    });
}

export function getAddCustomer (req, res) {
    res.render('customer/add-customer');
}

export function postAddCustomer (req, res) {
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
        return res.redirect('/customer-manage/add');
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
    }).then((customer) => {
        console.log(`Created customer has id = ${customer.id} successfully. `);
        res.redirect('/customer-manage/list');
    }).catch((err) => {
        console.log('Error when updating a customer.', err);
    });
}

export function getUpdateCustomer (req, res) {
    const {id} = req.params;

    Customer.findOne({
        where: {
            id,
        },
    }).then((customer) => {
        console.log('customer|', customer);
        res.render('customer/update-customer', {customer});
    });
}

export function postUpdateCustomer (req, res) {
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
        return res.redirect(`/customer-manage/update/${id}`);
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
    }, {where: {id}}).then(() => {
        console.log(`Created customer has id = ${id} successfully.`);
        res.redirect('/customer-manage/list');
    }).catch((err) => {
        console.log('Error when updating a customer.', err);
    });
}

export function postRemoveCustomer (req, res) {
    const {id} = req.params;
    Customer.destroy({
        where: {
            id,
        },
    }).then(() => {
        console.log('Removed 1 customer from database has id:', id);
        res.redirect('/customer-manage/list');
    }).catch((err) => {
        console.log('Error when removing a customer. ', err);
    });
}
