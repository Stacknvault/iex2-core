# IEX2 applications

  

IEX2 allows developers use the technology they want to generate expose templates to send real estate items to a given contact.

Developers can leverage the IEX2 components and the *expose* script to develop and publish expose templates.

## Structure of the expose

An expose has *stages*. It represents the lifecycle that the customer goes through when buying real estate. Some sensitive information may be hidden until certain stage and some *sections* will be also available after certain stage.

A *section* is a block that is presented to the user. Examples:

- Provisioning Contract Agreement

- A Hero Banner

- An image carousel

- ...

  

The engine expects two files to exist on the public directory:

- assets/context/config.json

- assets/context/context.json

### config.json

This file includes the configuration of the fields that are available for the entity (*the estate*) at whatever stage:

An example:

```
{
	"includes": [
		{"entityName": "entity", "fieldName": "flowfact_geolocation", "minStage": 1},
		{"entityName": "entity", "fieldName": "addresses", "minStage": 1},
		{"entityName": "entity", "fieldName": "latitude", "minStage": 1},
		{"entityName": "entity", "fieldName": "longitude", "minStage": 1},
		{"entityName": "entity", "fieldName": "id", "minStage": 0},
		{"entityName": "entity", "fieldName": "AnnualNetColdRentActualCommercial", "minStage": 0},
		...
		{"entityName": "entity", "fieldName": "yield_actual", "minStage": 0}
	]
}
```
- The *entity.addresses* field isn't available on de model until stage 1  

When Stage objects are used, like on the example below, the framework controls when to show them depending on the stage:

```
...
<Stage  level="0">
	<ContractAgreement
	theme={theme}
	contracts={ffmap`company.legislationTexts`}
	imgObj={ffmap`entity.mainImage`}/>
</Stage>
<Stage  level="1">
	<WhateverOtherSection/>
	...
</Stage>
```

Functions like *ffmap* help access the data from the context. 
  
# The _expose_ script

## Setting up the environment
The following environment variables need to be set:

 - __TOKEN:__ It's taken from Flowfact, from the *Settings --> API access* menu
 - __REACT_APP_STAGE:__ development|staging|production
 - __PUBLIC_URL__: Must be set to "." due to the way the exposes are going to be consumed by the consumer

Apart from the regular yarn scripts, in the project directory, you can run:

## `yarn run expose help`

  ```
  USAGE:

npm run expose <publish|delete|list|render|set-stage|get-context>  --<option name>=<option value>

For help, run:

npm run expose help

or

npm run expose <command> help
  ```

  
## `yarn run expose publish help`
```
Publishes a template.

USAGE:

npm run expose publish  [ --template-id=<your own template id> ] [ --name="<the name of the template>"] [--global]

If no other args are specified, they will be taken from .lastRun. The only flag not taken from .lastRun will be --global
```

## `yarn run expose delete help`
```
Deletes a template.

USAGE:

npm run expose delete  [ --template-id=<your own template id> ] [--global]

If no other args are specified, they will be taken from .lastRun. The only flag not taken from .lastRun will be --global
```
## `yarn run expose list help`
```
Lists templates.

USAGE:

npm run expose list [--global]

If no other args are specified, they will be taken from .lastRun. The only flag not taken from .lastRun will be --global
```
## `yarn run expose render help`

```
Renders a template for a given contact-id, entity-id and optional company-id.

USAGE:
npm run expose render [--render-id=<your own render id> ] --template-id=<template id> --contact-id=<contact id> --entity-id=<entity id> [ --company-id=<company id> ]

If no other args are specified, they will be taken from .lastRun. The only flag not taken from .lastRun will be --global

If company id is not specified, it will be taken from the sender

A custom render-id can be used.
```

## `yarn run expose set-stage help`
```
Sets the stage of a rendered template

USAGE:

npm run expose set-stage --render-id=<render id> --stage=<stage number starting from 0>

If no other args than the stage are specified, they will be taken from .lastRun. The only flag not taken from .lastRun will be --global
```

## `yarn run expose get-context help`
```
Gets the context for a given contact-id, entity-id and optional company-id and it writes it to public/assets/context/context.json.

USAGE:

npm run expose get-context --contact-id=<contact id> --entity-id=<entity id> --stage=<stage number starting from 0> [ --company-id=<company id> ]

If no other args than the stage are specified, they will be taken from .lastRun. The only flag not taken from .lastRun will be --global

If company id is not specified, it will be taken from the sender
```