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

  19 August 2016

*/

module.exports = function(callback) {

  var result;
  var gnode;
  var subs;
  var node;
  var seed = '';
  var end = '';
  var quit;

  var db = this.documentStore.db;
  var params = {};
  var direction = 'forwards';
  if (arguments.length > 1) {
    params = arguments[0];
    if (params.direction === 'reverse') {
      direction = 'reverse';
    }
    else if (params === 'reverse') {
      direction = 'reverse';
    }
    callback = arguments[1]; 
  }
  subs = this.path.slice(0);
  subs.push('');
  node = {global: this.documentName, subscripts: subs};
  
  if (params.prefix) {
    params.range = {
      from: params.prefix
    }
  }
  if (params.range) {
    var from = params.range.from || '';
    if (direction === 'reverse' && from !== '') from = from + String.fromCharCode(254);
    var to = params.range.to || '';
    //console.log('*** from = ' + from + '; to = ' + to);
    if (to !== '') {
      subs = this.path.slice(0);
      if (direction === 'forwards') to = to + String.fromCharCode(254);
      subs.push(to);
      node = {global: this.documentName, subscripts: subs};
      if (direction === 'forwards') {
        end = db.order(node).result;
      }
      else {
        end = db.previous(node).result;
      }
    }
    if (from === '') {
      subs = this.path.slice(0);
      subs.push(from);
      node = {global: this.documentName, subscripts: subs};
    }
    else {
      subs = this.path.slice(0);
      subs.push(from);
      node = {global: this.documentName, subscripts: subs};
      if (direction === 'forwards') {
        seed = db.previous(node).result;
      }
    }
  }

  var quit = false;
  var prefix = params.prefix;

  //console.log('*** end = ' + end + '; direction = ' + direction);
  //console.log('start node: ' + JSON.stringify(node));
  do {
    if (direction === 'forwards') {
      node = db.order(node);
    }
    else {
      node = db.previous(node);
    }
    result = node.result;
    //console.log('result = ' + result);
    if (result !== end) {
      if (prefix && result.substr(0, prefix.length) !== prefix) break
      gnode = this.$(result, false);
      if (callback) quit = callback.call(this, result, gnode);
      if (quit) break;
    }
  }
  while (result !== end);
};
