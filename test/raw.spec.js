'use strict';

const Is = require('../src/Raw');
const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');

describe('Raw Validator', function () {
  context('Types', function () {
    it('should return true when input is an array', function () {
      const isArray = Is.array(['22', '12']);
      expect(isArray).to.equal(true);
    });

    it('should return false when input is an object', function () {
      const isArray = Is.array({age: 22});
      expect(isArray).to.equal(false);
    });

    it('should return false when input is a string', function () {
      const isArray = Is.array('input');
      expect(isArray).to.equal(false);
    });

    it('should return true when input is a boolean', function () {
      const isBoolean = Is.boolean(true);
      expect(isBoolean).to.equal(true);
    });

    it('should return true when input is a negative boolean', function () {
      const isBoolean = Is.boolean(false);
      expect(isBoolean).to.equal(true);
    });

    it('should return true when input is a numeric true/false state', function () {
      const isBoolean = Is.boolean(1);
      expect(isBoolean).to.equal(true);
    });

    it('should return false when input is a string', function () {
      const isBoolean = Is.boolean('true');
      expect(isBoolean).to.equal(false);
    });

    it('should return true when input is a date', function () {
      const isDate = Is.date(new Date());
      expect(isDate).to.equal(true);
    });

    it('should return true when input is string representation of date', function () {
      const isDate = Is.date('2015-11-30');
      expect(isDate).to.equal(true);
    });

    it('should return false when input is invalid string representation of date', function () {
      const isDate = Is.date('2015-11-40');
      expect(isDate).to.equal(false);
    });

    it('should not convert date string to instance when strict is enabled', function () {
      const isDate = Is.date('2015-11-30', true);
      expect(isDate).to.equal(false);
    });

    it('should return true when input is a function', function () {
      const isFunction = Is.function(function () {
      });
      expect(isFunction).to.equal(true);
    });

    it('should return false when input is a string', function () {
      const isFunction = Is.function('function () {}');
      expect(isFunction).to.equal(false);
    });

    it('should return true when input is a native javascript function', function () {
      const isFunction = Is.function(toString);
      expect(isFunction).to.equal(true);
    });

    it('should return true when input is null', function () {
      const isNull = Is.null(null);
      expect(isNull).to.equal(true);
    });

    it('should return false when input is undefined', function () {
      const isNull = Is.null(undefined);
      expect(isNull).to.equal(false);
    });

    it('should return false when input is empty', function () {
      const isNull = Is.null('');
      expect(isNull).to.equal(false);
    });

    it('should return true when input is a number', function () {
      const isNumber = Is.number(10);
      expect(isNumber).to.equal(true);
    });

    it('should return true when input is constructed using Number method', function () {
      const isNumber = Is.number(Number('10'));
      expect(isNumber).to.equal(true);
    });

    it('should return false when input is a string', function () {
      const isNumber = Is.number('10');
      expect(isNumber).to.equal(false);
    });

    it('should return true when input is an object', function () {
      const isObject = Is.object({name: 'virk'});
      expect(isObject).to.equal(true);
    });

    it('should return false when input is not a stringify object', function () {
      const isObject = Is.object(JSON.stringify({name: 'virk'}));
      expect(isObject).to.equal(false);
    });

    it('should return true when input is json', function () {
      const isJson = Is.json(JSON.stringify({name: 'virk'}));
      expect(isJson).to.equal(true);
    });

    it('should return false when input is an object', function () {
      const isJson = Is.json({name: 'virk'});
      expect(isJson).to.equal(false);
    });

    it('should return true when input is a string', function () {
      const isString = Is.string('hello');
      expect(isString).to.equal(true);
    });

    it('should return true when input is created using string class', function () {
      const isString = Is.string(String(10));
      expect(isString).to.equal(true);
    });

    it('should return false when input is not a string', function () {
      const isString = Is.string(10);
      expect(isString).to.equal(false);
    });

    it('should return true when 2 inputs are of same type', function () {
      const isSameType = Is.sameType(10, 10);
      expect(isSameType).to.equal(true);
    });
  });

  context('Presence', function () {
    it('should return true when object is empty', function () {
      const isEmpty = Is.empty({});
      expect(isEmpty).to.equal(true);
    });

    it('should return true when array is empty', function () {
      const isEmpty = Is.empty([]);
      expect(isEmpty).to.equal(true);
    });

    it('should return true when empty string has been passed', function () {
      const isEmpty = Is.empty('');
      expect(isEmpty).to.equal(true);
    });

    it('should return true when null is passed', function () {
      const isEmpty = Is.empty(null);
      expect(isEmpty).to.equal(true);
    });

    it('should return true when undefined is passed', function () {
      const isEmpty = Is.empty(undefined);
      expect(isEmpty).to.equal(true);
    });

    it('should return false when number is passed', function () {
      const isEmpty = Is.empty(220);
      expect(isEmpty).to.equal(false);
    });

    it('should return false when date is passed', function () {
      const isEmpty = Is.empty(new Date());
      expect(isEmpty).to.equal(false);
    });

    it('should return false when string with value is passed', function () {
      const isEmpty = Is.empty('hello');
      expect(isEmpty).to.equal(false);
    });

    it('should return true when value exists but is an empty object', function () {
      const isExisty = Is.existy({});
      expect(isExisty).to.equal(true);
    });

    it('should return false when value is null', function () {
      const isExisty = Is.existy(null);
      expect(isExisty).to.equal(false);
    });

    it('should return false when value is undefined', function () {
      const isExisty = Is.existy(undefined);
      expect(isExisty).to.equal(false);
    });

    it('should return false when value is empty string', function () {
      const isExisty = Is.existy('');
      expect(isExisty).to.equal(false);
    });

    it('should return true when value is a positive boolean', function () {
      const isTruthy = Is.truthy(true);
      expect(isTruthy).to.equal(true);
    });

    it('should return true when value is a string', function () {
      const isTruthy = Is.truthy('true');
      expect(isTruthy).to.equal(true);
    });

    it('should return false when value is false', function () {
      const isTruthy = Is.truthy(false);
      expect(isTruthy).to.equal(false);
    });

    it('should return false when value is 0', function () {
      const isTruthy = Is.truthy(0);
      expect(isTruthy).to.equal(false);
    });

    it('should return true when value is 0', function () {
      const isFalsy = Is.falsy(0);
      expect(isFalsy).to.equal(true);
    });

    it('should return true when value is false', function () {
      const isFalsy = Is.falsy(false);
      expect(isFalsy).to.equal(true);
    });

    it('should return false when value is a string', function () {
      const isFalsy = Is.falsy('false');
      expect(isFalsy).to.equal(false);
    });

    it('should return true when value is an empty string', function () {
      const isFalsy = Is.falsy('');
      expect(isFalsy).to.equal(true);
    });
  });

  context('Regexp', function () {
    it('should return false when input is not a valid url', function () {
      const isUrl = Is.url('foo');
      expect(isUrl).to.equal(false);
    });

    it('should return false when input does not contain protocol', function () {
      const isUrl = Is.url('www.foo.com');
      expect(isUrl).to.equal(false);
    });

    it('should return true when input is a valid http url', function () {
      const isUrl = Is.url('http://foo.com');
      expect(isUrl).to.equal(true);
    });

    it('should return true when input is a valid https url', function () {
      const isUrl = Is.url('https://foo.com');
      expect(isUrl).to.equal(true);
    });

    it('should return true when input contains something else than .com', function () {
      const isUrl = Is.url('https://foo.in');
      expect(isUrl).to.equal(true);
    });

    it('should return true when input contains multi level TLD', function () {
      const isUrl = Is.url('https://foo.co.in');
      expect(isUrl).to.equal(true);
    });

    it('should return true when input contains 63 characters TLD', function () {
      const isUrl = Is.url('https://example.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijk');
      expect(isUrl).to.equal(true);
    });

    it('should return false when input contains more than 63 characters TLD', function () {
      const isUrl = Is.url('https://example.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijkl');
      expect(isUrl).to.equal(false);
    });

    it('should return false when input is not a valid email', function () {
      const isEmail = Is.email('mail');
      expect(isEmail).to.equal(false);
    });

    it('should return false when input is a url instead of email', function () {
      const isEmail = Is.email('http://foo.com');
      expect(isEmail).to.equal(false);
    });

    it('should return true when input is a valid email address', function () {
      const isEmail = Is.email('someone@example.com');
      expect(isEmail).to.equal(true);
    });

    it('should return true when input is a valid email address with different TLD', function () {
      const isEmail = Is.email('someone@example.org');
      expect(isEmail).to.equal(true);
    });

    it('should return true when input is a valid email address with 63 characters TLD', function () {
      const isEmail = Is.email('someone@example.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijk');
      expect(isEmail).to.equal(true);
    });

    it('should return false when input is not a valid email address with more than 63 characters TLD', function () {
      const isEmail = Is.email('someone@example.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijkl');
      expect(isEmail).to.equal(false);
    });

    it('should return true when input is a valid phone number', function () {
      const isPhone = Is.phone('1235599809');
      expect(isPhone).to.equal(true);
    });

    it('should return true when input is a valid phone number with hyphens', function () {
      const isPhone = Is.phone('123-559-9809');
      expect(isPhone).to.equal(true);
    });

    it('should return true when input is a valid fax phone number ', function () {
      const isPhone = Is.phone('123.559.9809');
      expect(isPhone).to.equal(true);
    });

    it('should return false when input is not a valid credit card number', function () {
      const isCreditCard = Is.creditCard('3685-1600-4490-1023');
      expect(isCreditCard).to.equal(false);
    });

    it('should return true when input is not a valid credit card number', function () {
      const isCreditCard = Is.creditCard('4444-4444-4444-4444');
      expect(isCreditCard).to.equal(true);
    });

    it('should return true when input is not a valid credit card number without hyphens', function () {
      const isCreditCard = Is.creditCard('4444444444444444');
      expect(isCreditCard).to.equal(true);
    });

    it('should return false when input contains special characters', function () {
      const isAlphaNumeric = Is.alphaNumeric('hellowo$ld');
      expect(isAlphaNumeric).to.equal(false);
    });

    it('should return true when input contains letters only', function () {
      const isAlphaNumeric = Is.alphaNumeric('hello');
      expect(isAlphaNumeric).to.equal(true);
    });

    it('should return true when input contains letters and numbers both', function () {
      const isAlphaNumeric = Is.alphaNumeric('hello123');
      expect(isAlphaNumeric).to.equal(true);
    });

    it('should return true when input letters only', function () {
      const isAlphaNumeric = Is.alphaNumeric(123);
      expect(isAlphaNumeric).to.equal(true);
    });

    it('should return true when input is yes', function () {
      const isAffirmative = Is.affirmative('yes');
      expect(isAffirmative).to.equal(true);
    });

    it('should return true when input is ok', function () {
      const isAffirmative = Is.affirmative('ok');
      expect(isAffirmative).to.equal(true);
    });

    it('should return true when input is okay', function () {
      const isAffirmative = Is.affirmative('okay');
      expect(isAffirmative).to.equal(true);
    });

    it('should return true when input is y', function () {
      const isAffirmative = Is.affirmative('y');
      expect(isAffirmative).to.equal(true);
    });

    it('should return true when input is A', function () {
      const isAffirmative = Is.affirmative('A');
      expect(isAffirmative).to.equal(true);
    });

    it('should return false when input is No', function () {
      const isAffirmative = Is.affirmative('no');
      expect(isAffirmative).to.equal(false);
    });

    it('should return true when is a valid ip address ', function () {
      const isIp = Is.ip('127.0.0.1');
      expect(isIp).to.equal(true);
    });

    it('should return true when is a valid ipv6 ip address ', function () {
      const isIp = Is.ip('1:2:3:4:5:6:7:8');
      expect(isIp).to.equal(true);
    });

    it('should return false when input is not a valid uuid', function () {
      const isUUID = Is.uuid('foo-dd-aa-ss-aa');
      expect(isUUID).to.equal(false);
    });

    it('should return true when input is a valid uuid', function () {
      const isUUID = Is.uuid('135b71db-ee7d-43ea-9f6d-16227fa82ad9');
      expect(isUUID).to.equal(true);
    });

  });

  context('Arthmetic', function () {
    it('should return true when 2 numeric values are same', function () {
      const isSame = Is.same(42, 40 + 2);
      expect(isSame).to.equal(true);
    });

    it('should return true when 2 string values are same', function () {
      const isSame = Is.same('yeah', 'yeah');
      expect(isSame).to.equal(true);
    });

    it('should return true when 2 boolean values are same', function () {
      const isSame = Is.same(true, true);
      expect(isSame).to.equal(true);
    });

    it('should return true when input is a even number', function () {
      const isEven = Is.even(4);
      expect(isEven).to.equal(true);
    });

    it('should return false when input is not a even number', function () {
      const isEven = Is.even(5);
      expect(isEven).to.equal(false);
    });

    it('should return false when input is not a number', function () {
      const isEven = Is.even('hello');
      expect(isEven).to.equal(false);
    });

    it('should return false when input is not a odd number', function () {
      const isOdd = Is.odd(4);
      expect(isOdd).to.equal(false);
    });

    it('should return true when input is a odd number', function () {
      const isOdd = Is.odd(5);
      expect(isOdd).to.equal(true);
    });

    it('should return true when input is greater than 0', function () {
      const isPositive = Is.positive(1);
      expect(isPositive).to.equal(true);
    });

    it('should return false when input is less than 0', function () {
      const isPositive = Is.positive(-42);
      expect(isPositive).to.equal(false);
    });

    it('should return true when input is less than 0', function () {
      const isNegative = Is.negative(-42);
      expect(isNegative).to.equal(true);
    });

    it('should return false when input is greater than 0', function () {
      const isNegative = Is.negative(42);
      expect(isNegative).to.equal(false);
    });

    it('should return true when input is greater than comparison input', function () {
      const isAbove = Is.above(42, 40);
      expect(isAbove).to.equal(true);
    });

    it('should return false when input is less than comparison input', function () {
      const isAbove = Is.above(42, 45);
      expect(isAbove).to.equal(false);
    });

    it('should return false when input is greater than comparison input', function () {
      const isUnder = Is.under(42, 40);
      expect(isUnder).to.equal(false);
    });

    it('should return true when input is less than comparison input', function () {
      const isUnder = Is.under(30, 40);
      expect(isUnder).to.equal(true);
    });

    it('should return true when input value is between comparison inputs', function () {
      const isBetween = Is.between(30, 20, 40);
      expect(isBetween).to.equal(true);
    });

    it('should return false when input value is not between comparison inputs', function () {
      const isBetween = Is.between(30, 35, 40);
      expect(isBetween).to.equal(false);
    });
  });

  context('Array', function () {
    it('should return true when value falls in an array', function () {
      const isInArray = Is.inArray(2, [1, 2, 3]);
      expect(isInArray).to.equal(true);
    });

    it('should return false when comparison array is not an array', function () {
      const isInArray = Is.inArray(2, 3);
      expect(isInArray).to.equal(false);
    });

    it('should return false when value does not fall in an array', function () {
      const isInArray = Is.inArray(2, [1, 3, 5]);
      expect(isInArray).to.equal(false);
    });

    it('should return false when array is not sorted', function () {
      const isSorted = Is.sorted([1, 2, 4, 1]);
      expect(isSorted).to.equal(false);
    });

    it('should return false when input is not an array', function () {
      const isSorted = Is.sorted(1);
      expect(isSorted).to.equal(false);
    });

    it('should return true when array is sorted', function () {
      const isSorted = Is.sorted([1, 2, 4, 5]);
      expect(isSorted).to.equal(true);
    });
  });

  context('Dates', function () {
    it('should return true when date is today', function () {
      const isToday = Is.today(new Date());
      expect(isToday).to.equal(true);
    });

    it('should return true when date is today and represented as string', function () {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      let day = date.getDate();
      day = day < 10 ? `0${day}` : day;
      const todayString = `${year}-${month}-${day}`;
      const isToday = Is.today(todayString);
      expect(isToday).to.equal(true);
    });

    it('should return true when date is yesterday and represented as string', function () {
      const date = new Date(new Date().setDate(new Date().getDate() - 1));
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      let day = date.getDate();
      day = day < 10 ? `0${day}` : day;
      const yesterdayString = `${year}-${month}-${day}`;
      const isYesterday = Is.yesterday(yesterdayString);
      expect(isYesterday).to.equal(true);
    });

    it('should return false when date is not yesterday', function () {
      const isYesterday = Is.yesterday('2001-11-02');
      expect(isYesterday).to.equal(false);
    });

    it('should return true when date is tomorrow and represented as string', function () {
      const date = new Date(new Date().setDate(new Date().getDate() + 1));
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      let day = date.getDate();
      day = day < 10 ? `0${day}` : day;
      const tomorrowString = `${year}-${month}-${day}`;
      const isTomorrow = Is.tomorrow(tomorrowString);
      expect(isTomorrow).to.equal(true);
    });

    it('should return false when date is not tomorrow', function () {
      const isTomorrow = Is.tomorrow('2001-11-04');
      expect(isTomorrow).to.equal(false);
    });

    it('should return false when date is not in past', function () {
      const isPast = Is.past('2200-11-05');
      expect(isPast).to.equal(false);
    });

    it('should return true when date is in past', function () {
      const isPast = Is.past('2001-11-01');
      expect(isPast).to.equal(true);
    });

    it('should return false when date is in past', function () {
      const isFuture = Is.future('2001-11-01');
      expect(isFuture).to.equal(false);
    });

    it('should return true when date is in future', function () {
      const isFuture = Is.future('2200-11-01');
      expect(isFuture).to.equal(true);
    });

    it('should return true when date between 2 dates', function () {
      const isInDateRange = Is.inDateRange('2015-11-20', '2015-11-10', '2015-11-30');
      expect(isInDateRange).to.equal(true);
    });

    it('should return false when min date expectation failed', function () {
      const isInDateRange = Is.inDateRange('2015-11-20', '2015-11-22', '2015-11-30');
      expect(isInDateRange).to.equal(false);
    });

    it('should return false when max date expectation failed', function () {
      const isInDateRange = Is.inDateRange('2015-11-20', '2015-11-10', '2015-11-15');
      expect(isInDateRange).to.equal(false);
    });
  });

  context('Array', function () {
    it('should return false when input array values are not in targeted array', function () {
      const doesIntersectAny = Is.intersectAny([10, 20], [30, 40, 50]);
      expect(doesIntersectAny).to.equal(false);
    });

    it('should return true when if of the values falls in targerted array', function () {
      const doesIntersectAny = Is.intersectAny([10, 20], [30, 10, 50]);
      expect(doesIntersectAny).to.equal(true);
    });

    it('should return false when input value is not an array', function () {
      const doesIntersectAny = Is.intersectAny(10, [30, 10, 50]);
      expect(doesIntersectAny).to.equal(false);
    });

    it('should return false when target value is not an array', function () {
      const doesIntersectAny = Is.intersectAny([10, 20], 10);
      expect(doesIntersectAny).to.equal(false);
    });

    it('should return false when input array values are not in targeted array', function () {
      const doesIntersectAny = Is.intersectAll([10, 20], [30, 40, 50]);
      expect(doesIntersectAny).to.equal(false);
    });

    it('should return false when any one value falls in targeted array', function () {
      const doesIntersectAny = Is.intersectAll([10, 20], [10, 40, 50]);
      expect(doesIntersectAny).to.equal(false);
    });

    it('should return true when all values falls in targeted array', function () {
      const doesIntersectAny = Is.intersectAll([10, 20], [10, 20, 50]);
      expect(doesIntersectAny).to.equal(true);
    });

    it('should return false when input value is not an array', function () {
      const doesIntersectAny = Is.intersectAll(10, [30, 10, 50]);
      expect(doesIntersectAny).to.equal(false);
    });

    it('should return false when target value is not an array', function () {
      const doesIntersectAny = Is.intersectAll([10, 20], 10);
      expect(doesIntersectAny).to.equal(false);
    });
  });

  context('Dates', function () {
    it('should make return false when date is not after defined offset', function () {
      const isAfterOffset = Is.afterOffsetOf(new Date(), 12, 'months');
      expect(isAfterOffset).to.equal(false);
    });

    it('should make return true when date is after defined offset', function () {
      const isAfterOffset = Is.afterOffsetOf(moment().add(13, 'months'), 12, 'months');
      expect(isAfterOffset).to.equal(true);
    });

    it('should make return false when date is not before defined offset', function () {
      const isBeforeOffset = Is.beforeOffsetOf(new Date(), 12, 'months');
      expect(isBeforeOffset).to.equal(false);
    });

    it('should make return true when date is after defined offset', function () {
      const isBeforeOffset = Is.beforeOffsetOf(moment().subtract(13, 'months'), 12, 'months');
      expect(isBeforeOffset).to.equal(true);
    });
  });
});
