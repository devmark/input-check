'use strict';

const Validator = require('../src/Validator');
const chai = require('chai');
const expect = chai.expect;

require('co-mocha');

describe('Validator', function () {
  it('should validate an object of rules', function *() {
    const rules = {
      username: 'required'
    };

    const body = {};

    try {
      const passed = yield Validator.validate(body, rules);
      expect(passed).not.to.exist();
    } catch (e) {
      expect(e).to.be.an('array');
      expect(e[0].field).to.equal('username');
      expect(e[0].validation).to.equal('required');
    }
  });

  it('should validate multiple rules on same field', function *() {
    const rules = {
      username: 'alpha|alphaNumeric'
    };

    const body = {
      username: 'aman@33$'
    };

    try {
      const passed = yield Validator.validateAll(body, rules);
      expect(passed).not.to.exist();
    } catch (e) {
      expect(e).to.be.an('array');
      expect(e[0].field).to.equal('username');
      expect(e[0].validation).to.equal('alpha');
      expect(e[1].field).to.equal('username');
      expect(e[1].validation).to.equal('alphaNumeric');
    }
  });

  it('should run all validations defined under rules object', function *() {
    const rules = {
      age: 'required',
      phone: 'required'
    };

    const body = {};

    try {
      const passed = yield Validator.validateAll(body, rules);
      expect(passed).not.to.exist();
    } catch (e) {
      expect(e).to.be.an('array');
      expect(e[0].field).to.equal('age');
      expect(e[0].validation).to.equal('required');
      expect(e[1].field).to.equal('phone');
      expect(e[1].validation).to.equal('required');
    }
  });

  it('should return custom messages instead of default messages', function *() {
    const rules = {
      age: 'required',
      phone: 'required'
    };

    const body = {};

    const messages = {
      'age.required': 'Age is required',
      'phone.required': function () {
        return 'Phone number is required for validations';
      }
    };

    try {
      const passed = yield Validator.validateAll(body, rules, messages);
      expect(passed).not.to.exist();
    } catch (e) {
      expect(e).to.be.an('array');
      expect(e[0].message).to.equal(messages['age.required']);
      expect(e[1].message).to.equal(messages['phone.required']());
    }
  });

  it('should return original data when validation passes', function *() {
    const rules = {
      age: 'required',
      phone: 'required'
    };

    const body = {
      age: 22,
      phone: 9192910200
    };

    const validated = yield Validator.validateAll(body, rules);
    expect(validated).to.equal(body);
  });

  it('should return original data when validation passes using validate method', function *() {
    const rules = {
      age: 'required',
      phone: 'required'
    };

    const body = {
      age: 22,
      phone: 9192910200
    };

    const validated = yield Validator.validate(body, rules);
    expect(validated).to.equal(body);
  });

  it('should return errors thrown within validation cycle', function *() {
    const rules = {
      age: 'foo',
      phone: 'required'
    };

    const body = {
      age: 22,
      phone: 9192910200
    };

    try {
      const validated = yield Validator.validate(body, rules);
      expect(validated).not.to.exist();
    } catch (e) {
      expect(e).to.match(/foo is not defined as a validation/i);
    }
  });

  it("should be able to add it's own rules to validation store", function *() {
    const phone = function (data, field, message, args, get) {
      return new Promise(function (resolve, reject) {
        reject(message);
      });
    };
    Validator.extend('phone', phone, 'Enter valid phone number');
    Validator.extendImplicit('phone');

    const rules = {
      contact_no: 'phone'
    };
    const body = {};

    try {
      const validated = yield Validator.validate(body, rules);
      expect(validated).not.to.exist();
    } catch (e) {
      expect(e).to.be.an('array');
      expect(e[0].validation).to.equal('phone');
      expect(e[0].message).to.equal('Enter valid phone number');
    }
  });

  it('should return original data when validation passes using validateAll method', function *() {
    const rules = {
      age: 'required|integer',
      phone: 'required'
    };

    const body = {
      age: 22,
      phone: 9192910200
    };

    const validated = yield Validator.validateAll(body, rules);
    expect(validated).to.equal(body);
  });

  it('should validate not multiple rules when using validate method', function *() {
    const rules = {
      username: 'alpha|alphaNumeric'
    };

    const body = {
      username: 'aman@33$'
    };

    try {
      const passed = yield Validator.validate(body, rules);
      expect(passed).not.to.exist();
    } catch (e) {
      expect(e).to.be.an('array');
      expect(e[0].field).to.equal('username');
      expect(e[0].validation).to.equal('alpha');
      expect(e[1]).to.equal(undefined);
    }
  });

  it('should throw errors when valid function is not passed to extend method', function () {
    const fn = function () {
      return Validator.extend('phone', '', '');
    };
    expect(fn).to.throw(/Invalid arguments/);
  });

  it('should extend raw validator', function () {
    const presence = function (hash, item) {
      return hash[item];
    };
    Validator.is.extend('presence', presence);
    const isPresent = Validator.is.presence({foo: 'bar'}, 'foo');
    expect(isPresent).to.equal('bar');
  });

  it('should throw error when function is not passed to is.extend', function () {
    const fn = function () {
      return Validator.is.extend('presence', 'presence');
    };
    expect(fn).to.throw(/Invalid arguments/);
  });

  it('should be able to define multiple rules as an array instead of | symbol', function *() {
    const rules = {
      username: ['alpha', 'alphaNumeric']
    };

    const body = {
      username: 'virk@33$'
    };

    try {
      const passed = yield Validator.validateAll(body, rules);
      expect(passed).not.to.exist();
    } catch (e) {
      expect(e).to.be.an('array');
      expect(e[0].field).to.equal('username');
      expect(e[0].validation).to.equal('alpha');
      expect(e[1].field).to.equal('username');
      expect(e[1].validation).to.equal('alphaNumeric');
    }
  });

  it('should be able to define regex as an array', function *() {
    const rules = {
      name: ['regex:^[a-zA-z]+$']
    };

    const body = {
      name: 'virk@33$'
    };

    try {
      const passed = yield Validator.validate(body, rules);
      expect(passed).not.to.exist();
    } catch (e) {
      expect(e).to.be.an('array');
      expect(e[0].field).to.equal('name');
      expect(e[0].validation).to.equal('regex');
    }
  });

  it('should run all validations on multiple fields using validateAll', function *() {
    const rules = {
      username: 'required',
      email: 'required'
    };

    const body = {};

    try {
      const passed = yield Validator.validateAll(body, rules);
      expect(passed).not.to.exist();
    } catch (e) {
      expect(e).to.be.an('array');
      expect(e[0].field).to.equal('username');
      expect(e[0].validation).to.equal('required');
      expect(e[1].field).to.equal('email');
      expect(e[1].validation).to.equal('required');
    }
  });

  it('should make use of snake case validations', function *() {
    const rules = {
      username: 'alpha_numeric'
    };

    const body = {
      username: 'virk@33$'
    };

    try {
      const passed = yield Validator.validate(body, rules);
      expect(passed).not.to.exist();
    } catch (e) {
      expect(e).to.be.an('array');
      expect(e[0].field).to.equal('username');
      expect(e[0].validation).to.equal('alpha_numeric');
    }
  });

  it('should be able to define custom messages for snake case rules', function *() {
    const rules = {
      username: 'alpha_numeric'
    };

    const body = {
      username: 'virk@33$'
    };

    const messages = {
      'alpha_numeric': 'special chars not allowed'
    };

    try {
      const passed = yield Validator.validate(body, rules, messages);
      expect(passed).not.to.exist();
    } catch (e) {
      expect(e).to.be.an('array');
      expect(e[0].field).to.equal('username');
      expect(e[0].validation).to.equal('alpha_numeric');
      expect(e[0].message).to.equal(messages.alpha_numeric);
    }
  });

  it('should fail validation when null is passed for any rule without nullable', function *() {
    const rules = {
      select: 'array'
    };

    const body = {
      select: null
    };

    try {
      const passed = yield Validator.validate(body, rules);
      expect(passed).not.to.exist();
    } catch (e) {
      expect(e).to.be.an('array');
      expect(e[0].field).to.equal('select');
      expect(e[0].validation).to.equal('array');
    }
  });

  it('should not fail validation when null is passed for any rule with nullable', function *() {
    const rules = {
      select: 'array|nullable'
    };

    const body = {
      select: null
    };

    const passed = yield Validator.validate(body, rules);
    expect(passed).to.be.an('object');
    expect(passed).to.have.property('select');
  });


  // it('should fail validation when empty string is passed for any rule with strict mode on', function *() {
  //   Validator.setMode('strict');
  //
  //   const rules = {
  //     select: 'array'
  //   };
  //
  //   const body = {
  //     select: ''
  //   };
  //
  //   try {
  //     const passed = yield Validator.validate(body, rules);
  //     expect(passed).not.to.exist();
  //   } catch (e) {
  //     expect(e).to.be.an('array');
  //     expect(e[0].field).to.equal('select');
  //     expect(e[0].validation).to.equal('array');
  //   }
  // });


  it('should not fail validation when empty string is passed for any rule in normal mode', function *() {
    Validator.setMode('normal');

    const rules = {
      select: 'array'
    };

    const body = {
      select: ''
    };

    const passed = yield Validator.validate(body, rules);
    expect(passed).to.be.an('object');
    expect(passed).to.have.property('select');
  });

  it('should be able to validate nested objects using array expression', function *() {
    const rules = {
      'person.*.firstname': 'required'
    };
    const data = {
      person: [{
        firstname: null
      }]
    };

    try {
      const passed = yield Validator.validate(data, rules);
      expect(passed).not.to.exist();
    } catch (e) {
      expect(e).to.be.an('array');
      expect(e[0].field).to.equal('person.0.firstname');
      expect(e[0].validation).to.equal('required');
    }
  });

  it('should be able to validate multiple nested objects using array expression', function *() {
    const rules = {
      'person.*.firstname': 'required'
    };
    const data = {
      person: [
        {
          firstname: 'virk'
        },
        {
          firstname: null
        }
      ]
    };

    try {
      const passed = yield Validator.validate(data, rules);
      expect(passed).not.to.exist();
    } catch (e) {
      expect(e).to.be.an('array');
      expect(e[0].field).to.equal('person.1.firstname');
      expect(e[0].validation).to.equal('required');
    }
  });

  it('should be able to validate flat arrays using array expression', function *() {
    const rules = {
      'email.*': 'email'
    };
    const data = {
      email: ['virkm']
    };

    try {
      const passed = yield Validator.validate(data, rules);
      expect(passed).not.to.exist();
    } catch (e) {
      expect(e).to.be.an('array');
      expect(e[0].field).to.equal('email.0');
      expect(e[0].validation).to.equal('email');
    }
  });

  it('should be able to validate multiple values inside flat arrays using array expression', function *() {
    const rules = {
      'email.*': 'email'
    };
    const data = {
      email: ['foo@bar.com', 'barnseek']
    };

    try {
      const passed = yield Validator.validate(data, rules);
      expect(passed).not.to.exist();
    } catch (e) {
      expect(e).to.be.an('array');
      expect(e[0].field).to.equal('email.1');
      expect(e[0].validation).to.equal('email');
    }
  });

  // it('should throw an error when value is not an array', function *() {
  //   const rules = {
  //     people: 'array',
  //     'people.*.email': 'required|email'
  //   };
  //
  //   const data = {
  //     people: ''
  //   };
  //
  //   try {
  //     Validator.setMode('strict');
  //     const passed = yield Validator.validate(data, rules);
  //     expect(passed).not.to.exist();
  //   } catch (e) {
  //     expect(e).to.be.an('array');
  //     expect(e.length).to.equal(1);
  //     expect(e[0].field).to.equal('people');
  //     expect(e[0].validation).to.equal('array');
  //   }
  // });

  it('should throw an error when value is an array but childs does not exists', function *() {
    const rules = {
      people: 'array',
      'people.*.email': 'required|email'
    };

    const data = {
      people: [{}]
    };

    try {
      const passed = yield Validator.validate(data, rules);
      expect(passed).not.to.exist();
    } catch (e) {
      expect(e).to.be.an('array');
      expect(e.length).to.equal(1);
      expect(e[0].field).to.equal('people.0.email');
      expect(e[0].validation).to.equal('required');
    }
  });

  it('should throw an error when value is an array but childs are not valid', function *() {
    const rules = {
      people: 'array',
      'people.*.email': 'required|email'
    };

    const data = {
      people: [{email: 'foo'}]
    };

    try {
      const passed = yield Validator.validate(data, rules);
      expect(passed).not.to.exist();
    } catch (e) {
      expect(e).to.be.an('array');
      expect(e.length).to.equal(1);
      expect(e[0].field).to.equal('people.0.email');
      expect(e[0].validation).to.equal('email');
    }
  });

  it('should throw an error when value is an array but one of the multiple childs is not valid', function *() {
    const rules = {
      people: 'array',
      'people.*.email': 'required|email'
    };

    const data = {
      people: [{email: 'foo@bar.com'}, {email: 'snee'}]
    };

    try {
      const passed = yield Validator.validate(data, rules);
      expect(passed).not.to.exist();
    } catch (e) {
      expect(e).to.be.an('array');
      expect(e.length).to.equal(1);
      expect(e[0].field).to.equal('people.1.email');
      expect(e[0].validation).to.equal('email');
    }
  });

  it('should be able to define custom messages for array expressions', function *() {
    const rules = {
      people: 'array',
      'people.*.email': 'required|email'
    };

    const data = {
      people: [{email: 'foo@bar.com'}, {email: 'snee'}]
    };

    const messages = {
      'people.*.email.email': 'Enter valid email address'
    };

    try {
      const passed = yield Validator.validate(data, rules, messages);
      expect(passed).not.to.exist();
    } catch (e) {
      expect(e).to.be.an('array');
      expect(e.length).to.equal(1);
      expect(e[0].field).to.equal('people.1.email');
      expect(e[0].validation).to.equal('email');
      expect(e[0].message).to.equal('Enter valid email address');
    }
  });

  it('should be able to define messages for flat array expression', function *() {
    const rules = {
      'email.*': 'email'
    };
    const data = {
      email: ['virkm']
    };
    const messages = {
      'email.*.email': 'Email address is not valid'
    };

    try {
      const passed = yield Validator.validate(data, rules, messages);
      expect(passed).not.to.exist();
    } catch (e) {
      expect(e).to.be.an('array');
      expect(e[0].field).to.equal('email.0');
      expect(e[0].validation).to.equal('email');
      expect(e[0].message).to.equal('Email address is not valid');
    }
  });

  it('should be able to define messages and make use of dynamic attributes', function *() {
    const rules = {
      'email.*': 'email'
    };
    const data = {
      email: ['virkm']
    };
    const messages = {
      'email.*.email': '{{field}} is not a valid email'
    };

    try {
      const passed = yield Validator.validate(data, rules, messages);
      expect(passed).not.to.exist();
    } catch (e) {
      expect(e).to.be.an('array');
      expect(e[0].field).to.equal('email.0');
      expect(e[0].validation).to.equal('email');
      expect(e[0].message).to.equal('email.0 is not a valid email');
    }
  });

  it('should not mutate the actual data set', function *() {
    const rules = {};

    const data = {
      username: ''
    };

    const passed = yield Validator.validate(data, rules);
    expect(passed).deep.equal(data);
  });

  it('should not mutate actual data set in strict mode', function *() {
    const rules = {
      email: 'required'
    };

    const data = {
      username: '',
      email: 'foo@bar.com'
    };

    Validator.setMode('strict');
    const passed = yield Validator.validate(data, rules);
    expect(passed).deep.equal(data);
  });

  it("should be able to add it's own validation messages to validation store", function *() {
    const phone = function (data, field, message, args, get) {
      return new Promise(function (resolve, reject) {
        reject(message);
      });
    };
    Validator.extend('isPhone', phone, 'Enter valid phone number');
    Validator.extendImplicit('isPhone');

    const rules = {
      contact_no: 'is_phone'
    };
    const body = {};

    try {
      const validated = yield Validator.validate(body, rules);
      expect(validated).not.to.exist();
    } catch (e) {
      expect(e).to.be.an('array');
      expect(e[0].validation).to.equal('is_phone');
      expect(e[0].message).to.equal('Enter valid phone number');
    }
  });
});
