'use strict';

module.exports = {
  mock: function () {
    var db = {
      order: jasmine.createSpy(),
      data: jasmine.createSpy(),
    };

    return db;
  }
};
