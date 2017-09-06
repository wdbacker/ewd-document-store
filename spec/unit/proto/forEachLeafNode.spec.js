'use strict';

var forEachLeafNode = require('../../../lib/proto/forEachLeafNode');
var dbMock = require('../mocks/db');

describe(' - unit/proto/forEachLeafNode:', function () {
  var DocumentStore;
  var documentStore;
  var DocumentNode;
  var documentNode;
  var callback;
  var db;

  beforeAll(function () {
    DocumentNode = function (documentStore, documentName, subs) {
      this.documentStore = documentStore;
      this.documentName = documentName;
      this.path = subs || [];
      this._node = {
        global: this.documentName,
        subscripts: this.path
      };

      this.forEachLeafNode = forEachLeafNode;
    };

    DocumentStore = function (db) {
      this.db = db;
      this.DocumentNode = DocumentNode.bind(undefined, this);
    };
  });

  beforeEach(function () {
    db = dbMock.mock();
    documentStore = new DocumentStore(db);
    documentNode = new documentStore.DocumentNode('rob', ['foo']);
    callback = jasmine.createSpy();

    /*jshint camelcase: false */
    documentStore.db.next_node.and.returnValues(
      {
        global: 'rob',
        subscripts: ['foo', 'bar'],
        data: 'barValue',
        defined: 1
      },
      {
        global: 'rob',
        subscripts: ['foo', 'baz'],
        data: 'bazValue',
        defined: 1
      },
      {
        global: 'rob',
        defined: 0
      }
    );
    /*jshint camelcase: true */
  });

  it('should process without callback', function () {
    documentNode.forEachLeafNode();

    /*jshint camelcase: false */
    expect(documentStore.db.next_node.calls.count()).toBe(3);
    expect(documentStore.db.next_node.calls.argsFor(0)[0]).toEqual({
      global: 'rob',
      subscripts: ['foo']
    });
    expect(documentStore.db.next_node.calls.argsFor(1)[0]).toEqual(jasmine.objectContaining({
      global: 'rob',
      subscripts: ['foo', 'bar']
    }));
    expect(documentStore.db.next_node.calls.argsFor(2)[0]).toEqual(jasmine.objectContaining({
      global: 'rob',
      subscripts: ['foo', 'baz']
    }));
    /*jshint camelcase: true */
  });

  it('should call callback exact times with correct arguments', function () {
    documentNode.forEachLeafNode(callback);

    expect(callback).toHaveBeenCalledTimes(2);

    expect(callback.calls.argsFor(0)).toEqual(['barValue', jasmine.any(DocumentNode)]);
    expect(callback.calls.argsFor(0)[1]).toEqual(jasmine.objectContaining({
      documentName: 'rob',
      path: ['foo', 'bar']
    }));

    expect(callback.calls.argsFor(1)).toEqual(['bazValue', jasmine.any(DocumentNode)]);
    expect(callback.calls.argsFor(1)[1]).toEqual(jasmine.objectContaining({
      documentName: 'rob',
      path: ['foo', 'baz']
    }));
  });

  it('should quit from loop', function () {
    // https://github.com/robtweed/ewd-document-store/issues/6
    callback.and.returnValue(false);

    documentNode.forEachLeafNode(callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('barValue', jasmine.any(DocumentNode));
  });

  it('should process when not within root', function () {

    /*jshint camelcase: false */
    documentStore.db.next_node.and.returnValues(
      {
        global: 'rob',
        subscripts: ['a', 'b'],
        data: 'bValue',
        defined: 1
      }
    );
    /*jshint camelcase: true */

    documentNode.forEachLeafNode(callback);

    expect(callback).not.toHaveBeenCalled();
  });

  it('should process undefined data as empty string', function () {

    /*jshint camelcase: false */
    documentStore.db.next_node.and.returnValues(
      {
        global: 'rob',
        subscripts: ['foo', 'bar'],
        defined: 1
      },
      {
        global: 'rob',
        defined: 0
      }
    );
    /*jshint camelcase: true */

    documentNode.forEachLeafNode(callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('', jasmine.any(DocumentNode));
  });
});
