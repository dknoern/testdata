var dataset = require('./dataset.js');
var database = require('./database.js');
var salesforce = require('./salesforce.js');

processArgs();

function processArgs() {
    var myArgs = process.argv.slice(2);

    var command = myArgs[0];
    var type = myArgs[1];
    var name = myArgs[2] || getRandomString();

    switch (command) {
        case 'create':
            switch (type) {
                case 'dataset':
                    var docs = dataset.create(10, name);
                    database.saveContacts(name, docs);

                    break;
                case 'environment':
                    if (myArgs[3] != "-f" || myArgs[4] == null) {
                        console.log("Error: syntax should be 'create environment <NAME> -f <FILE.JSON>");
                        process.exit(1);
                    }
                    var credentials = require(myArgs[4]);
                    credentials.name = name;
                    database.createEnvironment(credentials);
                    break;


                default:
                    console.log('Error: you must specify the type of resource to create, either \"dataset\" or \"environment\".');
                    process.exit(1);
            }
            break;
        case 'get':

            switch (type) {
                case 'dataset':
                        database.getDatasets();
                    break;
                case 'environment':

                    database.getEnvironments();
                    break;
                default:
                    console.log('Error: you must specify the type of resource to get, either \"dataset\" or \"environment\".');
                    process.exit(1);
            }
            break;


        case 'describe':

            switch (type) {
                case 'dataset':
                        database.describeDataset(name);
                    break;
                case 'environment':
    
                    //database.getEnvironments();
                    break;
                default:
                    console.log('Error: you must specify the type of resource to get, either \"dataset\" or \"environment\".');
                    process.exit(1);
            }
            break;
    


        case 'push':
            var destination = myArgs[3];
            if (destination == null) {
                console.log("Error: syntax should be 'push dataset <NAME> <ENVIRONMENT>");
                process.exit(1);
            }
            database.push(name, destination);
            break;

        case 'delete':
            switch (type) {
                case 'dataset':
                    console.log('deleting dataset named ' + name);
                    break;
                case 'environment':
                    console.log('deleting environment named ' + name);
                    break;
                default:
                    console.log('Error: you must specify the type of resource to delete, either \"dataset\" or \"environment\".');
                    process.exit(1);
            }
            break;

        case 'purge':
            switch (type) {
                case 'environment':
                    console.log('Purging environment ' + name + '.');
                    database.purge(name);
                    break;
                default:
                    console.log('Error: you must specify the type of resource to delete, only \"environment\".');
                    process.exit(1);
            }
            break;

        default:
            console.log('Error: unknown command \"' + command + '\"');
    }
}

function getRandomString() {
    return Math.random().toString(36).substring(2, 15);
};
