'use strict';

module.exports = {
  mock: function () {
    var db = {
      order: jasmine.createSpy(),
      data: jasmine.createSpy(),
      previous: jasmine.createSpy(),
      kill: jasmine.createSpy()
    };

    return db;
  }
};
