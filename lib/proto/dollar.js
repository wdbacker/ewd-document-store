/*

 ----------------------------------------------------------------------------
 | ewd-document-store: Persistent JavaScript Objects and Document Database  |
 |                      using Global Storage                                |
 |                                                                          |
 | Copyright (c) 2016-17 M/Gateway Developments Ltd,                        |
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

  22 February 2017

*/

module.exports = function(subscript, addToParent) {
  if (typeof subscript === 'undefined') return;
  if (Array.isArray(subscript)) {
    var subsArray = this.path.slice(0);
    addToParent = false;
    subs = subsArray.concat(subscript); // append the new subscripts
  }
  else {
    var dollarNode = this['$' + subscript];
    if (dollarNode) return dollarNode;
    subs = this.path.slice(0);
    subs.push(subscript);
  }
  var childNode = new this.documentStore.DocumentNode(this.documentName, subs);
  if (addToParent !== false) {
    this['$' + subscript] = childNode;
  }
  return childNode;
};
