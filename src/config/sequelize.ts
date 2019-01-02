import * as Sequelize from 'sequelize';
import {customerModel} from '../models/Customer';
import {employeeModel} from '../models/Employee';

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD, {
        dialect: 'mysql',
        host: process.env.MYSQL_HOST,
        port: parseInt(process.env.MYSQL_PORT),
        operatorsAliases: false,
    });
sequelize.sync()
    .then(() => {
        console.log('Database & tables created!');
    });
export const Customer = customerModel(sequelize, Sequelize);
export const Employee = employeeModel(sequelize, Sequelize);


