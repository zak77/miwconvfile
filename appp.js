var util = require('./lib/util.js');
var errors = require('./config/errors.js');
var pathModule = require('path');
const express = require('express')
const app2 = express()
var minimist = require('minimist');
var app = null;
var fs = require('fs');
var request = require('request');
var argv = minimist(process.argv.slice(2));
if (argv['u'] || argv['usage'] || argv['h'] || argv['help']) {
  console.log('\nThis app will upload a given file to a new blob element.\n');
  console.log('\tUsage: node uploadBlob.js -d <documentId> -w <workspaceId> -f <filepath> -t <MIME type>');
  console.log('An example file is provided at ./example/blobexample.txt, with MIME type text/plain.');
  process.exit(0);
}
/*
if (!argv['d'] || !argv['w']) {
  util.error(errors.missingDocumentOrWorkspaceError);
}
if (!argv['t']) {
  util.error(errors.missingMimeType);
}
if (!argv['f']) {
  util.error(errors.missingFile);
}
*/
var doc = '';
var wok = '';
var elem = '';
app = require('./lib/app.js');


app2.get('/stlconv', function(req, res){
var filep = req.param('file');
var getparts = function(documentId,workspaceId){
	app.getParts(documentId,'w',workspaceId,elem,function(data){
var partres = JSON.parse(data.toString());
console.log('Part id '+partres[0].partId);
partSTL(doc,wok,partres[0].elementId,partres[0].partId);	
	
	});	
}	
var interid;	
var tranStatus = function(translationID){
app.tranlationStatus(translationID,function(data){
var tranres = JSON.parse(data.toString());
console.log('tranlation Status '+tranres.requestState);

if(tranres.requestState != 'DONE'){console.log('Translating...');}else{console.log('Translation complete'); clearInterval(interid);
getparts(doc,wok);
//partSTL(wok,wok,elem);
}
});	
}	

var deletDoc = function(documentId){
app.delDoc(documentId,function(deldata){
	console.log('document with id '+documentId+' has been deleted');
	console.log(deldata);
});

}	
var uploadBlob = function (documentId, workspaceId, file, mimeType) {
	console.log('did '+documentId,'wid '+workspaceId);
  app.uploadBlobElement(documentId, workspaceId, file, mimeType, function (data) {
    var blobData = JSON.parse(data.toString());
	elem =blobData.id;
    console.log('Uploaded file to new element with id ' + blobData.id + ' and name ' + blobData.name + ' workspaceId '+wok);
	 console.log('waiting for translation id-'+blobData.translationId+' to complete.....');
	 //tranStatus(blobData.translationId);
	  interid = setInterval(tranStatus, 3000,blobData.translationId);
	//setInterval(tranStatus(blobData.translationId), 3000);
	 
	
	//partSTL(wok,wok,elem);
  });
}
doc = '';
wok = '';
fileu = 'box.iges';

argv['t'] = 'multipart/form-data';
//uploadBlob(argv['d'], argv['w'], pathModule.normalize(argv['f']), argv['t']);

//uploadBlob(doc, wok, fileu, argv['t']);
var createDocument = function(namet){
	body = {
    "name": namet,
    "ownerType": 0,
    "isPublic": true
        };
	app.createDocument(namet,body,function (data) {
    var response = JSON.parse(data.toString());
    console.log('Document created ' + response.id + ' and workspace Id  ' + response.defaultWorkspace.id + '.');
	doc = response.id;wok = response.defaultWorkspace.id;
	uploadBlob(doc, wok, fileu, argv['t']);
  });
}
//createDocument('new'+Math.floor(Date.now() / 1000));

var partSTL = function (documentId, workspaceId, elementId,partId) {
	var qob = {units: "millimeter"};
  app.partStl(documentId, workspaceId, elementId,partId, qob, function (data) {
   // console.log(data.toString());
   var Rx = Math.floor((Math.random() * 100000) + 1);
var	stlfile = __dirname + "/stlconv/"+Rx+".stl";
fs.writeFile(stlfile, data, function(err) {
    if(err) {
        return console.log(err);
    }
	deletDoc(documentId);
	console.log("The file was saved as "+stlfile);res.sendFile(stlfile);

    
}); 
  });
}
//partSTL(doc,wok,elem);

var partStudioStl = function (documentId, workspaceId, elementId,partid) {
  app.partStudioStl(documentId, workspaceId, elementId,partid, null, function (data) {
    console.log(data.toString());
  });
}
var convert = function(filePath){
var paramfile = filep;//'https://myindustryworld.com/z/partfiles/100000136files/100000136drawing120180402cub.iges';
var requestSettings = { method: 'GET', url: paramfile,  encoding: null,};
//console.log(partfile);
request(requestSettings, function(error, response, fbody) {
	var urlcon = paramfile.split('/'); var fileName = urlcon[urlcon.length - 1];
	fileu = 'paramfiles/'+fileName;
	fs.writeFile(fileu, fbody, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("New file "+fileu+" was created");
	createDocument('miw'+Math.floor(Date.now() / 1000));
}	);
});	
}

//partStudioStl(argv['d'], argv['w'], argv['e']);
//partStudioStl(doc,wok, elem);

	convert(filep);
	
});
app2.get('/', (req, res) => res.send('Hello World!'))
app2.listen(3000, () => console.log('Example app listening on port 3000!'))
