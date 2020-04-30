This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# The _expose_ script

Apart from the regular yarn scripts, in the project directory, you can run:

## `yarn run expose -- help`
>
>__USAGE__:
>`yarn run expose -- <publish|render|set-stage|get-context>  -<option name>=<option value>`
>
>For help, run:
>
>`yarn run expose -- help`
>
>or
>
>`yarn run expose -- <command> help`
>
## `yarn run expose -- publish help`
>
>Publishes a template.
>
>__USAGE__:
>`yarn run expose -- publish  [ -template-id=<your own template id> ]`
>
>A custom template-id can be used.
>
## `yarn run expose -- render help`
>
>Renders a template for a given contact-id, entity-id and optional company-id.
>
>__USAGE__:
>`yarn run expose -- render [--render-id=<your own render id> ] --template-id=<template id> --contact-id=<contact id> --entity-id=<entity id> [ --company-id=<company id> ]`
>
>If company id is not specified, it will be taken from the sender
>
>A custom render-id can be used.
>
## `yarn run expose -- set-stage help`
>
Sets the stage of a rendered template
>
>__USAGE__:
>`yarn run expose -- set-stage --render-id=<render id> --stage=<stage number starting from 0>`
>
## `yarn run expose -- get-context help`
>
>Gets the context for a given contact-id, entity-id and optional company-id and it writes it to public/assets/context/context.json.
>
>__USAGE__:
>`yarn run expose -- get-context --contact-id=<contact id> --entity-id=<entity id> --stage=<stage number starting from 0> [ --company-id=<company id> ]`
>
>If company id is not specified, it will be taken from the sender
