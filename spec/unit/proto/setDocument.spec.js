'use strict';

var setDocument = require('../../../lib/proto/setDocument');
var dbMock = require('../mocks/db');

describe(' - unit/proto/setDocument:', function () {
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
      this._set = jasmine.createSpy();

      this.setDocument = setDocument;
    };

    DocumentStore = function (db) {
      this.db = db;
      this.DocumentNode = DocumentNode.bind(undefined, this);
    };
  });

  beforeEach(function () {
    db = dbMock.mock();
    documentStore = new DocumentStore(db);
    documentNode = new documentStore.DocumentNode('rob', ['address']);
    callback = jasmine.createSpy();

    // /*jshint camelcase: false */
    // documentStore.db.next_node.and.returnValues(
    //   {
    //     global: 'rob',
    //     subscripts: ['foo', 'bar'],
    //     data: 'barValue',
    //     defined: 1
    //   },
    //   {
    //     global: 'rob',
    //     subscripts: ['foo', 'baz'],
    //     data: 'bazValue',
    //     defined: 1
    //   },
    //   {
    //     global: 'rob',
    //     defined: 0
    //   }
    // );
    // /*jshint camelcase: true */
  });

  it('should process null', function () {
    var obj = {
      bar: null
    };

    documentNode.setDocument(obj);

    expect(documentNode._set).toHaveBeenCalledWith('', {
      global: 'rob',
      subscripts: ['address', 'bar']
    });
  });

  it('should process undefined', function () {
    var obj = {
      bar: undefined
    };

    documentNode.setDocument(obj);

    expect(documentNode._set).toHaveBeenCalledWith('', {
      global: 'rob',
      subscripts: ['address', 'bar']
    });
  });

  it('should process string', function () {
    var obj = {
      bar: 'baz'
    };

    documentNode.setDocument(obj);

    expect(documentNode._set).toHaveBeenCalledWith('baz', {
      global: 'rob',
      subscripts: ['address', 'bar']
    });
  });

  it('should process number prop', function () {
    var obj = {
      bar: 10
    };

    documentNode.setDocument(obj);

    expect(documentNode._set).toHaveBeenCalledWith(10, {
      global: 'rob',
      subscripts: ['address', 'bar']
    });
  });

  it('should process empty array', function () {
    var obj = {
      bar: []
    };

    documentNode.setDocument(obj);

    expect(documentNode._set).not.toHaveBeenCalled();
  });

  it('should process array', function () {
    var obj = {
      bar: ['a', 'b']
    };

    documentNode.setDocument(obj);

    expect(documentNode._set).toHaveBeenCalledTimes(2);
    expect(documentNode._set.calls.argsFor(0)).toEqual(['a', {
      global: 'rob',
      subscripts: ['address', 'bar', 0]
    }]);
    expect(documentNode._set.calls.argsFor(1)).toEqual(['b', {
      global: 'rob',
      subscripts: ['address', 'bar', 1]
    }]);
  });

  it('should process array with offset', function () {
    var obj = {
      bar: ['a', 'b']
    };
    var offset = 2;

    documentNode.setDocument(obj, offset);

    expect(documentNode._set).toHaveBeenCalledTimes(2);
    expect(documentNode._set.calls.argsFor(0)).toEqual(['a', {
      global: 'rob',
      subscripts: ['address', 'bar', 2]
    }]);
    expect(documentNode._set.calls.argsFor(1)).toEqual(['b', {
      global: 'rob',
      subscripts: ['address', 'bar', 3]
    }]);
  });

  it('should process when array item is object', function () {
    var obj = {
      bar: [
        {
          foo: 'baz'
        }
      ]
    };

    documentNode.setDocument(obj);

    expect(documentNode._set).toHaveBeenCalledWith('baz', {
      global: 'rob',
      subscripts: ['address', 'bar', 0, 'foo']
    });
  });

  it('should process when object', function () {
    var obj = {
      bar: {
        foo: 'baz'
      }
    };

    documentNode.setDocument(obj);

    expect(documentNode._set).toHaveBeenCalledWith('baz', {
      global: 'rob',
      subscripts: ['address', 'bar', 'foo']
    });
  });
});
