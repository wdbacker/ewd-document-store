/*

 ----------------------------------------------------------------------------
 | ewd-document-store: Persistent JavaScript Objects and Document Database  |
 |                      using Global Storage                                |
 |                                                                          |
 | Copyright (c) 2016 M/Gateway Developments Ltd,                           |
 | Reigate, Surrey UK.                                                      |
 | All rights reserved.                                                     |
 |                                                                          |
 | http://www.mgateway.com                                                  |
 | Email: rtweed@mgateway.com                                               |
 |                                                                          |
 |                                                                          |
 | Licensed under the Apache License, Version 2.0 (the "License");          |
 | you may not use this file except in compliance with the License.         |
 | You may obtain a copy of the License at                                  |
 |                                                                          |
 |     http://www.apache.org/licenses/LICENSE-2.0                           |
 |                                                                          |
 | Unless required by applicable law or agreed to in writing, software      |
 | distributed under the License is distributed on an "AS IS" BASIS,        |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
 | See the License for the specific language governing permissions and      |
 |  limitations under the License.                                          |
 ----------------------------------------------------------------------------

  6 March 2016

*/

// standalone example demonstrating use of ewd-globals with Cache database
//  you may need to run this as sudo because of permissions

var DocumentStore = require('ewd-document-store');
var interface = require('cache');
var db = new interface.Cache();
console.log('db: ' + JSON.stringify(db));

// Change these parameters to match your GlobalsDB or Cache system:

var ok = db.open({
  path: '/opt/cache/mgr',
  username: '_SYSTEM',
  password: 'SYS',
  namespace: 'USER'
});

console.log('ok: ' + JSON.stringify(ok));

var documentStore = new DocumentStore(db);

console.log(db.version());

var rob = new documentStore.DocumentNode('rob');

var temp = new documentStore.DocumentNode('temp', [1]);
console.log('exists: ' + temp.exists);
console.log('hasValue: ' + temp.hasValue);
console.log('hasChildren: ' + temp.hasChildren);
console.log('value: ' + temp.value);

console.log(JSON.stringify(temp.getDocument(), null, 2));

documentStore.on('afterSet', function(node) {
  console.log('afterSet: ' + JSON.stringify(node));
});

rob.$('x').value = 'hello';
rob.$('y').value = 'world';
rob.$('a').increment();

var z = {
  a: 'this is a',
  b: 'this is b',
  c: ['a', 's', 'd'],
  d: {
    a: 'a',
    b: 'b'
  }
};

rob.$('z').setDocument(z);

console.log(JSON.stringify(rob.getDocument(), null, 2));

console.log('forEachChild through rob document:');
rob.forEachChild(function(nodeName) {
  console.log(nodeName);
});

console.log('forPrefix through rob global starting x:');
rob.forEachChild({prefix: 'x'}, function(subscript) {
  console.log(subscript);
});

console.log('forEachLeafNode through rob global:');
rob.forEachLeafNode(function(value) {
  console.log(value);
});

console.log('Number of children: ' + rob.countChildren());

var roby = rob.$x.$('y');
console.log('parent: ' + roby.parent.value);

var first = rob.firstChild;
console.log('first: ' + first.name);
console.log('next = ' + rob.nextSibling.name);

var last = rob.lastChild;
console.log('last: ' + last.name);
console.log('previous = ' + rob.previousSibling.name);


temp.value = 1234;

temp.delete();

var list = documentStore.list();
console.log(JSON.stringify(list));

db.close();

