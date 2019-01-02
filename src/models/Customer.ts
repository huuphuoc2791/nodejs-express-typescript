export function customerModel(sequelize, type) {
    return sequelize.define('customers', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: type.STRING,
        lastName: type.STRING,
        email: type.STRING,
        phone: type.STRING,
        address: type.STRING,
        city: type.STRING,
        country: type.STRING,
        memberID: type.STRING,
    })
}