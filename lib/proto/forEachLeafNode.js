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

module.exports = function(callback) {
  // iterates through only leaf nodes with data values

  var isWithinRoot = function(signature, currentArray) {
    // has it moved beyond the root Global Node that originally seeded the loop?  If so, stop the loop

    var match = true;
    for (var i = 0; i < signature.length; i++) {
      if (signature[i].toString() !== currentArray[i].toString()) {
        match = false;
        break;
      }
    }
    return match;
  };

  var node = this._node;
  var ok = true;
  var quit;
  var documentStore = this.documentStore;
  var db = documentStore.db;
  var DocumentNode = documentStore.DocumentNode;
  var subscripts = this.path;
  var data;
  do {
    node = db.next_node(node);
    if (node.defined !== 0) {
      if (isWithinRoot(subscripts, node.subscripts)) {
        data = node.data || '';
        if (callback) quit = callback.call(this, data, new DocumentNode(node.global, node.subscripts));
        if (quit === false) ok = false;
      }
      else {
        ok = false;
      }
    }
    else {
      ok = false;
    }
  } while (ok);
};

