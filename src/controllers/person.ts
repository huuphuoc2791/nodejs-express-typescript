import * as faker from 'faker';
import Person from '../models/Person';

export function getListPerson(req: any, res: any) {
    Person.find().exec((err: any, item: any) => {
    });
}

export function generatePerson(req: any, res: any) {
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
        .then((item: any) => {
            console.log('Added 1 person to database', item);
            res.json({status: 'Ok'});
        })
        .catch((err: any) => {
            console.log('Can not add to database');
            res.json({result: err});
        });
}

export function getListPersonApi(req: any, res: any) {
    const {id} = req.query;
    console.log('person|getListPersonApi', id, req.query);
    Person.find().exec((err: any, item: any) => {
        res.json({item});
    });
}

export function getAddPerson(req: any, res: any) {
    res.render('manage-person/add-person', {
        title: 'Add Person',
    });
}

export function postAddPerson(req: any, res: any) {
    console.log('person|postAddPerson Request ', req.body);
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('age', 'Age must be a number').isNumeric();
    req.assert('email', 'Email is not valid').isEmail();
    const errors = req.validationErrors();

    if (errors) {
        console.log('person|postAddPerson', errors);
    }
    const person = new Person({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
    });
    console.log('person|postAddPerson', person);
    person.save()
        .then((person: any) => {
            console.log('Added 1 person to database', person);
        })
        .catch((err: any) => {
            console.log('person|', person, err);
            res.send('unable to save to database', err);
        });
}

export function postRemovePerson(req: any, res: any) {
    const {id} = req.params;

    Person.findOneAndRemove({_id: id}, (err: any, doc: any) => {
        if (doc) {
            console.log('Removed 1 person', doc);
        }
    });
}

export function postUpdatePerson(req: any, res: any) {
    const {id} = req.params;
    const {email, name, age} = req.body;
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('age', 'Age must be a number').isNumeric();
    req.assert('email', 'Email is not valid').isEmail();
    const errors = req.validationErrors();

    if (errors) {
    }
    Person.findOneAndUpdate({_id: id}, {name, email, age}, (err: any, doc: any) => {
        if (doc) {
        } else {
            res.json({status: 'Failed'});
        }
    });
}

export function getUpdatePerson(req: any, res: any) {
    const {id} = req.params;
    Person.findOne({_id: id}).exec((err: any, person: any) => {
        console.log('person-manager', person);
    });
}
