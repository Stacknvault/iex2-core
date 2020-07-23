const axios = require('axios');
const rootUrl = 'https://4fkovo7dbc.execute-api.eu-central-1.amazonaws.com';
const fs = require('fs');

// const open = require('open');
const openBrowser = require('react-dev-utils/openBrowser');


const contextPath='public/assets/context/context.json';
const lastRunFile='.lastRun';

const updateLastRunFile=(args)=>{
  if (fs.existsSync(lastRunFile)){
    fs.unlinkSync(lastRunFile)
  }
  fs.writeFileSync(lastRunFile, JSON.stringify(args, null, 2))  
}
const writeContext = (data)=>{
  if (fs.existsSync(contextPath)){
    fs.unlinkSync(contextPath)
  }
  fs.writeFile(contextPath, JSON.stringify(data, null, 2), function (err) {
    if (err){
      console.log(err);
      return;
    }
    console.log('Context written to '+contextPath);
  });
}
const publish = (templateId, name, onComplete, onError) => {

    const stream = fs.createReadStream(process.env.INIT_CWD + '/tmp/template.zip');
    stream.on('error', console.log);
    axios({
        method: templateId?'POST':'PUT',
        url: templateId ? (rootUrl + '/template/'+templateId+'?name='+name):(rootUrl + '/template?name='+name),
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
const packageAndPublish=(templateId, name)=>{
  var fs = require('fs');
  var archiver = require('archiver');
  fs.mkdir(process.env.INIT_CWD + '/tmp', ()=>{});
  var output = fs.createWriteStream(process.env.INIT_CWD + '/tmp/template.zip');
  var archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });
  output.on('close', function() {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
      //now let's publish it
      publish(templateId, name, (result)=>console.log(JSON.stringify(result)), (errorCode, message)=>console.log('Error', errorCode, message));
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
  archive.directory(process.env.INIT_CWD + '/build/', false);

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
  console.log('\nUSAGE:\nnpm run expose -- <publish|render|set-stage|get-context>  --<option name>=<option value>');
  console.log('\nFor help, run:');
  console.log('npm run expose -- help');
  console.log('\nor');
  console.log('npm run expose -- <command> help\n\n');
}
const usagePublish=()=>{
  console.log('\nPublishes a template.\n\nUSAGE:\nnpm run expose -- publish  [ --template-id=<your own template id> ] [ --name="<the name of the template>"]\n\n');
  console.log('If no other args are specified, they will be taken from '+lastRunFile+'\n\n');
}
const usageRender=()=>{
  console.log('\nRenders a template for a given contact-id, entity-id and optional company-id.\n\nUSAGE:\nnpm run expose -- render [--render-id=<your own render id> ] --template-id=<template id> --contact-id=<contact id> --entity-id=<entity id> [ --company-id=<company id> ]\n\n');
  console.log('If no other args are specified, they will be taken from '+lastRunFile+'\n\n');
  console.log('If company id is not specified, it will be taken from the sender\n\n');
  console.log('A custom render-id can be used.\n\n');
}
const usageSetStage=()=>{
  console.log('\nSets the stage of a rendered template\n\nUSAGE:\nnpm run expose -- set-stage --render-id=<render id> --stage=<stage number starting from 0>\n\n');
  console.log('If no other args than the stage are specified, they will be taken from '+lastRunFile+'\n\n');
}
const usageGetContext=()=>{
  console.log('\nGets the context for a given contact-id, entity-id and optional company-id and it writes it to public/assets/context/context.json.\n\nUSAGE:\nnpm run expose -- get-context --contact-id=<contact id> --entity-id=<entity id> --stage=<stage number starting from 0> [ --company-id=<company id> ]\n\n');
  console.log('If no other args than the stage are specified, they will be taken from '+lastRunFile+'\n\n');
  console.log('If company id is not specified, it will be taken from the sender\n\n');
}

var lastRun={
}
if (fs.existsSync(lastRunFile)) {
  lastRun=JSON.parse(fs.readFileSync(lastRunFile));
}
var args = require('minimist')(process.argv.slice(2));
if (!process.env.TOKEN){
  console.error('TOKEN environment variable is missing');
  return;
}
if (args._.length===0){
  console.error('Command is missing');
  usage();
}

const command=args._[0];
const _=args._;
args={...lastRun, ...args};
args._=_;
console.log(args);



if (command === 'publish'){
  if (args._[1]==='help'){
    usagePublish();
    return;
  }
  const templateId=args['template-id'];
  if (!templateId){
    console.error('template-id missing.');
    return;
  }
  const name=args['name'];
  if (!name){
    console.error('name missing.');
    return;
  }
  packageAndPublish(templateId, name);
  updateLastRunFile(args);
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
  render(templateId, renderId, contactId, entityId, companyId, (data)=>{
    console.log('Rendeded with id '+data.id+'. Opening '+data.url);
    args={...args,'render-id': data.id};
    console.log(args);
    // open(data.url);
    openBrowser(data.url);
    writeContext(data.context);
    updateLastRunFile(args);
  }, (errorCode, message)=>console.log('Error', errorCode, message));
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
  setStage(renderId, stage, (data)=>{
    console.log('Set the stage to '+stage+' to context for render with id '+data.id+'. Opening '+data.url);
    // open(data.url);
    openBrowser(data.url);
    writeContext(data.context);
    updateLastRunFile(args);
  }, (errorCode, message)=>console.log('Error', errorCode, message))
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
    writeContext(data);
    updateLastRunFile(args);
  }, (errorCode, message)=>console.log('Error', errorCode, message));
}else if (command === 'help'){
  usage();
}else{
  console.error('Unknown command '+command);
  usage();
}
  


//curl -v -XPUT -H 'token: 5bdebf38-753b-42fe-9a52-cbca55446014' -H"content-type: application/zip" --data-binary @package2.zip 'https://4fkovo7dbc.execute-api.eu-central-1.amazonaws.com/template/publish'