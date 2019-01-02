import faker from 'faker';
import Person from '../models/Person';

export function getListPerson(req, res) {
    Person.find().exec((err, item) => {
        res.render('manage-person/list-person', {item});
    });
}

export function generatePerson(req, res) {
    const randomName = faker.name.findName(); // Rowan Nikolaus
    const randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
    let randomAge = Math.random() * 60 | 0;
    if (randomAge < 20) {
        randomAge += 20;
    }
    const person = new Person({
        name: randomName,
        email: randomEmail,
        age: randomAge,
    });
    person.save()
        .then((item) => {
            console.log('Added 1 person to database', item);
            res.json({status: 'Ok'});
        })
        .catch((err) => {
            console.log('Can not add to database');
            res.json({result: err});
        });
}

export function getListPersonApi(req, res) {
    const {id} = req.query;
    console.log('person|getListPersonApi', id, req.query);
    Person.find().exec((err, item) => {
        res.json({item});
    });
}

export function getAddPerson(req, res) {
    res.render('manage-person/add-person', {
        title: 'Add Person',
    });
}

export function postAddPerson(req, res) {
    console.log('person|postAddPerson Request ', req.body);
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('age', 'Age must be a number').isNumeric();
    req.assert('email', 'Email is not valid').isEmail();
    const errors = req.validationErrors();

    if (errors) {
        console.log('person|postAddPerson', errors);
        req.flash('errors', errors);
        return res.redirect('/person-manage/add');
    }
    const person = new Person({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
    });
    console.log('person|postAddPerson', person);
    person.save()
        .then((person) => {
            console.log('Added 1 person to database', person);
            req.flash('success', {msg: 'Added 1 person to database successfully.'});
            res.redirect('/person-manage');
        })
        .catch((err) => {
            console.log('person|', person, err);
            res.status(400).send('unable to save to database', err);
        });
}

export function postRemovePerson(req, res) {
    const {id} = req.params;

    Person.findOneAndRemove({_id: id}, (err, doc) => {
        if (doc) {
            console.log('Removed 1 person', doc);
            res.redirect('/person-manage');
        }
    });
}

export function postUpdatePerson(req, res) {
    const {id} = req.params;
    const {email, name, age} = req.body;
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('age', 'Age must be a number').isNumeric();
    req.assert('email', 'Email is not valid').isEmail();
    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect(`/person-manage/update/${id}`);
    }
    Person.findOneAndUpdate({_id: id}, {name, email, age}, (err, doc) => {
        if (doc) {
            req.flash('success', {msg: 'Updated 1 person to database successfully.'});
            res.redirect('/person-manage');
        } else {
            res.json({status: 'Failed'});
        }
    });
}

export function getUpdatePerson(req, res) {
    const {id} = req.params;
    Person.findOne({_id: id}).exec((err, person) => {
        console.log('person-manager', person);
        res.render('manage-person/update-person', {person});
    });
}
