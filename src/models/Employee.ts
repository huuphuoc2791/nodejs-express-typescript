export function employeeModel(sequelize, type) {

    return sequelize.define('employees', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: type.STRING,
        lastName: type.STRING,
        email: {
            type: type.STRING,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        phone: type.STRING,
        address: type.STRING,
        city: type.STRING,
        country: type.STRING,
        memberID: type.STRING,
    })
}