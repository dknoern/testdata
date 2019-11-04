# testdata
Test data service - creates and manages test data sets for Salesforce applications

# Installation

```
npm install
```

## Usage

Use the following syntax to run testctl commands from your terminal window:

```
testctl [command] [TYPE] [NAME] [flags]
```

where `command`, `TYPE`, `NAME`, and `flags` are:

* `command`: Specifies the operation that you want to perform on one or more resources, 
for example `create`, `get`, `describe`, `delete`.

* `TYPE`:   Specifies the resource type. For example: `dataset`, `environment`

* `NAME`: Specifies the name of the resource. Names are case-sensitive. 
If the name is omitted, details for all resources are displayed, for example `testctl get dataset`.

* `flags`: Specifies optional flags. For example, you can use the -c or --count flags to specify the number of 
test data records to create.
