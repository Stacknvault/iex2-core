const axios = require('axios');
const rootUrl = 'https://4fkovo7dbc.execute-api.eu-central-1.amazonaws.com';
const fs = require('fs');
const publish = (templateId, onComplete, onError) => {

    const stream = fs.createReadStream(__dirname + '/../tmp/template.zip');
    stream.on('error', console.log);
    axios({
        method: templateId?'POST':'PUT',
        url: templateId ? (rootUrl + '/template/'+templateId):(rootUrl + '/template'),
        headers: {
          'Content-Type': 'application/zip',
        //   'Content-Length': size,
          'token': process.env.TOKEN
        },
        data: stream
      })
      .then(res => { // then print response status
        console.log(res.statusText)
        if (res.status!==200){
            onError(res.statusCode, 'Error fetching item')
            return;
        }
        onComplete(res.data);            
     });

}
const packageAndPublish=(templateId)=>{
  var fs = require('fs');
  var archiver = require('archiver');
  fs.mkdir(__dirname + '/../tmp', ()=>{});
  var output = fs.createWriteStream(__dirname + '/../tmp/template.zip');
  var archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });
  output.on('close', function() {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
      //now let's publish it
      publish(templateId, (result)=>console.log(JSON.stringify(result)), (errorCode, message)=>console.log('Error', errorCode, message));
  });

  output.on('end', function() {
      console.log('Data has been drained');
  });

  archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
      // log warning
  } else {
      // throw error
      throw err;
  }
  });
  archive.on('error', function(err) {
      throw err;
  });
  archive.pipe(output);
  archive.directory(__dirname + '/../build/', false);

  archive.finalize();
}

const render = (templateId, renderId, contactId, entityId, companyId, onComplete, onError) => {
  console.log(rootUrl + '/template/'+templateId+'/render?contactId='+contactId+'&entityId='+entityId+(companyId?'&companyId='+companyId:'')+(renderId?'&renderId='+renderId:''));
  axios({
      method: 'POST',
      url: rootUrl + '/template/'+templateId+'/render?contactId='+contactId+'&entityId='+entityId+(companyId?'&companyId='+companyId:'')+(renderId?'&renderId='+renderId:''),
      headers: {
      //   'Content-Length': size,
        'token': process.env.TOKEN
      }
    })
    .then(res => { // then print response status
      console.log(res.statusText)
      if (res.status!==200){
          onError(res.statusCode, 'Error fetching item')
          return;
      }
      onComplete(res.data);            
   });

}

const setStage = (renderId, stage, onComplete, onError) => {
  axios({
      method: 'POST',
      url: rootUrl + '/expose/'+renderId+'/set-stage/'+stage,
      headers: {
      //   'Content-Length': size,
        'token': process.env.TOKEN
      }
    })
    .then(res => { // then print response status
      console.log(res.statusText)
      if (res.status!==200){
          onError(res.statusCode, 'Error fetching item')
          return;
      }
      onComplete(res.data);            
   });

}

const getContext = (contactId, entityId, companyId, onComplete, onError) => {
  const url=rootUrl + '/template/context?contactId='+contactId+'&entityId='+entityId+(companyId?'&companyId='+companyId:'');
  console.log(url);
  axios({
      method: 'GET',
      url: url,
      headers: {
      //   'Content-Length': size,
        'token': process.env.TOKEN
      }
    })
    .then(res => { // then print response status
      if (res.status!==200){
          onError(res.statusCode, 'Error fetching item')
          return;
      }
      onComplete(res.data);            
   });

}

