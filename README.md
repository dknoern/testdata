# testdata
Test data service - creates and manages test data sets for Salesforce applications

# Installation

```
npm install
```

## Usage

Use the following syntax to run testctl commands from your terminal window:

```
node testctl.js  [command] [TYPE] [NAME] [flags]
```

where `command`, `TYPE`, `NAME`, and `flags` are:

* `command`: Specifies the operation that you want to perform on one or more resources, 
for example `create`, `get`, `delete`, `push`.

* `TYPE`:   Specifies the resource type. For example: `dataset`, `environment`

* `NAME`: Specifies the name of the resource. Names are case-sensitive. 
If the name is omitted, details for all resources are displayed, for example `testctl get dataset`.

* `flags`: Specifies optional flags. For example, you can use the -c or --count flags to specify the number of 
test data records to create.


## Create an environment

Copy the file `evironment.json.sample` to `environment.json` and fill in credentials for your salesforce environment.

For example:

```
{
    instance: 'https://na174.salesforce.com',
    client_id: '3MVG9LCJsApeX_PD3xIQFoGio_wU3QqhLi3wzUwbZbmvD6Ujv1nQUg1roWmUYZAF2Kq3joOi6IhxJSCmm5ydg',
    client_secret: 'D5286E3760C2675FEBDE7EA0684A046E19FAD318754ECF940B33007224C0EFC2',
    username: 'user@domain.com',
    password: 'zzzNxZ2R28TYZJzetbMKmHkfCiXVu0WnVagX0HDX6MRw6WkRX'
}
```

Import the environment, specifying name:

`node testctl.js  create environment -f ./environment.json`


## Get list of environments

To list all configured environments, type:

`node testctl.js  get environment`

The output will be something like:

```
NAME       INSTANCE                      CLIENT_ID          USENAME
dktest     https://na174.salesforce.com  3MVG9LBJLApeX...   david@seattleweb.com
bro        https://na174.salesforce.com  3MVG9LBJLApeX...   foo@seattleweb.com
```

## Create a new dataset

A new dataset can be created and saved to the database as follows:

`node testctl.js create dataset <NAME>`

Output will be something like:

```
Saved 10 contacts to database.
```

## Push dataset to environment

Once saved, the dataset can be pushed to a salesforce.  

`node testctl.js push dataset <DATASET> <ENVIRONMENT>`

The output will be:

```
Pushed 10 contacts from datbase to salesforce.
```

## Purge data from an environment

To purge data from an environment, type:

`node testctl.js purge environment <ENVIRONMENT>`

You should see output like:

```
Environment test1 purged.
```
