const axios = require('axios');
const qs = require('querystring');

const formHeaders = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}

exports.createContact = function (environment, contactData) {
    console.log("creating contact in salesforce for " + contactData.firstName + " " + contactData.lastName);

    axios.post(environment.instance +'/services/oauth2/token', loginFormData(environment), formHeaders)
        .then(response => {
            console.log('instance_url: ' + response.data.instance_url);
            console.log('access_token: ' + response.data.access_token);

            const authHeader =
            {
                headers: {
                    'Authorization': 'Bearer ' + response.data.access_token,
                    'Content-Type': 'application/json'
                }
            }

            var postBody = {
                "FirstName": contactData.firstName,
                "LastName": contactData.lastName,
                "Phone": contactData.phone,
                "Email": contactData.email,
            }

            var createContactUrl = environment.instance + '/services/data/v20.0/sobjects/Contact/';

            axios.post(createContactUrl, postBody, authHeader)
                .then(response => {
                    console.log('response: ' + JSON.stringify(response.data));
                });
        })
        .catch(error => {
            console.log(error);
        });
}


exports.purge = function (environment) {

    axios.post(environment.instance +'/services/oauth2/token', loginFormData(environment), loginFormData)
        .then(response => {
            var access_token = response.data.access_token;
            axios.get(environment.instance + '/services/data/v20.0/query?q=SELECT+name+from+Contact', {
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            }).then(response => {
                response.data.records.map(x => {

                    axios.delete(environment.instance + x.attributes.url, {
                        headers: {
                            'Authorization': 'Bearer ' + access_token
                        }
                    }).then(response => {
                        console.log('deleted record ' + x.attributes.url);
                    }).catch(error => {
                        console.log("can't delete record " + x.attributes.url + ", may be in use");
                    });
                }
                );
            });
        }).then(console.log("environment test1 purged"))
        .catch(error => {
            console.log(error);
        });
}


function loginFormData(environment){
    return qs.stringify({
        grant_type: 'password',
        client_id: environment.client_id,
        client_secret: environment.client_secret,
        username: environment.username,
        password: environment.password
    });
}