const usage=()=>{
  console.log('\nUSAGE:\nnpm run expose -- <publish|render|set-stage|get-context>  -<option name>=<option value>');
  console.log('\nFor help, run:');
  console.log('npm run expose -- help');
  console.log('\nor');
  console.log('npm run expose -- <command> help\n\n');
}
const usagePublish=()=>{
  console.log('\nPublishes a template.\n\nUSAGE:\nnpm run expose -- publish  [ -template-id=<your own template id> ]\n\n');
  console.log('A custom template-id can be used.\n\n');
}
const usageRender=()=>{
  console.log('\nRenders a template for a given contact-id, entity-id and optional company-id.\n\nUSAGE:\nnpm run expose -- render [--render-id=<your own render id> ] --template-id=<template id> --contact-id=<contact id> --entity-id=<entity id> [ --company-id=<company id> ]\n\n');
  console.log('If company id is not specified, it will be taken from the sender\n\n');
  console.log('A custom render-id can be used.\n\n');
}
const usageSetStage=()=>{
  console.log('\nSets the stage of a rendered template\n\nUSAGE:\nnpm run expose -- set-stage --render-id=<render id> --stage=<stage number starting from 0>\n\n');
}
const usageGetContext=()=>{
  console.log('\nGets the context for a given contact-id, entity-id and optional company-id and it writes it to public/assets/context/context.json.\n\nUSAGE:\nnpm run expose -- get-context --contact-id=<contact id> --entity-id=<entity id> --stage=<stage number starting from 0> [ --company-id=<company id> ]\n\n');
  console.log('If company id is not specified, it will be taken from the sender\n\n');
}


// console.log('Packaging template', process.argv);
const args = require('minimist')(process.argv.slice(2));
if (!process.env.TOKEN){
  console.error('TOKEN environment variable is missing');
  return;
}
if (args._.length===0){
  console.error('Command is missing');
  usage();
}
const command=args._[0];

//console.log("The command is "+cmd);
if (command === 'publish'){
  if (args._[1]==='help'){
    usagePublish();
    return;
  }
  const templateId=args['template-id'];
  if (!templateId){
    console.error('template-id missing. Will make one up');
  }
  packageAndPublish(templateId);
}else if (command === 'render'){
  if (args._[1]==='help'){
    usageRender();
    return;
  }
  const templateId=args['template-id'];
  const contactId=args['contact-id'];
  const entityId=args['entity-id'];
  const companyId=args['company-id'];
  const renderId=args['render-id'];
  if (!templateId){
    console.error('template-id missing');
    return;
  }
  if (!contactId){
    console.error('contact-id missing');
    return;
  }
  if (!entityId){
    console.error('entity-id missing');
    return;
  }
  if (!renderId){
    console.error('render-id missing. Will make one up');
  }
  if (!companyId){
    console.log('company-id missing, will get it from sender');
  }
  render(templateId, renderId, contactId, entityId, companyId, (data)=>console.log(JSON.stringify(data, null, 2)), (errorCode, message)=>console.log('Error', errorCode, message));
}else if (command === 'set-stage'){
  if (args._[1]==='help'){
    usageSetStage();
    return;
  }
  const renderId=args['render-id'];
  if (!renderId){
    console.error('render-id missing');
    return;
  }
  const stage=args.stage;
  if (!stage && stage!==0){
    console.error('stage missing');
    return;
  }
  setStage(renderId, stage, (data)=>console.log(JSON.stringify(data, null, 2)), (errorCode, message)=>console.log('Error', errorCode, message))
}else if (command === 'get-context'){
  if (args._[1]==='help'){
    usageGetContext();
    return;
  }
  const contactId=args['contact-id'];
  const entityId=args['entity-id'];
  const companyId=args['company-id'];
  if (!contactId){
    console.error('contact-id missing');
    return;
  }
  if (!entityId){
    console.error('entity-id missing');
    return;
  }
  if (!companyId){
    console.log('company-id missing, will get it from sender');
  }
  const stage=args.stage;
  if (!stage && stage!==0){
    console.error('stage missing');
    return;
  }
  getContext(contactId, entityId, companyId, (data)=>{
    data.currentStage=stage;
    // console.log(JSON.stringify(data, null, 2));
    // return;
    const path='public/assets/context/context.json';
    if (fs.existsSync(path)){
      fs.unlinkSync(path)
    }
    fs.writeFile(path, JSON.stringify(data, null, 2), function (err) {
      if (err){
        console.log(err);
        return;
      }
      console.log('Context written to '+path);
    });
  }, (errorCode, message)=>console.log('Error', errorCode, message));
}else if (command === 'help'){
  usage();
}else{
  console.error('Unknown command '+command);
  usage();
}

  


//curl -v -XPUT -H 'token: 5bdebf38-753b-42fe-9a52-cbca55446014' -H"content-type: application/zip" --data-binary @package2.zip 'https://4fkovo7dbc.execute-api.eu-central-1.amazonaws.com/template/publish'