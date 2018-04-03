var onshape = require('./onshape.js');

var getParts = function (documentId, wvm, wvmId, elementId, cb) {
  var opts = {
    d: documentId,
	w: wvmId,
    //e: elementId,
    resource: 'parts'
  };
 // opts[wvm] = wvmId;
 
  onshape.get(opts, cb);
}

var getMassProperties = function (documentId, wvm, wvmId, elementId, cb) {
  var opts = {
    d: documentId,
    e: elementId,
    resource: 'partstudios',
    subresource: 'massproperties',
    query: {
      massAsGroup: false
    }
  }
  opts[wvm] = wvmId;
  onshape.get(opts, cb);
}

var createPartStudio = function (documentId, workspaceId, name, cb) {
  var opts = {
    d: documentId,
    w: workspaceId,
    resource: 'partstudios'
  }
  if (typeof name === 'string') {
    opts.body = {name: name};
  }
  onshape.post(opts, cb);
}

var deleteElement = function (documentId, workspaceId, elementId, cb) {
  var opts = {
    d: documentId,
    w: workspaceId,
    e: elementId,
    resource: 'elements',
  }
  onshape.delete(opts, cb);
}
var delDoc = function (documentId, cb) {
  var opts = {
    path: '/api/documents/'+documentId
  }
  onshape.delete(opts, cb);
}
var tranlationStatus = function(translationId,cb){
	 var opts2 = {
    translationId: translationId,
    
  }
onshape.get(opts2, cb);	
}
var uploadBlobElement = function (documentId, workspaceId, file, mimeType, cb) { //documentId = '8ae7d1997024f27c926ea42d'; workspaceId='575fb46f38d70ec26558cfad';
  var opts = {
    d: documentId,
    w: workspaceId,
    resource: 'blobelements',
    file: file,
    mimeType: mimeType
  }
  onshape.upload(opts, cb);
}
var uploadfile = function (documentId, workspaceId, body, mimeType, cb) {
  var opts = {
	 
    d: documentId,
    w: workspaceId,
    resource: 'blobelements',
    file: file,
    mimeType: mimeType
  }
  onshape.upload(opts, cb);
}
var getDocuments = function(queryObject, cb) {
  var opts = {
    path: '/api/documents',
    query: queryObject
  }
  onshape.get(opts, cb);
}
var getparts = function(documentId,workspaceId, cb) {
  var opts = {
	d: documentId,
    w: workspaceId,
    path: '/api/parts'
  
  }
  onshape.get(opts, cb);
}
var createDocument = function(queryObject,body, cb) {
  var opts = {
    path: '/api/documents',
   // query: queryObject,
	body: body
  }
  onshape.post(opts, cb);
}
var partStudioStl = function (documentId, workspaceId, elementId, queryObject, cb) { //documentId = '8ae7d1997024f27c926ea42d';workspaceId='575fb46f38d70ec26558cfad';elementId='d0e60d5b72e737da320ffd87';
  var opts = {
    d: documentId,
    w: workspaceId,
    e: elementId,
    query: queryObject,
    resource: 'partstudios',
    subresource: 'stl',
    headers: {
      'Accept': 'application/vnd.onshape.v1+octet-stream'
    }
  };
  onshape.get(opts, cb);
}
var partStl = function (documentId, workspaceId, elementId,partId, queryObject, cb) { //documentId = 'dbacb41e4f0546cc4d460696';workspaceId='a36b3513abf24af87e1dd6ba';elementId='63c0dcdad5ddafdeb3f635c2';partId = "JHD";
  var opts = {
    d: documentId,
    w: workspaceId,
    e: elementId,
	partid: partId,
   query: queryObject,
    resource: 'parts',
    subresource: 'stl',
    headers: {
      'Accept': 'application/vnd.onshape.v1+octet-stream'
    }
  };
  onshape.get(opts, cb);
}

module.exports = {
  getParts: getParts,
  getMassProperties: getMassProperties,
  createPartStudio: createPartStudio,
  deleteElement: deleteElement,
  delDoc: delDoc,
  uploadBlobElement: uploadBlobElement,
  uploadfile: uploadfile,
  tranlationStatus: tranlationStatus,
  getDocuments: getDocuments,
  createDocument: createDocument,
  partStudioStl: partStudioStl,
  getparts: getparts,
  partStl: partStl
}