const faker = require('faker');

exports.create = function(count,datasetName){

    var dataset = Array(count).fill().map(randomContact);
    return dataset;
}

function randomContact(){
    return {
        "firstName": faker.name.firstName(),
        "lastName": faker.name.lastName(),
        "phone": faker.phone.phoneNumber(),
        "email": faker.internet.email()
    };
}