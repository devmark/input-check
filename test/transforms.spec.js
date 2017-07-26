'use strict';

const Transform = require('../src/Transforms');
const chai = require('chai');
const expect = chai.expect;

require('co-mocha');

describe('Transform', function () {
  it('should trim all', function *() {
    const rules = {};

    const body = {
      abc: '  ',
      object: {
        object2: {
          object3: '  <> ',
        }
      },
      arr: [
        ' a', '  b   ', '  c '
      ],
    };

    const passed = yield new Transform(body, rules).trim().pickAll();
    expect(passed).to.eql({
      abc: '',
      object: {
        object2: {
          object3: '<>',
        }
      },
      arr: [
        'a', 'b', 'c'
      ],
    });

  });

  it('should empty string to null', function *() {
    const rules = {};

    const body = {
      abc: '',
      object: {
        object2: {
          object3: ' ',
        }
      },
      arr: [
        '', 'b', 'c'
      ],
    };

    const passed = yield new Transform(body, rules).emptyStringToNull().pickAll();
    expect(passed).to.eql({
      abc: null,
      object: {
        object2: {
          object3: ' ',
        }
      },
      arr: [
        null, 'b', 'c'
      ],
    });
  });

});
