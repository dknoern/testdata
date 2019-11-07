var mongoose = require('mongoose');
var faker = require('faker');
var salesforce = require('./salesforce.js');

var mongoUri = 'mongodb://localhost/testdata';
var mongoOpts = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true };

var environmentSchema = new mongoose.Schema({
    name: String,
    instance: String,
    client_id: String,
    client_secret: String,
    username: String,
    password: String
});

environmentSchema.index({ name: 1 }, { unique: true });

var Environment = mongoose.model('Environment', environmentSchema);

var contactSchema = new mongoose.Schema({
    dataset: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String
});

var Contact = mongoose.model('Contact', contactSchema);

exports.getEnvironments = async function () {
    mongoose.connect(mongoUri, mongoOpts);

    Environment.find({}, function (err, docs) {

        if (docs.length == 0) {
            console.log("No environments found.");
        } else {

            console.log("NAME       INSTANCE                      CLIENT_ID          USENAME");
            docs.map(doc => {
                console.log(doc.name.padEnd(10) + " " + doc.instance + "  " + abbreviate(doc.client_id) + "   " + doc.username);
            });
        }

        mongoose.connection.close();
        if (err) return console.error(err);
    });
}


exports.getDatasets = async function () {
    mongoose.connect(mongoUri, mongoOpts);


    Contact.find().distinct('dataset', function (err, names) {

        if (names.length == 0) {
            console.log("No datasets found.");
        } else {

            console.log("NAME");

            names.map(name => {
                console.log(name);
            });
        }

        mongoose.connection.close();
        if (err) return console.error(err);
    });
}


exports.createEnvironment = function (data) {
    mongoose.connect(mongoUri, mongoOpts);
    var environment = new Environment(data);

    environment.save(function (err, doc) {
        mongoose.connection.close();
        if (err) {
            if (err.code == 11000) {
                console.log("Error: environment named \"" + environment.name + "\" already exists.");
            } else {
                console.log(err.errmsg);
            }
            return;
        } else {
            console.log("Environment named \"" + environment.name + "\" created.");
        }
    });
}


exports.createDataset = function (datasetName) {

    var array = Array(10).fill().map(randomContact);

    mongoose.connect(mongoUri, mongoOpts);

    // add dataset name
    array.map(c => { c.dataset = datasetName });

    Contact.create(array, function (err, array) {
        mongoose.connection.close();
        console.log("Saved " + array.length + " contacts for dataset " + datasetName + " to database.")
        if (err)
            console.log('error: ' + err);
    });
}


exports.push = async function (datasetName, envName) {
    mongoose.connect(mongoUri, mongoOpts);

    Environment.findOne({ "name": envName }, function (error, env) {

        if (env == null) {
            console.log("Environment " + envName + " not found.");
            mongoose.connection.close();
            process.exit(1);
        } else {
            Contact.find({}, function (err, docs) {

                if (docs.length == 0) {
                    console.log("No contacts found.");
                } else {
                    docs.map(doc => salesforce.createContact(env, doc));
                }

                mongoose.connection.close();
                if (err) {
                    console.log("error " + err);
                    return console.error(err);
                }
            });
        }
    });
};


exports.describeDataset = async function (datasetName) {
    mongoose.connect(mongoUri, mongoOpts);

    Contact.find({ dataset: datasetName }, function (err, docs) {

        if (docs.length == 0) {
            console.log("No dataset named " + datasetName + " found.");
        } else {
            console.log("NAME                 PHONE                  EMAIL");
            docs.map(doc => {
                var fullName = doc.firstName + " " + doc.lastName;
                console.log(fullName.padEnd(20) + " " + doc.phone.padEnd(22) + " " + doc.email);
            });
        }
        mongoose.connection.close();
        if (err) {
            console.log("error " + err);
            return console.error(err);
        }
    });
};


exports.describeEnvironment = async function (environmentName) {
    mongoose.connect(mongoUri, mongoOpts);

    Environment.findOne({ name: environmentName }, function (err, doc) {

        if (doc == null) {
            console.log("No environment named " + environmentName + " found.");
        } else {
            console.log("ENVIRONMENT   : " + doc.name);
            console.log("INSTANCE      : " + doc.instance);
            console.log("CLIENT_ID     : " + doc.client_id);
            console.log("CLIENT_SECRET : " + doc.client_secret);
            console.log("USERNAME      : " + doc.username);
            console.log("PASSWORD      : " + doc.password);
        }

        mongoose.connection.close();
        if (err) {
            console.log("error " + err);
            return console.error(err);
        }
    });
};


exports.deleteEnvironment = async function (environmentName) {
    mongoose.connect(mongoUri, mongoOpts);

    Environment.deleteMany({ name: environmentName }, function (err, doc) {
        console.log("Environment " + environmentName + " deleted.");
        mongoose.connection.close();
        if (err) {
            console.log("error " + err);
            return console.error(err);
        }
    });
};


exports.deleteDataset = async function (datasetName) {
    mongoose.connect(mongoUri, mongoOpts);

    Contact.deleteMany({ dataset: datasetName }, function (err, doc) {
        console.log("Dataset " + datasetName + " deleted.");
        mongoose.connection.close();
        if (err) {
            console.log("error " + err);
            return console.error(err);
        }
    });
};


exports.purge = function (envName) {
    mongoose.connect(mongoUri, mongoOpts);

    Environment.findOne({ "name": envName }, function (error, env) {

        if (env == null) {
            console.log("environment " + envName + " not found");
            mongoose.connection.close();
            process.exit(1);
        } else {

            mongoose.connection.close();
            salesforce.purge(env);

        }

    });
};


// MISC FUNCTIONS

function randomContact(datasetName) {
    return {
        "firstName": faker.name.firstName(),
        "lastName": faker.name.lastName(),
        "phone": faker.phone.phoneNumber(),
        "email": faker.internet.email()
    };
}

function abbreviate(s, max) {
    if (s == null) s = "";
    var max = 16;

    if (s.length > max - 3) {
        s = s.substring(0, max - 3) + '...';
    }
    s.padEnd(max);
    return s;
}