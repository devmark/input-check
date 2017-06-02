'use strict';

const Validations = require('../src/Validations');
const chai = require('chai');
const expect = chai.expect;

require('co-mocha');

describe('Validations', function () {
  describe('required', function () {
    it('should reject promise when field is not defined', function *() {
      const data = {};
      const field = 'name';
      const message = 'name is required';
      const args = [];
      try {
        yield Validations.required(data, field, message, args);
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should reject promise when field is defined but empty', function *() {
      const data = {name: ''};
      const field = 'name';
      const message = 'name is required';
      const args = [];
      try {
        yield Validations.required(data, field, message, args);
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should resolve promise when field is defined and has value', function *() {
      const data = {name: 'virk'};
      const field = 'name';
      const message = 'name is required';
      const args = [];
      const passes = yield Validations.required(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should resolve promise when field is defined and has boolean negative value', function *() {
      const data = {name: false};
      const field = 'name';
      const message = 'name is required';
      const args = [];
      const passes = yield Validations.required(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should resolve promise when field is defined and has numeric value', function *() {
      const data = {name: 0};
      const field = 'name';
      const message = 'name is required';
      const args = [];
      const passes = yield Validations.required(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });
  });

  describe('email', function () {
    it('should return error when field is defined and does not have valid email', function *() {
      const data = {email: 'virk'};
      const field = 'email';
      const message = 'email must be email';
      const args = [];
      try {
        const passes = yield Validations.email(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should return error when field is defined as negative boolean', function *() {
      const data = {email: false};
      const field = 'email';
      const message = 'email must be email';
      const args = [];
      try {
        const passes = yield Validations.email(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should return error when field is defined as 0', function *() {
      const data = {email: 0};
      const field = 'email';
      const message = 'email must be email';
      const args = [];
      try {
        const passes = yield Validations.email(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should skip email validation when email field does not exists', function *() {
      const data = {};
      const field = 'email';
      const message = 'email must be email';
      const args = [];
      const passes = yield Validations.email(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should work fine when valid email is provided', function *() {
      const data = {email: 'foo@bar.com'};
      const field = 'email';
      const message = 'email must be email';
      const args = [];
      const passes = yield Validations.email(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should work fine when valid email with extension is provided', function *() {
      const data = {email: 'foo+baz@bar.com'};
      const field = 'email';
      const message = 'email must be email';
      const args = [];
      const passes = yield Validations.email(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });
  });

  describe('Accepted', function () {
    it('should return error when field is defined but not accepted', function *() {
      const data = {terms: false};
      const field = 'terms';
      const message = 'terms must be accepted';
      const args = [];
      try {
        const passes = yield Validations.accepted(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should pass validation when field is defined and accepted using true', function *() {
      const data = {terms: true};
      const field = 'terms';
      const message = 'terms must be accepted';
      const args = [];
      const passes = yield Validations.accepted(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should pass validation when field is defined and accepted using string', function *() {
      const data = {terms: 'yes'};
      const field = 'terms';
      const message = 'terms must be accepted';
      const args = [];
      const passes = yield Validations.accepted(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should pass validation when field is defined and accepted using string', function *() {
      const data = {terms: 'okay'};
      const field = 'terms';
      const message = 'terms must be accepted';
      const args = [];
      const passes = yield Validations.accepted(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should skip validation when field is not present or is undefined', function *() {
      const data = {};
      const field = 'terms';
      const message = 'terms must be accepted';
      const args = [];
      const passes = yield Validations.accepted(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });
  });

  describe('after', function () {
    it('should throw an error when date is not after defined date', function *() {
      const data = {dob: '1980-11-20'};
      const field = 'dob';
      const message = 'dob should be after 2010';
      const args = ['2010-11-20'];
      try {
        const passes = yield Validations.after(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should work fine when value is after defined date', function *() {
      const data = {dob: '2011-01-01'};
      const field = 'dob';
      const message = 'dob should be after 2010';
      const args = ['2010-11-20'];
      const passes = yield Validations.after(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should skip validation when dob is not defined', function *() {
      const data = {};
      const field = 'dob';
      const message = 'dob should be after 2010';
      const args = ['2010-11-20'];
      const passes = yield Validations.after(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when dob is undefined', function *() {
      const data = {dob: undefined};
      const field = 'dob';
      const message = 'dob should be after 2010';
      const args = ['2010-11-20'];
      const passes = yield Validations.after(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });
  });

  describe('alpha', function () {
    it('should throw an error when value is not alpha', function *() {
      const data = {username: 'virk1234'};
      const field = 'username';
      const message = 'username must contain letters only';
      const args = [];
      try {
        const passes = yield Validations.alpha(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should work fine when value is a valid alpha', function *() {
      const data = {username: 'virk'};
      const field = 'username';
      const message = 'username must contain letters only';
      const args = [];
      const passes = yield Validations.alpha(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should skip validation when field does not exists', function *() {
      const data = {};
      const field = 'username';
      const message = 'username must contain letters only';
      const args = [];
      const passes = yield Validations.alpha(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when field value is undefined', function *() {
      const data = {username: undefined};
      const field = 'username';
      const message = 'username must contain letters only';
      const args = [];
      const passes = yield Validations.alpha(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });
  });

  describe('before', function () {
    it('should throw an error when date is not before defined date', function *() {
      const data = {dob: '2012-11-20'};
      const field = 'dob';
      const message = 'dob should be before 2010';
      const args = ['2010-11-20'];
      try {
        const passes = yield Validations.before(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should work fine when value is before defined date', function *() {
      const data = {dob: '2009-01-01'};
      const field = 'dob';
      const message = 'dob should be before 2010';
      const args = ['2010-11-20'];
      const passes = yield Validations.before(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should skip validation when dob is not defined', function *() {
      const data = {};
      const field = 'dob';
      const message = 'dob should be before 2010';
      const args = ['2010-11-20'];
      const passes = yield Validations.before(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when dob is undefined', function *() {
      const data = {dob: undefined};
      const field = 'dob';
      const message = 'dob should be before 2010';
      const args = ['2010-11-20'];
      const passes = yield Validations.before(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });
  });

  describe('date', function () {
    it('should throw an error when field value is not a valid date', function *() {
      const data = {dob: '10th'};
      const field = 'dob';
      const message = 'dob should be a valid date';
      const args = [];
      try {
        const passes = yield Validations.date(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should work fine when value of field is a valid date', function *() {
      const data = {dob: '2015-10-20'};
      const field = 'dob';
      const message = 'dob should be a valid date';
      const args = [];
      const passes = yield Validations.date(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should work fine when value of field is a valid date but with a different date format', function *() {
      const data = {dob: '10/20/2015'};
      const field = 'dob';
      const message = 'dob should be a valid date';
      const args = [];
      const passes = yield Validations.date(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should work fine when value of field is a valid date but with a iso 8601 date format', function *() {
      const data = {dob: '2016-11-11T01:02:03+08:00'};
      const field = 'dob';
      const message = 'dob should be a valid date';
      const args = [];
      const passes = yield Validations.date(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should skip validation when field does not exists', function *() {
      const data = {};
      const field = 'dob';
      const message = 'dob should be a valid date';
      const args = [];
      const passes = yield Validations.date(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when field value is undefined', function *() {
      const data = {dob: undefined};
      const field = 'dob';
      const message = 'dob should be a valid date';
      const args = [];
      const passes = yield Validations.date(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });
  });

  describe('dateFormat', function () {
    it('should throw an error when field value is not a valid date', function *() {
      const data = {dob: '10th'};
      const field = 'dob';
      const message = 'dob should be a valid date';
      const args = ['YYYY/MM/DD'];
      try {
        const passes = yield Validations.dateFormat(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should throw an error when field value is a valid date but not according to defined format', function *() {
      const data = {dob: '10-20-2015'};
      const field = 'dob';
      const message = 'dob should be a valid date';
      const args = ['YYYY/MM/DD'];
      try {
        const passes = yield Validations.dateFormat(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should work fine when field value is a valid date according to given format', function *() {
      const data = {dob: '2015/10/20'};
      const field = 'dob';
      const message = 'dob should be a valid date';
      const args = ['YYYY/MM/DD'];
      const passes = yield Validations.dateFormat(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should skip validation when field is not available', function *() {
      const data = {};
      const field = 'dob';
      const message = 'dob should be a valid date';
      const args = ['YYYY/MM/DD'];
      const passes = yield Validations.dateFormat(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when field is undefined', function *() {
      const data = {dob: undefined};
      const field = 'dob';
      const message = 'dob should be a valid date';
      const args = ['YYYY/MM/DD'];
      const passes = yield Validations.dateFormat(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });
  });

  describe('time', function () {
    it('should throw an error when field value is a date', function *() {
      const data = {dob: '2015-11-11'};
      const field = 'dob';
      const message = 'dob should be a valid time';
      const args = [];
      try {
        const passes = yield Validations.time(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should throw an error when field value is not a valid time', function *() {
      const data = {dob: '14:62'};
      const field = 'dob';
      const message = 'dob should be a valid time';
      const args = [];
      try {
        const passes = yield Validations.time(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should work fine when value of field is a valid time(HH:mm)', function *() {
      const data = {dob: '14:23'};
      const field = 'dob';
      const message = 'dob should be a valid time';
      const args = [];
      const passes = yield Validations.time(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should work fine when value of field is a valid time but with a different time format(HH:mm:ss)', function *() {
      const data = {dob: '15:22:11'};
      const field = 'dob';
      const message = 'dob should be a valid time';
      const args = [];
      const passes = yield Validations.time(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should work fine when value of field is a valid time but with a different time format(HH:mm a)', function *() {
      const data = {dob: '01:02 pm'};
      const field = 'dob';
      const message = 'dob should be a valid time';
      const args = [];
      const passes = yield Validations.time(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should skip validation when field does not exists', function *() {
      const data = {};
      const field = 'dob';
      const message = 'dob should be a valid time';
      const args = [];
      const passes = yield Validations.time(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when field value is undefined', function *() {
      const data = {dob: undefined};
      const field = 'dob';
      const message = 'dob should be a valid time';
      const args = [];
      const passes = yield Validations.date(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });
  });

  describe('in', function () {
    it('should throw an error when field value is not in defined fields', function *() {
      const data = {gender: 'Foo'};
      const field = 'gender';
      const message = 'select valid gender';
      const args = ['F', 'M', 'O'];
      try {
        const passes = yield Validations.in(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should work fine when value of field is under one of the defined values', function *() {
      const data = {gender: 'F'};
      const field = 'gender';
      const message = 'select valid gender';
      const args = ['F', 'M', 'O'];
      const passes = yield Validations.in(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should work fine when expected values are integer', function *() {
      const data = {marks: 10};
      const field = 'marks';
      const message = 'select valid marks';
      const args = [10, 20, 40];
      const passes = yield Validations.in(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should work fine when expected values are integer and args are string', function *() {
      const data = {marks: 10};
      const field = 'marks';
      const message = 'select valid marks';
      const args = ['10', '20', '40'];
      const passes = yield Validations.in(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should skip validation when field does not exists', function *() {
      const data = {};
      const field = 'marks';
      const message = 'select valid marks';
      const args = [10, 20, 40];
      const passes = yield Validations.in(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when field value is undefined', function *() {
      const data = {marks: undefined};
      const field = 'marks';
      const message = 'select valid marks';
      const args = [10, 20, 40];
      const passes = yield Validations.in(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });
  });

  describe('notIn', function () {
    it('should throw an error when field value is in defined fields', function *() {
      const data = {username: 'admin'};
      const field = 'username';
      const message = 'select valid username';
      const args = ['admin', 'super', 'root'];
      try {
        const passes = yield Validations.notIn(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should work fine when field value is not one of the given options', function *() {
      const data = {username: 'foo'};
      const field = 'username';
      const message = 'select valid username';
      const args = ['admin', 'super', 'root'];
      const passes = yield Validations.notIn(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should skip validation when field is undefined', function *() {
      const data = {};
      const field = 'username';
      const message = 'select valid username';
      const args = ['admin', 'super', 'root'];
      const passes = yield Validations.notIn(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when field value is undefined', function *() {
      const data = {username: undefined};
      const field = 'username';
      const message = 'select valid username';
      const args = ['admin', 'super', 'root'];
      const passes = yield Validations.notIn(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });
  });

  describe('requiredIf', function () {
    it('should skip validation when conditional field does not exists', function *() {
      const data = {};
      const field = 'password_confirm';
      const message = 'please confirm password';
      const args = ['password'];
      const passes = yield Validations.requiredIf(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should throw error when conditional field exists and field under validation is missing', function *() {
      const data = {password: 'foobar'};
      const field = 'password_confirm';
      const message = 'please confirm password';
      const args = ['password'];
      try {
        const passes = yield Validations.requiredIf(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should skip validation when conditional field is null', function *() {
      const data = {password: null};
      const field = 'password_confirm';
      const message = 'please confirm password';
      const args = ['password'];
      const passes = yield Validations.requiredIf(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should work fine when field under validation is available', function *() {
      const data = {password: 'foobar', 'password_confirm': 'foobar'};
      const field = 'password_confirm';
      const message = 'please confirm password';
      const args = ['password'];
      const passes = yield Validations.requiredIf(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });
  });

  describe('requiredWithAny', function () {
    it('should work fine when none of the targeted fields are present', function *() {
      const data = {};
      const field = 'password';
      const message = 'password is required after username or email';
      const args = ['username', 'email'];
      const passes = yield Validations.requiredWithAny(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should thrown an error when any of the targeted fields are present but actual field is missing', function *() {
      const data = {username: 'foo'};
      const field = 'password';
      const message = 'password is required after username or email';
      const args = ['username', 'email'];
      try {
        const passes = yield Validations.requiredWithAny(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should thrown an error when any of the targeted fields are present but actual field is value is null', function *() {
      const data = {username: 'foo', password: null};
      const field = 'password';
      const message = 'password is required after username or email';
      const args = ['username', 'email'];
      try {
        const passes = yield Validations.requiredWithAny(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should work fine when any of the targeted fields are present and actual field value is valid', function *() {
      const data = {username: 'foo', password: 'bar'};
      const field = 'password';
      const message = 'password is required after username or email';
      const args = ['username', 'email'];
      const passes = yield Validations.requiredWithAny(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });
  });

  describe('requiredWithAll', function () {
    it('should work fine when none of the targeted fields are present', function *() {
      const data = {};
      const field = 'password';
      const message = 'password is required after username or email';
      const args = ['username', 'email'];
      const passes = yield Validations.requiredWithAll(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should thrown an error when all of the targeted fields are present but actual field is missing', function *() {
      const data = {username: 'foo', 'email': 'foo@bar.com'};
      const field = 'password';
      const message = 'password is required after username or email';
      const args = ['username', 'email'];
      try {
        const passes = yield Validations.requiredWithAll(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should thrown an error when all of the targeted fields are present but actual field is value is null', function *() {
      const data = {username: 'foo', email: 'foo@bar.com', password: null};
      const field = 'password';
      const message = 'password is required after username or email';
      const args = ['username', 'email'];
      try {
        const passes = yield Validations.requiredWithAll(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should work fine when all of the targeted fields are present and actual field value is valid', function *() {
      const data = {username: 'foo', password: 'bar', 'email': 'foo@bar.com'};
      const field = 'password';
      const message = 'password is required after username or email';
      const args = ['username', 'email'];
      const passes = yield Validations.requiredWithAll(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should work fine when any of the targeted fields are missings and actual field value is missing too', function *() {
      const data = {username: 'foo'};
      const field = 'password';
      const message = 'password is required after username or email';
      const args = ['username', 'email'];
      const passes = yield Validations.requiredWithAll(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });
  });

  describe('requiredWithoutAny', function () {
    it('should work fine when all the targeted fields are present', function *() {
      const data = {username: 'foo', email: 'foo@bar.com'};
      const field = 'password';
      const message = 'enter email or password';
      const args = ['username', 'email'];
      const passes = yield Validations.requiredWithoutAny(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should thrown an error when any of the targeted fields are missing and actual field is missing', function *() {
      const data = {username: 'foo'};
      const field = 'password';
      const message = 'enter email or password';
      const args = ['username', 'email'];
      try {
        const passes = yield Validations.requiredWithoutAny(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should thrown an error when any of the targeted fields are missing and actual field is value is null', function *() {
      const data = {username: 'foo', password: null};
      const field = 'password';
      const message = 'enter email or password';
      const args = ['username', 'email'];
      try {
        const passes = yield Validations.requiredWithoutAny(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should work fine when all of the targeted fields are missing and actual field value is valid', function *() {
      const data = {password: 'foobar'};
      const field = 'password';
      const message = 'enter email or password';
      const args = ['username', 'email'];
      const passes = yield Validations.requiredWithoutAny(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });
  });

  describe('requiredWithoutAll', function () {
    it('should work fine when all the targeted fields are present', function *() {
      const data = {username: 'foo', email: 'foo@bar.com'};
      const field = 'password';
      const message = 'enter username, email or password';
      const args = ['username', 'email'];
      const passes = yield Validations.requiredWithoutAll(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should thrown an error when all of the targeted fields are missing and actual field is missing', function *() {
      const data = {};
      const field = 'password';
      const message = 'enter username, email or password';
      const args = ['username', 'email'];
      try {
        const passes = yield Validations.requiredWithoutAll(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should thrown an error when all of the targeted fields are missing and actual field is value is null', function *() {
      const data = {password: null};
      const field = 'password';
      const message = 'enter username, email or password';
      const args = ['username', 'email'];
      try {
        const passes = yield Validations.requiredWithoutAll(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should work fine when all of the targeted fields are missing and actual field value is valid', function *() {
      const data = {password: 'foobar'};
      const field = 'password';
      const message = 'enter username, email or password';
      const args = ['username', 'email'];
      const passes = yield Validations.requiredWithoutAll(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should work fine when any of the targeted fields are missing and actual field value is not present', function *() {
      const data = {username: 'foo'};
      const field = 'password';
      const message = 'enter username, email or password';
      const args = ['username', 'email'];
      const passes = yield Validations.requiredWithoutAll(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });
  });

  describe('same', function () {
    it('should thrown an error when value of targeted field is not equal to defined field', function *() {
      const data = {password: 'foo', 'password_confirm': 'bar'};
      const field = 'password_confirm';
      const message = 'password should match';
      const args = ['password'];
      try {
        const passes = yield Validations.same(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should skip validation when target field does not exists', function *() {
      const data = {'password_confirm': 'bar'};
      const field = 'password_confirm';
      const message = 'password should match';
      const args = ['password'];
      const passes = yield Validations.same(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when actual field does not exists', function *() {
      const data = {};
      const field = 'password_confirm';
      const message = 'password should match';
      const args = ['password'];
      const passes = yield Validations.same(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should work fine when value for both field matches', function *() {
      const data = {password: 'foo', password_confirm: 'foo'};
      const field = 'password_confirm';
      const message = 'password should match';
      const args = ['password'];
      const passes = yield Validations.same(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should skip validation when targeted field value exists but actual field does not exists', function *() {
      const data = {password: 'foo'};
      const field = 'password_confirm';
      const message = 'password should match';
      const args = ['password'];
      const passes = yield Validations.same(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });
  });

  describe('different', function () {
    it('should thrown an error when value of targeted field is equal to defined field', function *() {
      const data = {dob: '2011-20-10', 'enrollment_date': '2011-20-10'};
      const field = 'enrollment_date';
      const message = 'enrollment date should be different from dob';
      const args = ['dob'];
      try {
        const passes = yield Validations.different(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should skip validation when target field does not exists', function *() {
      const data = {'enrollment_date': '2011-20-10'};
      const field = 'enrollment_date';
      const message = 'enrollment date should be different from dob';
      const args = ['dob'];
      const passes = yield Validations.different(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when actual field does not exists', function *() {
      const data = {};
      const field = 'enrollment_date';
      const message = 'enrollment date should be different from dob';
      const args = ['dob'];
      const passes = yield Validations.different(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should work fine when value for both fields are different', function *() {
      const data = {dob: '2011-20-10', 'enrollment_date': '2011-20-20'};
      const field = 'enrollment_date';
      const message = 'enrollment date should be different from dob';
      const args = ['dob'];
      const passes = yield Validations.different(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should skip validation when targeted field value exists but actual field does not exists', function *() {
      const data = {dob: '2011-20-10'};
      const field = 'enrollment_date';
      const message = 'enrollment date should be different from dob';
      const args = ['dob'];
      const passes = yield Validations.different(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });
  });

  describe('range', function () {
    it('should throw an error when value of field is less then defined range', function *() {
      const data = {age: 16};
      const field = 'age';
      const message = 'only adults less than 60 years of age are allowed';
      const args = [18, 60];
      try {
        const passes = yield Validations.range(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should throw an error when value of field is greater then defined range', function *() {
      const data = {age: 61};
      const field = 'age';
      const message = 'only adults less than 60 years of age are allowed';
      const args = [18, 60];
      try {
        const passes = yield Validations.range(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should throw an error when min value is not defined', function *() {
      const data = {age: 61};
      const field = 'age';
      const message = 'only adults less than 60 years of age are allowed';
      const args = [null, 60];
      try {
        const passes = yield Validations.range(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.match(/min and max values are required/);
      }
    });

    it('should throw an error when max value is not defined', function *() {
      const data = {age: 61};
      const field = 'age';
      const message = 'only adults less than 60 years of age are allowed';
      const args = [18];
      try {
        const passes = yield Validations.range(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.match(/min and max values are required/);
      }
    });

    it('should skip validation when field does not exists', function *() {
      const data = {};
      const field = 'age';
      const message = 'only adults less than 60 years of age are allowed';
      const args = [18, 60];
      const passes = yield Validations.range(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when field value is undefined', function *() {
      const data = {age: undefined};
      const field = 'age';
      const message = 'only adults less than 60 years of age are allowed';
      const args = [18, 60];
      const passes = yield Validations.range(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should work fine when field value is under defined range(string)', function *() {
      const data = {age: 20};
      const validations = [{name: 'numeric', args: []}];
      const field = 'age';
      const message = 'only adults less than 60 years of age are allowed';
      const args = ['18', 60];
      const passes = yield Validations.range(data, field, message, args, validations);
      expect(passes).to.equal('validation passed');
    });

    it('should work fine when field value is under defined range', function *() {
      const data = {age: 20};
      const validations = [{name: 'numeric', args: []}];
      const field = 'age';
      const message = 'only adults less than 60 years of age are allowed';
      const args = [18, 60];
      const passes = yield Validations.range(data, field, message, args, validations);
      expect(passes).to.equal('validation passed');
    });
  });

  describe('min', function () {
    describe('number', function () {
      it('should throw error when length of string field is less than defined length', function *() {
        const data = {price: '4'};
        const validations = [{name: 'string', args: []}];
        const field = 'price';
        const message = 'price should be at least 3';
        const args = [3];
        try {
          const passes = yield Validations.min(data, field, message, args, validations);
          expect(passes).not.to.exist();
        } catch (e) {
          expect(e).to.equal(message);
        }
      });

      it('should throw error when length of field is less than defined length', function *() {
        const data = {price: 2};
        const validations = [{name: 'numeric', args: []}];
        const field = 'price';
        const message = 'price should be at least 3';
        const args = [3];
        try {
          const passes = yield Validations.min(data, field, message, args, validations);
          expect(passes).not.to.exist();
        } catch (e) {
          expect(e).to.equal(message);
        }
      });

      it('should skip validation when field does not exists', function *() {
        const data = {};
        const validations = [{name: 'numeric', args: []}];
        const field = 'price';
        const message = 'price should be over 6 characters';
        const args = [6];
        const passes = yield Validations.min(data, field, message, args, validations);
        expect(passes).to.equal('validation skipped');
      });

      it('should skip validation when field value is undefined', function *() {
        const data = {price: undefined};
        const validations = [{name: 'numeric', args: []}];
        const field = 'price';
        const message = 'price should be over 6 characters';
        const args = [6];
        const passes = yield Validations.min(data, field, message, args, validations);
        expect(passes).to.equal('validation skipped');
      });

      it('should work fine when length of value of field is greater than defined length', function *() {
        const data = {price: 10};
        const validations = [{name: 'numeric', args: []}];
        const field = 'price';
        const message = 'price should be over 6';
        const args = [6];
        const passes = yield Validations.min(data, field, message, args, validations);
        expect(passes).to.equal('validation passed');
      });

      it('should work fine when length of value of field is equal to the defined length', function *() {
        const data = {price: 6};
        const validations = [{name: 'numeric', args: []}];
        const field = 'price';
        const message = 'price should be over 6';
        const args = [6];
        const passes = yield Validations.min(data, field, message, args, validations);
        expect(passes).to.equal('validation passed');
      });

    });
    describe('string: ', function () {
      it('should throw error when length of field is less than defined length', function *() {
        const data = {password: 'foo'};
        const field = 'password';
        const message = 'password should be over 6 characters';
        const args = [6];
        try {
          const passes = yield Validations.min(data, field, message, args);
          expect(passes).not.to.exist();
        } catch (e) {
          expect(e).to.equal(message);
        }
      });

      it('should throw error when length of field as number is less than defined length', function *() {
        const data = {password: 990};
        const field = 'password';
        const message = 'password should be over 6 characters';
        const args = [6];
        try {
          const passes = yield Validations.min(data, field, message, args);
          expect(passes).not.to.exist();
        } catch (e) {
          expect(e).to.equal(message);
        }
      });

      it('should skip validation when field does not exists', function *() {
        const data = {};
        const field = 'password';
        const message = 'password should be over 6 characters';
        const args = [6];
        const passes = yield Validations.min(data, field, message, args);
        expect(passes).to.equal('validation skipped');
      });

      it('should skip validation when field value is undefined', function *() {
        const data = {password: undefined};
        const field = 'password';
        const message = 'password should be over 6 characters';
        const args = [6];
        const passes = yield Validations.min(data, field, message, args);
        expect(passes).to.equal('validation skipped');
      });

      it('should work fine when length of value of field is greater than defined length', function *() {
        const data = {password: 'foobarbaz'};
        const field = 'password';
        const message = 'password should be over 6 characters';
        const args = [6];
        const passes = yield Validations.min(data, field, message, args);
        expect(passes).to.equal('validation passed');
      });

      it('should work fine when length of value of field is equal to the defined length', function *() {
        const data = {password: 'foobar'};
        const field = 'password';
        const message = 'password should be over 6 characters';
        const args = [6];
        const passes = yield Validations.min(data, field, message, args);
        expect(passes).to.equal('validation passed');
      });
    });
    describe('array: ', function () {
      it('should throw error when length of field as array is less than defined length', function *() {
        const data = {user: ['1', '2', '3']};
        const field = 'user';
        const message = 'user should be less than 4 length';
        const args = [4];
        try {
          const passes = yield Validations.min(data, field, message, args);
          expect(passes).not.to.exist();
        } catch (e) {
          expect(e).to.equal(message);
        }
      });

      it('should work fine when length of value of field is equal to the defined length', function *() {
        const data = {user: ['1', '2']};
        const field = 'user';
        const message = 'user should be less than 2 length';
        const args = [2];
        const passes = yield Validations.min(data, field, message, args);
        expect(passes).to.equal('validation passed');
      });
    });
  });

  describe('max', function () {
    describe('number', function () {
      it('should throw error when length of string field is less than defined length', function *() {
        const data = {price: '0.5'};
        const validations = [{name: 'string', args: []}];
        const field = 'price';
        const message = 'price should be max 1';
        const args = [1];
        try {
          const passes = yield Validations.max(data, field, message, args, validations);
          expect(passes).not.to.exist();
        } catch (e) {
          expect(e).to.equal(message);
        }
      });

      it('should throw error when length of field is greater than defined length', function *() {
        const data = {price: 2};
        const validations = [{name: 'numeric', args: []}];
        const field = 'price';
        const message = 'price should be at least 3';
        const args = [1];
        try {
          const passes = yield Validations.max(data, field, message, args, validations);
          expect(passes).not.to.exist();
        } catch (e) {
          expect(e).to.equal(message);
        }
      });

      it('should skip validation when field does not exists', function *() {
        const data = {};
        const validations = [{name: 'numeric', args: []}];
        const field = 'price';
        const message = 'price should be over 6 characters';
        const args = [6];
        const passes = yield Validations.max(data, field, message, args, validations);
        expect(passes).to.equal('validation skipped');
      });

      it('should skip validation when field value is undefined', function *() {
        const data = {price: undefined};
        const validations = [{name: 'numeric', args: []}];
        const field = 'price';
        const message = 'price should be over 6 characters';
        const args = [6];
        const passes = yield Validations.max(data, field, message, args, validations);
        expect(passes).to.equal('validation skipped');
      });

      it('should work fine when length of value of field is less than defined length', function *() {
        const data = {price: 10};
        const validations = [{name: 'numeric', args: []}];
        const field = 'price';
        const message = 'price should be over 6';
        const args = [11];
        const passes = yield Validations.max(data, field, message, args, validations);
        expect(passes).to.equal('validation passed');
      });

      it('should work fine when length of value of field is equal to the defined length', function *() {
        const data = {price: 6};
        const validations = [{name: 'numeric', args: []}];
        const field = 'price';
        const message = 'price should be over 6';
        const args = [6];
        const passes = yield Validations.max(data, field, message, args, validations);
        expect(passes).to.equal('validation passed');
      });

    });
    describe('string: ', function () {
      it('should throw error when length of field is greater than defined length', function *() {
        const data = {password: 'foobarbaz'};
        const field = 'password';
        const message = 'password should be less than 6 characters';
        const args = [6];
        try {
          const passes = yield Validations.max(data, field, message, args);
          expect(passes).not.to.exist();
        } catch (e) {
          expect(e).to.equal(message);
        }
      });

      it('should throw error when length of field as number is greater than defined length', function *() {
        const data = {password: 1990909990};
        const field = 'password';
        const message = 'password should be less than 6 characters';
        const args = [6];
        try {
          const passes = yield Validations.max(data, field, message, args);
          expect(passes).not.to.exist();
        } catch (e) {
          expect(e).to.equal(message);
        }
      });

      it('should skip validation when field does not exists', function *() {
        const data = {};
        const field = 'password';
        const message = 'password should be less than 6 characters';
        const args = [6];
        const passes = yield Validations.max(data, field, message, args);
        expect(passes).to.equal('validation skipped');
      });

      it('should skip validation when field value is undefined', function *() {
        const data = {password: undefined};
        const field = 'password';
        const message = 'password should be less than 6 characters';
        const args = [6];
        const passes = yield Validations.max(data, field, message, args);
        expect(passes).to.equal('validation skipped');
      });

      it('should work fine when length of value of field is less than defined length', function *() {
        const data = {password: 'foo'};
        const field = 'password';
        const message = 'password should be less than 6 characters';
        const args = [6];
        const passes = yield Validations.max(data, field, message, args);
        expect(passes).to.equal('validation passed');
      });

      it('should work fine when length of value of field is equal to the defined length', function *() {
        const data = {password: 'foobar'};
        const field = 'password';
        const message = 'password should be less than 6 characters';
        const args = [6];
        const passes = yield Validations.max(data, field, message, args);
        expect(passes).to.equal('validation passed');
      });
    });
    describe('array: ', function () {
      it('should throw error when length of field as array is greater than defined length', function *() {
        const data = {user: ['1', '2', '3']};
        const field = 'user';
        const message = 'user should be less than 2 length';
        const args = [2];
        try {
          const passes = yield Validations.max(data, field, message, args);
          expect(passes).not.to.exist();
        } catch (e) {
          expect(e).to.equal(message);
        }
      });

      it('should work fine when length of value of field is equal to the defined length', function *() {
        const data = {user: ['1', '2']};
        const field = 'user';
        const message = 'user should be less than 2 length';
        const args = [2];
        const passes = yield Validations.max(data, field, message, args);
        expect(passes).to.equal('validation passed');
      });
    });
  });

  describe('includes', function () {
    it('should throw an error when string does not include defined substring', function *() {
      const data = {dpath: 'foo/bar'};
      const field = 'dpath';
      const message = 'path should include app directory';
      const args = ['app'];
      try {
        const passes = yield Validations.includes(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should skip validation when field does not exists', function *() {
      const data = {};
      const field = 'dpath';
      const message = 'path should include app directory';
      const args = ['app'];
      const passes = yield Validations.includes(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when field value is undefined', function *() {
      const data = {dpath: undefined};
      const field = 'dpath';
      const message = 'path should include app directory';
      const args = ['app'];
      const passes = yield Validations.includes(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should work fine when field value includes given string', function *() {
      const data = {dpath: '/app/bar'};
      const field = 'dpath';
      const message = 'path should include app directory';
      const args = ['app'];
      const passes = yield Validations.includes(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });
  });

  describe('startsWith', function () {
    it('should throw an error when string does not startsWith defined substring', function *() {
      const data = {username: 'foo'};
      const field = 'username';
      const message = 'username should start with D';
      const args = ['D'];
      try {
        const passes = yield Validations.startsWith(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should skip validation when field does not exists', function *() {
      const data = {};
      const field = 'username';
      const message = 'username should start with D';
      const args = ['D'];
      const passes = yield Validations.startsWith(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when field value is undefined', function *() {
      const data = {username: undefined};
      const field = 'username';
      const message = 'username should start with D';
      const args = ['D'];
      const passes = yield Validations.startsWith(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should work fine when field value startsWith given string', function *() {
      const data = {username: 'Doe'};
      const field = 'username';
      const message = 'username should start with D';
      const args = ['D'];
      const passes = yield Validations.startsWith(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });
  });

  describe('endsWith', function () {
    it('should throw an error when string does not endsWith defined substring', function *() {
      const data = {username: 'foo'};
      const field = 'username';
      const message = 'username should end with e';
      const args = ['e'];
      try {
        const passes = yield Validations.endsWith(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should skip validation when field does not exists', function *() {
      const data = {};
      const field = 'username';
      const message = 'username should end with e';
      const args = ['e'];
      const passes = yield Validations.endsWith(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when field value is undefined', function *() {
      const data = {username: undefined};
      const field = 'username';
      const message = 'username should end with e';
      const args = ['e'];
      const passes = yield Validations.endsWith(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should work fine when field value endsWith given string', function *() {
      const data = {username: 'Doe'};
      const field = 'username';
      const message = 'username should end with e';
      const args = ['e'];
      const passes = yield Validations.endsWith(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });
  });

  describe('regex', function () {
    it('should throw an error when value does not match regex', function *() {
      const data = {email: 'foo'};
      const field = 'email';
      const message = 'email should match given regex';
      const args = [/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0, 66})\.([a-z]{2, 6}(?:\.[a-z]{2})?)$/];
      try {
        const passes = yield Validations.regex(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should skip validation when fields does not exists', function *() {
      const data = {};
      const field = 'country';
      const message = 'country should be India with I as uppercase';
      const args = ['[a-z]'];
      const passes = yield Validations.regex(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when fields value is undefined', function *() {
      const data = {country: undefined};
      const field = 'country';
      const message = 'country should be India with I as uppercase';
      const args = ['[a-z]'];
      const passes = yield Validations.regex(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should work fine when field value satisfies regex pattern', function *() {
      const data = {country: 'India'};
      const field = 'country';
      const message = 'country should be India with I as uppercase';
      const args = ['[a-z]', 'i'];
      const passes = yield Validations.regex(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });
  });

  describe('alphaNumeric', function () {
    it('should throw an error when value is not alpha numeric', function *() {
      const data = {username: 'virk@123'};
      const field = 'username';
      const message = 'username must letters and numbers only';
      const args = [];
      try {
        const passes = yield Validations.alphaNumeric(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should work fine when value is a valid alpha numeric', function *() {
      const data = {username: 'virk123'};
      const field = 'username';
      const message = 'username must letters and numbers only';
      const args = [];
      const passes = yield Validations.alphaNumeric(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should skip validation when field does not exists', function *() {
      const data = {};
      const field = 'username';
      const message = 'username must letters and numbers only';
      const args = [];
      const passes = yield Validations.alphaNumeric(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when field value is undefined', function *() {
      const data = {username: undefined};
      const field = 'username';
      const message = 'username must letters and numbers only';
      const args = [];
      const passes = yield Validations.alphaNumeric(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });
  });

  describe('array', function () {
    it('should throw an error when value is not a valid array', function *() {
      const data = {users: 'foo'};
      const field = 'users';
      const message = 'users list must be an array';
      const args = [];
      try {
        const passes = yield Validations.array(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should work fine when value is a valid array', function *() {
      const data = {users: ['doe', 'foo', 'bar']};
      const field = 'users';
      const message = 'users list must be an array';
      const args = [];
      const passes = yield Validations.array(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should skip validation when field does not exists', function *() {
      const data = {};
      const field = 'users';
      const message = 'users list must be an array';
      const args = [];
      const passes = yield Validations.array(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when field value is undefined', function *() {
      const data = {users: undefined};
      const field = 'users';
      const message = 'users list must be an array';
      const args = [];
      const passes = yield Validations.array(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should throw an error when value of field is an object', function *() {
      const data = {users: {name: 'foo'}};
      const field = 'users';
      const message = 'users list must be an array';
      const args = [];
      try {
        const passes = yield Validations.array(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });
  });

  describe('url', function () {
    it('should throw an error when value is not a valid url', function *() {
      const data = {github_profile: 'foo'};
      const field = 'github_profile';
      const message = 'github profile must point to a valid url ';
      const args = [];
      try {
        const passes = yield Validations.url(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should work fine when value is a valid url', function *() {
      const data = {github_profile: 'http://github.com/thetutlage'};
      const field = 'github_profile';
      const message = 'github profile must point to a valid url ';
      const args = [];
      const passes = yield Validations.url(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should skip validation when field does not exists', function *() {
      const data = {};
      const field = 'github_profile';
      const message = 'github profile must point to a valid url ';
      const args = [];
      const passes = yield Validations.url(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when field value is undefined', function *() {
      const data = {github_profile: undefined};
      const field = 'github_profile';
      const message = 'github profile must point to a valid url ';
      const args = [];
      const passes = yield Validations.url(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });
  });

  describe('uuid', function () {
    it('should throw an error when value is not a valid uuid', function *() {
      const data = {github_profile: 'foo'};
      const field = 'github_profile';
      const message = 'github profile must point to a valid uuid ';
      const args = [];
      try {
        const passes = yield Validations.uuid(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should work fine when value is a valid uuid', function *() {
      const data = {github_profile: '135b71db-ee7d-43ea-9f6d-16227fa82ad9'};
      const field = 'github_profile';
      const message = 'github profile must point to a valid uuid ';
      const args = [];
      const passes = yield Validations.uuid(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should skip validation when field does not exists', function *() {
      const data = {};
      const field = 'github_profile';
      const message = 'github profile must point to a valid uuid ';
      const args = [];
      const passes = yield Validations.uuid(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when field value is undefined', function *() {
      const data = {github_profile: undefined};
      const field = 'github_profile';
      const message = 'github profile must point to a valid uuid ';
      const args = [];
      const passes = yield Validations.uuid(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });
  });

  describe('ip', function () {
    it('should throw an error when value is not a valid ip address', function *() {
      const data = {user_ip: '909090909'};
      const field = 'user_ip';
      const message = 'invalid ip address';
      const args = [];
      try {
        const passes = yield Validations.ip(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should work fine when value is a valid ip address', function *() {
      const data = {user_ip: '127.0.0.1'};
      const field = 'user_ip';
      const message = 'invalid ip address';
      const args = [];
      const passes = yield Validations.ip(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should skip validation when field does not exists', function *() {
      const data = {};
      const field = 'user_ip';
      const message = 'invalid ip address';
      const args = [];
      const passes = yield Validations.ip(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when field value is undefined', function *() {
      const data = {user_ip: undefined};
      const field = 'user_ip';
      const message = 'invalid ip address';
      const args = [];
      const passes = yield Validations.ip(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });
  });

  describe('integer', function () {
    it('should throw an error when value is a string', function *() {
      const data = {marks: '10'};
      const field = 'marks';
      const message = 'marks should be an integer';
      const args = [];
      try {
        const passes = yield Validations.integer(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should throw an error when value is a float', function *() {
      const data = {marks: 10.1};
      const field = 'marks';
      const message = 'marks should be an integer';
      const args = [];
      try {
        const passes = yield Validations.integer(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should skip validation when field does not exists', function *() {
      const data = {};
      const field = 'marks';
      const message = 'marks should be an integer';
      const args = [];
      const passes = yield Validations.integer(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when field value is undefined', function *() {
      const data = {marks: undefined};
      const field = 'marks';
      const message = 'marks should be an integer';
      const args = [];
      const passes = yield Validations.integer(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should work fine when value is an integer', function *() {
      const data = {marks: 10};
      const field = 'marks';
      const message = 'marks should be an integer';
      const args = [];
      const passes = yield Validations.integer(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should work fine when value is an integer with zero precision', function *() {
      const data = {marks: 10.0};
      const field = 'marks';
      const message = 'marks should be an integer';
      const args = [];
      const passes = yield Validations.integer(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });
  });

  describe('boolean', function () {
    it('should throw an error when value is not a boolean', function *() {
      const data = {is_admin: 20};
      const field = 'is_admin';
      const message = 'admin identifier should be boolean indicator';
      const args = [];
      try {
        const passes = yield Validations.boolean(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should throw an error when value is a string', function *() {
      const data = {is_admin: '20'};
      const field = 'is_admin';
      const message = 'admin identifier should be boolean indicator';
      const args = [];
      try {
        const passes = yield Validations.boolean(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should skip validation when field does not exists', function *() {
      const data = {};
      const field = 'is_admin';
      const message = 'admin identifier should be boolean indicator';
      const args = [];
      const passes = yield Validations.boolean(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when field value is undefined', function *() {
      const data = {is_admin: undefined};
      const field = 'is_admin';
      const message = 'admin identifier should be boolean indicator';
      const args = [];
      const passes = yield Validations.boolean(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should work fine when value is a valid positive boolean', function *() {
      const data = {is_admin: true};
      const field = 'is_admin';
      const message = 'admin identifier should be boolean indicator';
      const args = [];
      const passes = yield Validations.boolean(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should work fine when value is a valid negative boolean', function *() {
      const data = {is_admin: false};
      const field = 'is_admin';
      const message = 'admin identifier should be boolean indicator';
      const args = [];
      const passes = yield Validations.boolean(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should work fine when value is a valid positive numeric boolean', function *() {
      const data = {is_admin: 1};
      const field = 'is_admin';
      const message = 'admin identifier should be boolean indicator';
      const args = [];
      const passes = yield Validations.boolean(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should work fine when value is a valid negative numeric boolean', function *() {
      const data = {is_admin: 0};
      const field = 'is_admin';
      const message = 'admin identifier should be boolean indicator';
      const args = [];
      const passes = yield Validations.boolean(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should work fine when value is a string representation of 0', function *() {
      const data = {is_admin: '0'};
      const field = 'is_admin';
      const message = 'admin identifier should be boolean indicator';
      const args = [];
      const passes = yield Validations.boolean(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should work fine when value is a string representation of 1', function *() {
      const data = {is_admin: '1'};
      const field = 'is_admin';
      const message = 'admin identifier should be boolean indicator';
      const args = [];
      const passes = yield Validations.boolean(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });
  });

  describe('object', function () {
    it('should throw an error when value is not a valid object', function *() {
      const data = {profile: 'foo'};
      const field = 'profile';
      const message = 'profile must be an object';
      const args = [];
      try {
        const passes = yield Validations.object(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should work fine when value is a valid object', function *() {
      const data = {profile: {username: 'foo'}};
      const field = 'profile';
      const message = 'profile must be an object';
      const args = [];
      const passes = yield Validations.object(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should skip validation when field does not exists', function *() {
      const data = {};
      const field = 'profile';
      const message = 'profile must be an object';
      const args = [];
      const passes = yield Validations.object(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when field value is undefined', function *() {
      const data = {profile: undefined};
      const field = 'profile';
      const message = 'profile must be an object';
      const args = [];
      const passes = yield Validations.object(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should throw an error when value of field is an array', function *() {
      const data = {profile: ['username']};
      const field = 'profile';
      const message = 'profile must be an object';
      const args = [];
      try {
        const passes = yield Validations.object(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });
  });

  describe('numeric', function () {
    it('should throw an error when value is not a valid numeric', function *() {
      const data = {profile: 'foo'};
      const field = 'profile';
      const message = 'profile must be an number';
      const args = [];
      try {
        const passes = yield Validations.numeric(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should work fine when value is a valid numeric', function *() {
      const data = {profile: 123};
      const field = 'profile';
      const message = 'profile must be an number';
      const args = [];
      const passes = yield Validations.numeric(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should work fine when value is a valid numeric(string)', function *() {
      const data = {profile: '213'};
      const field = 'profile';
      const message = 'profile must be an number';
      const args = [];
      const passes = yield Validations.numeric(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should skip validation when field does not exists', function *() {
      const data = {};
      const field = 'profile';
      const message = 'profile must be an number';
      const args = [];
      const passes = yield Validations.numeric(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when field value is undefined', function *() {
      const data = {profile: undefined};
      const field = 'profile';
      const message = 'profile must be an number';
      const args = [];
      const passes = yield Validations.numeric(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

  });

  describe('json', function () {
    it('should throw an error when value is not a valid json string', function *() {
      const data = {profile: 'foo'};
      const field = 'profile';
      const message = 'profile must be in json';
      const args = [];
      try {
        const passes = yield Validations.json(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should work fine when value is a valid json string', function *() {
      const data = {profile: JSON.stringify({name: 'foo'})};
      const field = 'profile';
      const message = 'profile must be in json';
      const args = [];
      const passes = yield Validations.json(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should skip validation when field does not exists', function *() {
      const data = {};
      const field = 'profile';
      const message = 'profile must be in json';
      const args = [];
      const passes = yield Validations.json(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when field value is undefined', function *() {
      const data = {profile: undefined};
      const field = 'profile';
      const message = 'profile must be in json';
      const args = [];
      const passes = yield Validations.json(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });
  });

  describe('ipv4', function () {
    it('should throw an error when value is not a valid ipv4 address', function *() {
      const data = {user_ip: '2001:DB8:0:0:1::1'};
      const field = 'user_ip';
      const message = 'invalid ipv4 address';
      const args = [];
      try {
        const passes = yield Validations.ipv4(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should work fine when value is a valid ipv4 address', function *() {
      const data = {user_ip: '127.0.0.1'};
      const field = 'user_ip';
      const message = 'invalid ipv4 address';
      const args = [];
      const passes = yield Validations.ipv4(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should skip validation when field does not exists', function *() {
      const data = {};
      const field = 'user_ip';
      const message = 'invalid ipv4 address';
      const args = [];
      const passes = yield Validations.ipv4(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when field value is undefined', function *() {
      const data = {user_ip: undefined};
      const field = 'user_ip';
      const message = 'invalid ipv4 address';
      const args = [];
      const passes = yield Validations.ipv4(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });
  });

  describe('ipv6', function () {
    it('should throw an error when value is not a valid ipv6 address', function *() {
      const data = {user_ip: '127.0.0.1'};
      const field = 'user_ip';
      const message = 'invalid ipv6 address';
      const args = [];
      try {
        const passes = yield Validations.ipv6(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should work fine when value is a valid ipv6 address', function *() {
      const data = {user_ip: '2001:DB8:0:0:1::1'};
      const field = 'user_ip';
      const message = 'invalid ipv6 address';
      const args = [];
      const passes = yield Validations.ipv6(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should skip validation when field does not exists', function *() {
      const data = {};
      const field = 'user_ip';
      const message = 'invalid ipv6 address';
      const args = [];
      const passes = yield Validations.ipv6(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when field value is undefined', function *() {
      const data = {user_ip: undefined};
      const field = 'user_ip';
      const message = 'invalid ipv6 address';
      const args = [];
      const passes = yield Validations.ipv6(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });
  });

  describe('requiredWhen', function () {
    it('should skip validation when conditional field does not exists', function *() {
      const data = {};
      const field = 'state';
      const message = 'state is required';
      const args = ['country', 'US'];
      const passes = yield Validations.requiredWhen(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should throw error when conditional field value matches and field under validation is missing', function *() {
      const data = {country: 'US'};
      const field = 'state';
      const message = 'state is required';
      const args = ['country', 'US'];
      try {
        const passes = yield Validations.requiredWhen(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should skip validation when of value of conditional field does not match', function *() {
      const data = {country: 'UK'};
      const field = 'state';
      const message = 'state is required';
      const args = ['country', 'US'];
      const passes = yield Validations.requiredWhen(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when conditional field is null', function *() {
      const data = {country: null};
      const field = 'state';
      const message = 'state is required';
      const args = ['country', 'US'];
      const passes = yield Validations.requiredWhen(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should work fine when field under validation is available and conditional field value match', function *() {
      const data = {country: 'US', state: 'NewYork'};
      const field = 'state';
      const message = 'state is required';
      const args = ['country', 'US'];
      const passes = yield Validations.requiredWhen(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should work fine when field under validation is available and conditional field value match with boolean', function *() {
      const data = {country: false, state: 'NewYork'};
      const field = 'state';
      const message = 'state is required';
      const args = ['country', false];
      const passes = yield Validations.requiredWhen(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

  });

  describe('Confirmation', function () {
    it('should work fine when the confirmed field is equal', function *() {
      const data = {password: '1234', password_confirmation: '1234'};
      const field = 'password';
      const message = 'Password does not match!';
      const args = [];
      const passes = yield Validations.confirmed(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it("should throw an error when then confirmed field isn't equal", function *() {
      const data = {password: '1234', password_confirmation: '12345'};
      const field = 'password';
      const message = 'Password does not match!';
      const args = [];
      try {
        const passes = yield Validations.confirmed(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it("should throw an error when then confirmed field isn't equal", function *() {
      const data = {password: '1234', password_confirmation: undefined};
      const field = 'password';
      const message = 'Password does not match!';
      const args = [];
      try {
        const passes = yield Validations.confirmed(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should skip validation when field value is not defined', function *() {
      const data = {};
      const field = 'password';
      const message = 'Password does not match!';
      const args = [];
      const passes = yield Validations.confirmed(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when field value is undefined', function *() {
      const data = {password: undefined, password_confirmation: undefined};
      const field = 'password';
      const message = 'Password does not match!';
      const args = [];
      const passes = yield Validations.confirmed(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });
  });

  describe('String', function () {
    it('should work fine when the confirmed field is string', function *() {
      const data = {username: 'david'};
      const field = 'username';
      const message = 'Username should be a string';
      const args = [];
      const passes = yield Validations.string(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should throw an error when the confirmed field is a number', function *() {
      const data = {username: 1234};
      const field = 'username';
      const message = 'Username should be a string';
      const args = [];
      try {
        const passes = yield Validations.string(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should throw an error when the confirmed field is a boolean', function *() {
      const data = {username: true};
      const field = 'username';
      const message = 'Username should be a string';
      const args = [];
      try {
        const passes = yield Validations.string(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should skip validation when field value is not defined', function *() {
      const data = {};
      const field = 'username';
      const message = 'Username should be a string';
      const args = [];
      const passes = yield Validations.string(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when field value is undefined', function *() {
      const data = {username: undefined};
      const field = 'username';
      const message = 'Username should be a string';
      const args = [];
      const passes = yield Validations.lowercase(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });
  });

  describe('Lowercase', function () {
    it('should work fine when field value is lower case string', function *() {
      const data = {username: 'david'};
      const field = 'username';
      const message = 'Username should be a lower case string';
      const args = [];
      const passes = yield Validations.lowercase(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should throw an error when the confirmed field is a upper case', function *() {
      const data = {username: 'Abc'};
      const field = 'username';
      const message = 'Username should be a lower case string';
      const args = [];
      try {
        const passes = yield Validations.lowercase(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should skip validation when field value is not defined', function *() {
      const data = {};
      const field = 'username';
      const message = 'Username should be a lower case string';
      const args = [];
      const passes = yield Validations.lowercase(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when field value is undefined', function *() {
      const data = {username: undefined};
      const field = 'username';
      const message = 'Username should be a lower case string';
      const args = [];
      const passes = yield Validations.lowercase(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });
  });


  describe('Uppercase', function () {
    it('should work fine when field value is upper case string', function *() {
      const data = {username: 'DDD'};
      const field = 'username';
      const message = 'Username should be a upper case string';
      const args = [];
      const passes = yield Validations.uppercase(data, field, message, args);
      expect(passes).to.equal('validation passed');
    });

    it('should throw an error when the confirmed field is a upper case', function *() {
      const data = {username: 'aaD'};
      const field = 'username';
      const message = 'Username should be a upper case string';
      const args = [];
      try {
        const passes = yield Validations.uppercase(data, field, message, args);
        expect(passes).not.to.exist();
      } catch (e) {
        expect(e).to.equal(message);
      }
    });

    it('should skip validation when field value is not defined', function *() {
      const data = {};
      const field = 'username';
      const message = 'Username should be a upper case string';
      const args = [];
      const passes = yield Validations.uppercase(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });

    it('should skip validation when field value is undefined', function *() {
      const data = {username: undefined};
      const field = 'username';
      const message = 'Username should be a upper case string';
      const args = [];
      const passes = yield Validations.uppercase(data, field, message, args);
      expect(passes).to.equal('validation skipped');
    });
  });

});
